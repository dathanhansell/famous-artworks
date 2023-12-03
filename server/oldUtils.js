const utils = {
    selectedAllRelated(db, relationTable, idColumn, id, artistTable, artPeriodTable) {
        const sql = `SELECT a.name as artist_name, a.birthdate, a.nationality, b.name as period_name, b.start_year, b.end_year, c.artist_id, c.art_period_id 
                  FROM ${relationTable} as c 
                  LEFT JOIN ${artistTable} as a ON c.artist_id = a.id 
                  LEFT JOIN ${artPeriodTable} as b ON c.art_period_id = b.id 
                  WHERE ${idColumn} = ?`;
        db.all(sql, [id], (err, rows) => {
            if (err) {
                throw err;
            }
            console.log(`Related records in ${relationTable} where ${idColumn} is ${id}:`);
            if (rows.length > 0) {
                const artPeriodData = {
                    id: rows[0].art_period_id,
                    name: rows[0].period_name,
                    start_year: rows[0].start_year,
                    end_year: rows[0].end_year
                };
                console.log(artPeriodData);
            }
            rows.forEach(row => {
                const artistData = {
                    id: row.artist_id,
                    name: row.artist_name,
                    birthdate: row.birthdate,
                    nationality: row.nationality
                };
                console.log(artistData);
            });
        });
    },


    selectLatest(db, table, idName) {
        const sql = `SELECT * FROM ${table} ORDER BY ${idName} DESC LIMIT 1`;

        db.get(sql, [], (err, row) => {
            if (err) {
                throw err;
            }
            console.log("Last inserted row: ", row, "\n");
        });
    },
    insertIntoTable(db, table, columns, values, idName = "id") {
        const placeholders = columns.map(() => '?').join(',');
        const stmt = db.prepare(`INSERT INTO ${table} (${columns.join(',')}) VALUES (${placeholders})`);

        stmt.run(values, function (err) {
            console.log("insertIntoTable()");
            if (err) {
                throw err;
            }
            console.log(`Inserted ${this.changes} row(s) into ${table} table`);
        });

        if (values.length === 2 && typeof values[0] === 'number' && typeof values[1] === 'number') {
            this.selectLinkedRows(db, columns, values);
        } else {
            this.selectLatest(db, table, idName);
        }

        stmt.finalize();
    },

    selectLinkedRows(db, columns, values) {
        columns.forEach((column, index) => {
            const table = column.replace(/_id$/, 's');
            const sql = `SELECT * FROM ${table} WHERE id = ?`;

            db.get(sql, [values[index]], (err, row) => {

                if (err) {
                    throw err;
                }
                console.log(`${table}: `, row);
            });

        });
    },
    selectById: (db, table, id) => {
        const sql = `SELECT * FROM ${table} WHERE id = ?`;
        db.get(sql, [id], (err, row) => {
            if (err) {
                throw err;
            }
            console.log(table, ": ", row, "\n");
        });
    },
    updateTable: (db, table, columns, values, id) => {
        let placeholders = columns.map((col) => `${col} = ?`).join(',');
        const sql = `UPDATE ${table} SET ${placeholders} WHERE id = ?`;
        db.run(sql, [...values, id], function (err) {
            console.log("updateTable()");
            if (err) {
                throw err;
            }
            console.log(`Updated ${this.changes} row(s) in ${table} table`, "\n");
        });
    },
    deleteFromTable: (db, table, id) => {
        const sql = `DELETE FROM ${table} WHERE id = ?`;
        db.run(sql, [id], function (err) {
            console.log("deleteFromTable()");
            if (err) {
                throw err;
            }
            console.log(`Deleted ${this.changes} row(s) from ${table} table`, "\n");
        });
    },
    deleteTable: (db, tableName) => {
        const sql = `DROP TABLE IF EXISTS ${tableName}`;
        db.run(sql, [], (err) => {
            console.log("deleteTable()");
            if (err) {
                throw err;
            }
            console.log(`Successfully deleted ${tableName} table`, "\n");
        });
    },
    getIdFromAttribute: (db, table, attributeName, attribute, callback) => {
        const sql = `SELECT id FROM ${table} WHERE ${attributeName} = ?`;
        db.get(sql, [attribute], (err, row) => {
            console.log("getIdFromAttribute()");
            if (err) {
                throw err;
            }
            if (!row) {
                console.log(`No matching record found in ${table} with ${attributeName} ${attribute}`, "\n");
            } else {
                callback(row.id);
            }
        });
    },
    sortByParameter: (db, table, column, order = 'ASC') => {

        const sql = `SELECT * FROM ${table} ORDER BY ${column} ${order}`;
        db.all(sql, [], (err, rows) => {
            console.log("sortByParameter()");
            if (err) {
                throw err;
            }
            console.log(rows, "\n");
        });
    },
    countRows: (db, table) => {

        const sql = `SELECT COUNT(*) as count FROM ${table}`;
        db.get(sql, [], (err, row) => {
            console.log("countRows()");
            if (err) {
                throw err;
            }
            console.log(`Number of rows in ${table}: ${row.count}`, "\n");
        });
    },
    searchByKeyword: (db, table, column, keyword) => {

        const sql = `SELECT * FROM ${table} WHERE ${column} LIKE ?`;
        db.all(sql, [`%${keyword}%`], (err, rows) => {
            console.log("searchByKeyword()");
            if (err) {
                throw err;
            }
            console.log(rows, "\n");
        });
    },
    selectByRange: (db, table, column, min, max) => {

        const sql = `SELECT * FROM ${table} WHERE ${column} BETWEEN ? AND ?`;
        db.all(sql, [min, max], (err, rows) => {
            console.log("selectByRange()");
            if (err) {
                throw err;
            }
            console.log(rows, "\n");
        });
    },

    selectWithLimit: (db, table, limit) => {

        const sql = `SELECT * FROM ${table} LIMIT ?`;
        db.all(sql, [limit], (err, rows) => {
            console.log("selectWithLimit()");
            if (err) {
                throw err;
            }
            console.log(rows, "\n");
        });
    },
    fetchDataWithOffset: (db, table, offset, limit) => {
        const sql = `SELECT * FROM ${table} LIMIT ? OFFSET ?`;
        db.all(sql, [limit, offset], (err, rows) => {
            console.log("fetchDataWithOffset()");
            if (err) {
                throw err;
            }
            console.log(rows, "\n");
        });
    },
    updateMultipleFields: (db, table, data, where) => {

        const setString = Object.keys(data).map(key => `${key} = ?`).join(', ');
        const sql = `UPDATE ${table} SET ${setString} WHERE ${where}`;
        db.run(sql, Object.values(data), function (err) {
            console.log("updateMultipleFields()");
            if (err) {
                throw err;
            }
            console.log(`Rows updated: ${this.changes}`, "\n");
        });
    },
    deleteByCondition: (db, table, condition) => {

        const sql = `DELETE FROM ${table} WHERE ${condition}`;
        db.run(sql, function (err) {
            console.log("deleteByCondition()");
            if (err) {
                throw err;
            }
            console.log(`Rows deleted: ${this.changes}`, "\n");
        });
    },
    joinTwoTables: (db, table1, table2, commonColumn) => {

        const sql = `SELECT * FROM ${table1} JOIN ${table2} ON ${table1}.${commonColumn} = ${table2}.${commonColumn}`;
        db.all(sql, [], (err, rows) => {
            console.log("joinTwoTables()");
            if (err) {
                throw err;
            }
            console.log(rows, "\n");
        });
    },
    countRowsWithValue: (db, table, column, value) => {

        const sql = `SELECT COUNT(*) as count FROM ${table} WHERE ${column} = ?`;
        db.get(sql, [value], (err, row) => {
            console.log("countRowsWithValue()");
            if (err) {
                throw err;
            }
            console.log(`Number of rows in ${table} where ${column} is ${value}: ${row.count}`, "\n");
        });
    },
    updateById: (db, table, column, value, id) => {

        const sql = `UPDATE ${table} SET ${column} = ? WHERE id = ?`;
        db.run(sql, [value, id], function (err) {
            console.log("updateById()");
            if (err) {
                throw err;
            }
            console.log(`Updated ${this.changes} row(s) in ${table} table`, "\n");
        });
    },
    getMaxValue: (db, table, column) => {

        const sql = `SELECT MAX(${column}) as max FROM ${table}`;
        db.get(sql, [], (err, row) => {
            console.log("getMaxValue()");
            if (err) {
                throw err;
            }
            console.log(`Maximum value of ${column} in ${table}: ${row.max}`, "\n");
        });
    },
    getMinValue: (db, table, column) => {

        const sql = `SELECT MIN(${column}) as min FROM ${table}`;
        db.get(sql, [], (err, row) => {
            console.log("getMinValue()");
            if (err) {
                throw err;
            }
            console.log(`Minimum value of ${column} in ${table}: ${row.min}`, "\n");
        });
    },
    getAvgValue: (db, table, column) => {

        const sql = `SELECT AVG(${column}) as avg FROM ${table}`;
        db.get(sql, [], (err, row) => {
            console.log("getAvgValue()");
            if (err) {
                throw err;
            }
            console.log(`Average value of ${column} in ${table}: ${row.avg}`, "\n");
        });
    },
};