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


const joinTwoTables = (primaryTable, secondaryTable, relationTable,  primaryId) => {
    return new Promise((resolve, reject) => {
        let primaryKey = tableToID(primaryTable);
        let secondaryKey = tableToID(secondaryTable);
        const query = `
            SELECT ${primaryTable}.*
            FROM ${primaryTable}
            INNER JOIN ${relationTable} ON ${primaryTable}.id = ${relationTable}.${primaryKey}
            WHERE ${relationTable}.${secondaryKey} = ?
        `;
        //console.log(query);
        //console.log("primaryId",primaryId);
        db.all(query, primaryId, (err, results) => {
            if (err) {
                reject(err);
            }
            resolve(results);
        });
    });
};



const joinThreeTables = (primaryTable, secondaryTable, middleTable, relationTable1, relationTable2, secondaryId) => {
    return new Promise((resolve, reject) => {
        let primaryKey1 = tableToID(primaryTable);
        let middleKey = tableToID(middleTable);
        let secondaryKey = tableToID(secondaryTable);

        const query = `
            SELECT ${primaryTable}.*
            FROM ${primaryTable}
            JOIN ${relationTable1} ON ${primaryTable}.id = ${relationTable1}.${primaryKey1}
            JOIN ${relationTable2} ON ${relationTable1}.${middleKey} = ${relationTable2}.${middleKey}
            WHERE ${relationTable2}.${secondaryKey} = ?
            GROUP BY ${primaryTable}.id
        `;
        //console.log(query);
        //console.log(secondaryId);
        db.all(query, [secondaryId], (err, results) => {
            if (err) {
                reject(err);
            }
            resolve(results);
        });
    });
};




const getItemsByParameter = async (req, res,table1, table2, relation1, relation2,table3) => {
    //console.log("params",req.params);
    const paramId = req.params[`${removeTrailingS(table2)}Id`];
    //console.log("table2",table2);
    //console.log("paramId",paramId);
    try {
        let items;
        if (relation2) {
            items = await joinThreeTables(table1, table2,table3, relation1, relation2,paramId);
        } else {
            items = await joinTwoTables(table1, table2, relation1, paramId);
        }
        res.send(items);
    } catch (err) {
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

const updateRelation = (tableName, id, relatedIds) => {
    // Check if relatedIds is an array
    if (!Array.isArray(relatedIds)) {
        console.error('relatedIds must be an array');
        return;
    }
    for (let relatedId of relatedIds) {
        let stmt = db.prepare(`INSERT INTO ${tableName} VALUES (?, ?)`);
        stmt.run(id, relatedId);
    }
};





function tableToID(str) {
    return str.slice(0, -1) + '_id';
};

function removeTrailingS(str) {
    return str.endsWith('s') ? str.slice(0, -1) : str;
};
function tableToID(str) {
    return removeTrailingS(str) + '_id';
};
const getRecords = (tableName, page, limit, res) => {
    if (page && limit) {
        const offset = (page - 1) * limit;
        db.all(`SELECT * FROM ${tableName} LIMIT ? OFFSET ?`, [limit, offset], (err, rows) => {
            if (err) {
                throw err;
            }
            res.send(rows);
        });
    } else {
        db.all(`SELECT * FROM ${tableName}`, (err, rows) => {
            if (err) {
                throw err;
            }
            res.send(rows);
        });
    }
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
}
function createRouter(tableName, fields) {
    const router = express.Router();
    router.get(`/${tableName}/:id`, (req, res) =>  getRecordWithID(tableName, req.params.id, res));
    router.get(`/${tableName}/search`, (req, res) => getRecordsLike(tableName, fields[0],req, res));
    router.get(`/${tableName}`, (req, res) => getRecords(tableName, req.query.page, req.query.limit, res));

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
};
