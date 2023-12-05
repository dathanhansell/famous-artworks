const db = require('../models/db');
const express = require('express');
const relations = {
    "artists": ["created_by", "lived_in"],
    "artworks": ["created_by", "belongs_to", "included_in", "owned_by", "falls_under"],
    "art_periods": ["included_in", "lived_in"],
    "museums": ["belongs_to"],
    "collectors": ["owned_by"],
    "art_styles": ["falls_under"],
};


const joinTwoTables = (primaryTable, secondaryTable, relationTable, primaryId, sort, order, limit) => {
    return new Promise((resolve, reject) => {
        let primaryKey = tableToID(primaryTable);
        let secondaryKey = tableToID(secondaryTable);
        let query = `
            SELECT ${primaryTable}.*
            FROM ${primaryTable}
            INNER JOIN ${relationTable} ON ${primaryTable}.id = ${relationTable}.${primaryKey}
            WHERE ${relationTable}.${secondaryKey} = ?
        `;
console.log(sort,order)
        if(sort&& order) {
            query += ` ORDER BY ${primaryTable}.${sort} ${order.toUpperCase()}`;
        }

        if(limit) {
            query += ` LIMIT ?`;
        }

        db.all(query, limit ? [primaryId, limit] : [primaryId], (err, results) => {
            if (err) {
                reject(err);
            }
            resolve(results);
        });
    });
};

const joinThreeTables = (primaryTable, secondaryTable, middleTable, relationTable1, relationTable2, secondaryId, sort, order, limit) => {
    return new Promise((resolve, reject) => {
        let primaryKey1 = tableToID(primaryTable);
        let middleKey = tableToID(middleTable);
        let secondaryKey = tableToID(secondaryTable);

        let query = `
            SELECT ${primaryTable}.*
            FROM ${primaryTable}
            JOIN ${relationTable1} ON ${primaryTable}.id = ${relationTable1}.${primaryKey1}
            JOIN ${relationTable2} ON ${relationTable1}.${middleKey} = ${relationTable2}.${middleKey}
            WHERE ${relationTable2}.${secondaryKey} = ?
            GROUP BY ${primaryTable}.id
        `;
        console.log("sort",sort,"order",order);
        if(sort&&order) {
            
            query += ` ORDER BY ${primaryTable}.${sort} ${order.toUpperCase()}`;
        }

        if(limit) {
            query += ` LIMIT ?`;
        }

        db.all(query, limit ? [secondaryId, limit] : [secondaryId], (err, results) => {
            if (err) {
                reject(err);
            }
            resolve(results);
        });
    });
};

function getEntitiesWithMostRelationsIndirect(entity1, entity2, middleTable, relationTable1, relationTable2, limit,  res) {
    const query = `
        SELECT ${entity1}.*, COUNT(DISTINCT ${entity2}.id) AS count
        FROM ${entity1}
        JOIN ${relationTable1} ON ${entity1}.id = ${relationTable1}.${tableToID(entity1)}
        JOIN ${middleTable} ON ${relationTable1}.${tableToID(middleTable)} = ${middleTable}.id
        JOIN ${relationTable2} ON ${middleTable}.id = ${relationTable2}.${tableToID(middleTable)}
        JOIN ${entity2} ON ${entity2}.id = ${relationTable2}.${tableToID(entity2)}
        GROUP BY ${entity1}.id
        ORDER BY count DESC
        LIMIT ?
    `;
    console.log(query);

    db.all(query, [limit], (err, rows) => {
        if (err) {
            throw err;
        }
        res.send(rows);
    });
}




const getItemsByParameter = async (req, res, table1, table2, relation1, relation2, table3) => {
    console.log(`Parameters: table1=${table1}, table2=${table2}, relation1=${relation1}, relation2=${relation2}, table3=${table3}`);
    const paramId = req.params[`${table2}Id`];
    const { sort,direction,limit } = req.query;
    console.log("sort",sort,"order",direction);
    try {
        let items;
        if (relation2) {
            items = await joinThreeTables(table1, table2, table3, relation1, relation2, paramId, sort, direction, limit);
        } else {
            items = await joinTwoTables(table1, table2, relation1, paramId, sort, direction, limit);
        }
        console.log(`Items: ${JSON.stringify(items)}`);
        res.send(items);
        console.log(`Response status code: ${res.statusCode}`);
    } catch (err) {
        console.log(`Error in getItemsByParameter: ${err.message}`);
        res.status(500).send(err.message);
    }
};



