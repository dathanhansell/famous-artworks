const db = require('../models/db');

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


function tableToID(str) {
    return str.slice(0, -1) + '_id';
};

function removeTrailingS(str) {
    return str.endsWith('s') ? str.slice(0, -1) : str;
};
function tableToID(str) {
    return removeTrailingS(str) + '_id';
};

module.exports = {
    joinTwoTables,
    joinThreeTables,
    getItemsByParameter,
    removeTrailingS,
};
