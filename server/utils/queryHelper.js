const db = require('../models/db');

const joinTables = (primaryTable, secondaryTable, relationTable, primaryKey, secondaryKey, primaryId) => {
    return new Promise((resolve, reject) => {
        const query = `
      SELECT ${primaryTable}.*
      FROM ${primaryTable}
      INNER JOIN ${relationTable} ON ${primaryTable}.id = ${relationTable}.${primaryKey}
      WHERE ${relationTable}.${secondaryKey} = ?
    `;

        db.all(query, primaryId, (err, results) => {
            if (err) {
                reject(err);
            }
            resolve(results);
        });
    });
};

module.exports = {
    joinTables,
};
