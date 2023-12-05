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
const relations_map = [
    {from: 'artworks', to: 'artists', through: 'created_by'},
    {from: 'artists', to: 'artworks', through: 'created_by'},
    {from: 'artworks', to: 'museums', through: 'belongs_to'},
    {from: 'collectors', to: 'artworks', through: 'owned_by'},
    {from: 'art_periods', to: 'artists', through: 'lived_in'},
    {from: 'artworks', to: 'art_periods', through: 'included_in'},
    {from: 'artists', to: 'art_styles', indirect: {through: 'created_by', via: 'falls_under', on: 'artworks'}},
    {from: 'art_styles', to: 'artists', indirect: {through: 'falls_under', via: 'created_by', on: 'artworks'}},
    {from: 'artworks', to: 'collectors', through: 'owned_by'},
    {from: 'artworks', to: 'art_styles', through: 'falls_under'},
    {from: 'artists', to: 'art_periods', through: 'lived_in'},
    {from: 'museums', to: 'artworks', through: 'belongs_to'},
    {from: 'art_periods', to: 'artworks', through: 'included_in'},
    {from: 'artists', to: 'museums', indirect: {through: 'created_by', via: 'belongs_to', on: 'artworks'}},
    {from: 'museums', to: 'artists', indirect: {through: 'belongs_to', via: 'created_by', on: 'artworks'}},
    {from: 'art_styles', to: 'artworks', through: 'falls_under'},
    {from: 'collectors', to: 'art_styles', indirect: {through: 'owned_by', via: 'falls_under', on: 'artworks'}},
    {from: 'art_styles', to: 'collectors', indirect: {through: 'falls_under', via: 'owned_by', on: 'artworks'}},
    {from: 'artists', to: 'collectors', indirect: {through: 'created_by', via: 'owned_by', on: 'artworks'}},
    {from: 'collectors', to: 'artists', indirect: {through: 'owned_by', via: 'created_by', on: 'artworks'}},
    {from: 'museums', to: 'art_periods', indirect: {through: 'belongs_to', via: 'included_in', on: 'artworks'}},
    {from: 'art_periods', to: 'museums', indirect: {through: 'included_in', via: 'belongs_to', on: 'artworks'}},
    {from: 'museums', to: 'art_styles', indirect: {through: 'belongs_to', via: 'falls_under', on: 'artworks'}},
    {from: 'art_styles', to: 'museums', indirect: {through: 'Falls_under', via: 'belongs_to', on: 'artworks'}},
    {from: 'museums', to: 'collectors', indirect: {through: 'belongs_to', via: 'owned_by', on: 'artworks'}},
    {from: 'collectors', to: 'museums', indirect: {through: 'owned_by', via: 'belongs_to', on: 'artworks'}},
    {from: 'art_periods', to: 'art_styles', indirect: {through: 'included_in', via: 'falls_under', on: 'artworks'}},
    {from: 'art_styles', to: 'art_periods', indirect: {through: 'falls_under', via: 'included_in', on: 'artworks'}},
    {from: 'art_periods', to: 'collectors', indirect: {through: 'included_in', via: 'owned_by', on: 'artworks'}},
    {from: 'collectors', to: 'art_periods', indirect: {through: 'owned_by', via: 'included_in', on: 'artworks'}},
    ];

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
};

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

const deleteRelation = (tableName,srcTable, id) => {
    let stmt = db.prepare(`DELETE FROM ${tableName} WHERE ${tableToID(srcTable)} = ?`);
    stmt.run(id, function(err) {
        if (err) {
            console.log(`Error deleting relation in ${tableName} for id ${id}: ${err.message}`);
        }
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
        console.log(req.body);

        // Update related tables
        const relatedTables = relations_map.filter(relation => relation.from === tableName);
        relatedTables.forEach(relation => {
            console.log(relation);
            console.log(relation.to);
            console.log(req.body[relation.through]);
            if(req.body[relation.through]) {
                deleteRelation(relation.through, tableName, id);
                updateRelation(tableName, relation.to, id, req.body[relation.through],relation.through);
            }
        });
        res.send("Data updated successfully!");
    });
};

const createRecord = (tableName, fields, req, res) => {
    console.log("fields",fields);
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
        const relatedTables = relations_map.filter(relation => relation.from === tableName);
    relatedTables.forEach(relation => {
        if(req.body[relation.to]) {
            updateRelation(tableName, relation.to, id, req.body[relation.through],relation.through);
        }
    });
    
        res.send("Data inserted successfully!");
    });
};

const updateRelation = (srcTable, targetTable, srcId, targetId,relation) => {
    let stmt;
    const srcColumn = `${removeTrailingS(srcTable)}_id`;  // e.g., "artist_id" or "artwork_id"
    const targetColumn = `${removeTrailingS(targetTable)}_id`;  // e.g., "artist_id" or "artwork_id"
    
    if (Array.isArray(targetId)) {
        targetId.forEach(id => {
            console.log(`INSERT INTO ${relation} (${srcColumn}, ${targetColumn}) VALUES (${srcId}, ${id})`);
            stmt = db.prepare(`INSERT INTO ${relation} (${srcColumn}, ${targetColumn}) VALUES (?, ?)`);
            stmt.run(srcId, id);
        });
    } else {
        console.log(`INSERT INTO ${relation} (${srcColumn}, ${targetColumn}) VALUES (${srcId}, ${targetId})`);
        stmt = db.prepare(`INSERT INTO ${relation} (${srcColumn}, ${targetColumn}) VALUES (?, ?)`);
        stmt.run(srcId, targetId);
    }
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
};

const getRecords = (tableName, page=0, limit, sort, direction, res) => {
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
};
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
};
function getTotalCount(tableName, res) {
    db.get(`SELECT COUNT(*) as count FROM ${tableName}`, (err, row) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: err.message });
        } else {
            res.json({ count: row.count });
        }
    });
};
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
};

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