const deleteRecord = (tableName, id, req, res) => {

    let stmt = db.prepare(`DELETE FROM ${tableName} WHERE id = ?`);
    stmt.run(id, (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log(`Record deleted successfully`);
        res.send("Record deleted successfully!");
    });
};

const updateRecord = (tableName, fields, id, req, res) => {
    const fieldNames = Object.keys(fields);
    const fieldValues = Object.values(fields);

    // Check if all required fields are provided
    for (let fieldName of fieldNames) {
        if (req.body[fieldName] === undefined) {
            return res.sendStatus(400);
        }
    }

    let assignments = fieldNames.map((name) => `${name} = ?`).join(',');
    let stmt = db.prepare(`UPDATE ${tableName} SET ${assignments} WHERE id = ?`);
    
    stmt.run(...fieldValues, id, (err) => {
        if (err) {
            return console.error(err.message);
        }
        res.send("Data updated successfully!");
    });
};
const createRecord = (tableName, fields, req, res) => {
    console.log("fields",fields)
    const fieldNames = Object.keys(fields);
    const fieldValues = Object.values(fields);

    // Check if all required fields are provided
    for (let fieldName of fieldNames) {
        if (!req.body[fieldName]) {
            return res.sendStatus(400);
        }
    }

    let placeholders = fieldNames.map(() => '?').join(',');
    let stmt = db.prepare(`INSERT INTO ${tableName} (${fieldNames.join(',')}) VALUES (${placeholders})`);
    stmt.run(...fieldValues, function(err) {
        if (err) {
            return console.error(err.message);
        }

        const id = this.lastID;  // ID of the last inserted record

        // Update related tables
        const relatedTables = relations[tableName];
        for (let relatedTable of relatedTables) {
            updateRelation(relatedTable, id, req.body[relatedTable]);
        }

        res.send("Data inserted successfully!");
    });
};

const updateRelation = (tableName, id, relatedId) => {

        let stmt = db.prepare(`INSERT INTO ${tableName} VALUES (?, ?)`);
        console.log("id",id,"relatedId",relatedId);
        stmt.run(id, relatedId);
    
};


function getEntitiesWithMostRelations(entity1, entity2, relationTable, limit, res) {
    const query = `
        SELECT ${entity1}.*, COUNT(${entity2}.id) AS count
        FROM ${entity1}
        JOIN ${relationTable} ON ${entity1}.id = ${relationTable}.${tableToID(entity1)}
        JOIN ${entity2} ON ${entity2}.id = ${relationTable}.${tableToID(entity2)}
        GROUP BY ${entity1}.id
        ORDER BY count DESC
        LIMIT ?
    `;
    console.log(query);
    console.log("limit",limit); 

    db.all(query,limit, (err, rows) => {
        if (err) {
            throw err;
        }
        res.send(rows);
    });
}
function getEntitiesWithAverageRelations(entity1, entity2, relationTable, req, res) {
    const query = `
        SELECT AVG(artwork_count) AS average
        FROM (
            SELECT COUNT(${entity2}.id) AS artwork_count
            FROM ${entity1}
            JOIN ${relationTable} ON ${entity1}.id = ${relationTable}.${tableToID(entity1)}
            JOIN ${entity2} ON ${entity2}.id = ${relationTable}.${tableToID(entity2)}
            GROUP BY ${entity1}.id
        )
    `;
    console.log(query);

    db.get(query, (err, row) => {
        if (err) {
            throw err;
        }
        res.send(row);
    });
}







function removeTrailingS(str) {
    console.log("removetrailings",str.endsWith('s') ? str.slice(0, -1) : str);
    return str.endsWith('s') ? str.slice(0, -1) : str;
};
function tableToID(str) {
    return removeTrailingS(str) + '_id';
};const getRecords = (tableName, page=0, limit, sort, direction, res) => {
    if (!sort) sort = 'id'; // Default sort column
    if (!direction) direction = 'ASC'; // Default sort direction

    if (page !== undefined && limit !== undefined) {
        const offset = (page - 1) * limit;
        db.all(`SELECT COUNT(*) as total FROM ${tableName}`, [], (err, totalRows) => {
            if (err) {
                throw err;
            }
            const total = totalRows[0].total;
            const totalPages = Math.ceil(total / limit);
            db.all(`SELECT * FROM ${tableName} ORDER BY ${sort} ${direction} LIMIT ? OFFSET ?`, [limit, offset], (err, rows) => {
                if (err) {
                    throw err;
                }
                res.send({data: rows, meta: {totalPages, total}});
            });
        });
    } else {
        db.all(`SELECT * FROM ${tableName} ORDER BY ${sort} ${direction}`, (err, rows) => {
            if (err) {
                throw err;
            }
            res.send({data: rows, meta: {}}); // Send meta as an empty object when there's no page or limit
        });
    }
};





const getMostCommonValue=(table,req, res)=> {
    const { columnName } = req.params;

    const query = `
        SELECT ${columnName}, COUNT(${columnName}) AS count
        FROM ${table}
        WHERE ${columnName} IS NOT NULL AND ${columnName} != ''
        GROUP BY ${columnName}
        ORDER BY count DESC
        LIMIT 1
    `;
    db.get(query, (err, row) => {
        if (err) {
            throw err;
        }
        res.send(row);
    });
}
const getRecordsLike = async (tableName, columnName, req, res) => {
    let searchText = req.query.text;
    console.log('searchText', searchText);
    db.all(`
        SELECT *
        FROM ${tableName}
        WHERE ${columnName} LIKE ?
    `, `%${searchText}%`, (err, rows) => {
        if (err) {
            throw err;
        }
        res.send(rows);
    });
};
const getRecordWithID = (tableName, id, res) => {
    db.get(`SELECT * FROM ${tableName} WHERE id = ?`, id, (err, row) => {
        if (err) {
            throw err;
        }
        res.send(row);
    });
}
function getTotalCount(tableName, res) {
    db.get(`SELECT COUNT(*) as count FROM ${tableName}`, (err, row) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: err.message });
        } else {
            res.json({ count: row.count });
        }
    });
}


function createRouter(tableName, fields) {
    const router = express.Router();
    router.use((req, res, next) => {
        console.log(`Accessed route: ${req.originalUrl}`);
        next();
    });

    router.get(`/${tableName}/:id`, (req, res) =>  getRecordWithID(tableName, req.params.id, res));
    router.get(`/${tableName}/api/search`, (req, res) => getRecordsLike(tableName, fields[0],req, res));
    router.get(`/${tableName}/api/count`, (req, res) => getTotalCount(tableName, res));
    router.get(`/${tableName}`, (req, res) => getRecords(tableName, req.query.page, req.query.limit, req.query.sort, req.query.direction, res));
    router.get(`/${tableName}/most_common/:columnName`, (req, res) => getMostCommonValue(tableName,req,res));
    router.post(`/${tableName}`, (req, res) => createRecord(tableName, getFields(req, fields), req, res));
    router.delete(`/${tableName}/:id`, (req, res) => deleteRecord(tableName, req.params.id, req, res));
    router.put(`/${tableName}/:id`, (req, res) => updateRecord(tableName, getFields(req, fields), req.params.id, req, res));
    
    function getFields(req, fields) {
        let result = {};
        fields.forEach(field => {
            result[field] = req.body[field];
        });
        return result;
    }

    return router;
}



module.exports = {
    joinTwoTables,
    joinThreeTables,
    getItemsByParameter,
    removeTrailingS,
    createRecord,
    deleteRecord,
    updateRecord,
    getAllRecords: getRecords,
    getRecordsLike,
    createRouter,
    getEntitiesWithMostRelations,
    getTotalCount,
    getEntitiesWithAverageRelations,
    getEntitiesWithMostRelationsIndirect,
    getMostCommonValue
};
