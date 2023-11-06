const sqlite3 = require("sqlite3").verbose();
const fs = require('fs');

// Delete the ./data.sqlite file
try {
  fs.unlinkSync('./data.sqlite');
  console.log('Successfully deleted ./data.sqlite');
} catch (err) {
  console.error('Error while deleting ./data.sqlite', err);
}
const db = new sqlite3.Database("./data.sqlite");

const utils = {
      selectLatest: (db, tableName, idName) => {
        const sql = `SELECT * FROM ${tableName} ORDER BY ${idName} DESC LIMIT 1`;
        db.get(sql, [], (err, row) => {
          if (err) {
            throw err;
          }
          console.log("Last inserted row: ", row,"\n");
        });
      },
      insertIntoTable: (db, table, columns, values, idName="id") => {
        let placeholders = columns.map(() => '?').join(',');
        const sql = `INSERT INTO ${table} (${columns.join(',')}) VALUES (${placeholders})`;
        db.run(sql, values, function(err) {
          if (err) {
            throw err;
          }
          console.log(`Inserted ${this.changes} row(s) into ${table} table`,"\n");
        });
      },
      selectById: (db, table, id) => {
        const sql = `SELECT * FROM ${table} WHERE id = ?`;
        db.get(sql, [id], (err, row) => {
          if (err) {
            throw err;
          }
          console.log(table,": ", row,"\n");
        });
      },
      updateTable: (db, table, columns, values, id) => {
        let placeholders = columns.map((col) => `${col} = ?`).join(',');
        const sql = `UPDATE ${table} SET ${placeholders} WHERE id = ?`;
        db.run(sql, [...values, id], function(err) {
          if (err) {
            throw err;
          }
          console.log(`Updated ${this.changes} row(s) in ${table} table`,"\n");
        });
      },
      deleteFromTable: (db, table, id) => {
        const sql = `DELETE FROM ${table} WHERE id = ?`;
        db.run(sql, [id], function(err) {
          if (err) {
            throw err;
          }
          console.log(`Deleted ${this.changes} row(s) from ${table} table`,"\n");
        });
      },
      deleteTable: (db, tableName) => {
        const sql = `DROP TABLE IF EXISTS ${tableName}`;
        db.run(sql, [], (err) => {
          if (err) {
            throw err;
          }
          console.log(`Successfully deleted ${tableName} table`,"\n");
        });
      },
      getIdFromAttribute: (db, table, attributeName, attribute, callback) => {
        const sql = `SELECT id FROM ${table} WHERE ${attributeName} = ?`;
        db.get(sql, [attribute], (err, row) => {
          if (err) {
            throw err;
          }
          if (!row) {
            console.log(`No matching record found in ${table} with ${attributeName} ${attribute}`,"\n");
          } else {
            callback(row.id);
          }
        });
      },
      sortByParameter: (db, table, column, order = 'ASC') => {
      const sql = `SELECT * FROM ${table} ORDER BY ${column} ${order}`;
      db.all(sql, [], (err, rows) => {
          if (err) {
              throw err;
          }
          console.log(rows,"\n");
      });
      },
      countRows: (db, table) => {
      const sql = `SELECT COUNT(*) as count FROM ${table}`;
      db.get(sql, [], (err, row) => {
          if (err) {
              throw err;
          }
          console.log(`Number of rows in ${table}: ${row.count}`,"\n");
      });
      },
      searchByKeyword: (db, table, column, keyword) => {
      const sql = `SELECT * FROM ${table} WHERE ${column} LIKE ?`;
      db.all(sql, [`%${keyword}%`], (err, rows) => {
          if (err) {
              throw err;
          }
          console.log(rows,"\n");
      });
      },
      selectByRange: (db, table, column, min, max) => {
      const sql = `SELECT * FROM ${table} WHERE ${column} BETWEEN ? AND ?`;
      db.all(sql, [min, max], (err, rows) => {
          if (err) {
              throw err;
          }
          console.log(rows,"\n");
      });
      },

      selectWithLimit: (db, table, limit) => {
      const sql = `SELECT * FROM ${table} LIMIT ?`;
      db.all(sql, [limit], (err, rows) => {
          if (err) {
              throw err;
          }
          console.log(rows,"\n");
      });
      },
      fetchDataWithOffset: (db, table, offset, limit) => {
      const sql = `SELECT * FROM ${table} LIMIT ? OFFSET ?`;
      db.all(sql, [limit, offset], (err, rows) => {
          if (err) {
              throw err;
          }
          console.log(rows,"\n");
      });
      },
      updateMultipleFields: (db, table, data, where) => {
      const setString = Object.keys(data).map(key => `${key} = ?`).join(', ');
      const sql = `UPDATE ${table} SET ${setString} WHERE ${where}`;
        db.run(sql, Object.values(data), function(err) {
            if (err) {
                throw err;
            }
            console.log(`Rows updated: ${this.changes}`,"\n");
        });
      },
      deleteByCondition: (db, table, condition) => {
      const sql = `DELETE FROM ${table} WHERE ${condition}`;
      db.run(sql, function(err) {
          if (err) {
              throw err;
          }
          console.log(`Rows deleted: ${this.changes}`,"\n");
      });
      },
      joinTwoTables: (db, table1, table2, commonColumn) => {
      const sql = `SELECT * FROM ${table1} JOIN ${table2} ON ${table1}.${commonColumn} = ${table2}.${commonColumn}`;
      db.all(sql, [], (err, rows) => {
          if (err) {
              throw err;
          }
          console.log(rows,"\n");
      });
      },
      countRowsWithValue: (db, table, column, value) => {
        const sql = `SELECT COUNT(*) as count FROM ${table} WHERE ${column} = ?`;
        db.get(sql, [value], (err, row) => {
          if (err) {
            throw err;
          }
          console.log(`Number of rows in ${table} where ${column} is ${value}: ${row.count}`,"\n");
        });
      },
      updateColumnById: (db, table, column, value, id) => {
        const sql = `UPDATE ${table} SET ${column} = ? WHERE id = ?`;
        db.run(sql, [value, id], function(err) {
          if (err) {
            throw err;
          }
          console.log(`Updated ${this.changes} row(s) in ${table} table`,"\n");
        });
      },
      getMaxValue: (db, table, column) => {
        const sql = `SELECT MAX(${column}) as max FROM ${table}`;
        db.get(sql, [], (err, row) => {
          if (err) {
            throw err;
          }
          console.log(`Maximum value of ${column} in ${table}: ${row.max}`,"\n");
        });
      },
      getMinValue: (db, table, column) => {
        const sql = `SELECT MIN(${column}) as min FROM ${table}`;
        db.get(sql, [], (err, row) => {
          if (err) {
            throw err;
          }
          console.log(`Minimum value of ${column} in ${table}: ${row.min}`,"\n");
        });
      },
      getAvgValue: (db, table, column) => {
        const sql = `SELECT AVG(${column}) as avg FROM ${table}`;
        db.get(sql, [], (err, row) => {
          if (err) {
            throw err;
          }
          console.log(`Average value of ${column} in ${table}: ${row.avg}`,"\n");
        });
      },
  };
  
db.serialize(() => {
  console.log("Starting database serialization...");

// creating data tables
  db.run("CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT, name TEXT)");
  db.run("CREATE TABLE artists (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, birthdate TEXT, nationality TEXT)");
  db.run("CREATE TABLE artworks (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, year TEXT, medium TEXT)");
  db.run("CREATE TABLE art_periods (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, start_year TEXT, end_year TEXT)");
  db.run("CREATE TABLE museums (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, location TEXT)");
  db.run("CREATE TABLE collectors (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, country TEXT)");
  db.run("CREATE TABLE art_styles (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)");
  
  // deleting art styles table and recreating it as a test
  utils.deleteTable(db, 'art_styles');
  db.run("CREATE TABLE art_styles (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)");

  // creating relationship tables
  db.run("CREATE TABLE created_by (artist_id INTEGER, artwork_id INTEGER, FOREIGN KEY(artist_id) REFERENCES artists(artist_id), FOREIGN KEY(artwork_id) REFERENCES artworks(id), PRIMARY KEY(artist_id, artwork_id))");
  db.run("CREATE TABLE belongs_to (artwork_id INTEGER, museum_id INTEGER, FOREIGN KEY(artwork_id) REFERENCES artworks(id), FOREIGN KEY(museum_id) REFERENCES museums(id), PRIMARY KEY(artwork_id))");
  db.run("CREATE TABLE included_in (artwork_id INTEGER, art_period_id INTEGER, FOREIGN KEY(artwork_id) REFERENCES artworks(id), FOREIGN KEY(art_period_id) REFERENCES art_periods(id), PRIMARY KEY(artwork_id))");
  db.run("CREATE TABLE lived_in (artist_id INTEGER, art_period_id INTEGER, FOREIGN KEY(artist_id) REFERENCES artists(artist_id), FOREIGN KEY(art_period_id) REFERENCES art_periods(id), PRIMARY KEY(artist_id, art_period_id))");
  db.run("CREATE TABLE owned_by (artwork_id INTEGER, collector_id INTEGER, FOREIGN KEY(artwork_id) REFERENCES artworks(id), FOREIGN KEY(collector_id) REFERENCES collectors(id))");
  db.run("CREATE TABLE falls_under (artwork_id INTEGER, art_style_id INTEGER, FOREIGN KEY(artwork_id) REFERENCES artworks(id), FOREIGN KEY(art_style_id) REFERENCES art_styles(id))");

  //inserting user data
  utils.insertIntoTable(db, 'users', ['username', 'password', 'name'], ['johndoe', 'password123', 'John Doe']);
  utils.insertIntoTable(db, 'users', ['username', 'password', 'name'], ['janedoe', 'password456', 'Jane Doe']);
  //inserting artist data
  utils.insertIntoTable(db, 'artists', ['name', 'birthdate', 'nationality'], ["Leanardo do Vanci", "1452-04-15", "Italian"], "id");
  utils.insertIntoTable(db, 'artists', ['name', 'birthdate', 'nationality'], ["Pablo Picasso", "1881-10-25", "Spanish"], "id");
  utils.insertIntoTable(db, 'artists', ['name', 'birthdate', 'nationality'], ["Georges Seurat", "1859-12-02", "French"], "id");
  //inserting artwork data
  utils.insertIntoTable(db, 'artworks', ['title', 'year', 'medium'], ["Mona Lisa", "1503", "Oil on Panel"], "id");
  utils.insertIntoTable(db, 'artworks', ['title', 'year', 'medium'], ["A Sunday Afternoon on the Island of La Grande Jatte", "1884", "Oil on canvas"], "id");
  utils.insertIntoTable(db, 'artworks', ['title', 'year', 'medium'], ["Girl with a Mandolin", "1910", "Oil on canvas"], "id");
  //inserting art period data
  utils.insertIntoTable(db, 'art_periods', ['name', 'start_year', 'end_year'], ["Renaissance", "1350", "1600"], "id");
  utils.insertIntoTable(db, 'art_periods', ['name', 'start_year', 'end_year'], ["Post-Impressionism", "1885", "1910"]);
  utils.insertIntoTable(db, 'art_periods', ['name', 'start_year', 'end_year'], ["Cubism", "1907", "1914"]);
  //inserting museum data
  utils.insertIntoTable(db, 'museums', ['name', 'location'], ["The Louvre", "Paris, France"], "id");
  utils.insertIntoTable(db, 'museums', ['name', 'location'], ["The Art Institute of Chicago", "Chicago, USA"], "id");
  utils.insertIntoTable(db, 'museums', ['name', 'location'], ["museums of Modern Art", "New York, USA"], "id");
  //correcting mistake by updating museum name
  utils.updateTable(db, 'museums', ['name'], ['Museum of Modern Art'], 3);
  //inserting collector data
  utils.insertIntoTable(db, 'collectors', ['name', 'country'], ["John Doe", "USA"], "id");
  utils.insertIntoTable(db, 'collectors', ['name', 'country'], ["Jane Doe", "USA"], "id");
  //inserting art style data
  utils.insertIntoTable(db, 'art_styles', ['name'], ['Renaissance']);
  utils.insertIntoTable(db, 'art_styles', ['name'], ['Cubism']);
  utils.insertIntoTable(db, 'art_styles', ['name'], ['Pointillism']);
  //updating artist data
  utils.updateTable(db, 'artists', ['name'], ['Leonardo da Vinci'], 1);
  utils.updateTable(db, 'artists', ['birthdate'], ['2023-04-01'], 2);
  //inserting created by data
  utils.insertIntoTable(db, 'created_by', ['artist_id', 'artwork_id'], [2, 2], "artist_id");
  utils.insertIntoTable(db, 'created_by', ['artist_id', 'artwork_id'], [3, 3], "artist_id");
  //inserting belongs to data
  utils.insertIntoTable(db, 'belongs_to', ['artwork_id', 'museum_id'], [1, 1], "artwork_id");
  utils.insertIntoTable(db, 'belongs_to', ['artwork_id', 'museum_id'], [2, 2], "artwork_id");
  utils.insertIntoTable(db, 'belongs_to', ['artwork_id', 'museum_id'], [3, 3], "artwork_id");
  //inserting included in data
  utils.insertIntoTable(db, 'included_in', ['artwork_id', 'art_period_id'], [1, 1], "artwork_id");
  utils.insertIntoTable(db, 'included_in', ['artwork_id', 'art_period_id'], [2, 2], "artwork_id");
  utils.insertIntoTable(db, 'included_in', ['artwork_id', 'art_period_id'], [3, 3], "artwork_id");
  //inserting lived in data
  utils.insertIntoTable(db, 'lived_in', ['artist_id', 'art_period_id'], [1, 1], "artist_id");
  utils.insertIntoTable(db, 'lived_in', ['artist_id', 'art_period_id'], [2, 2], "artist_id");
  utils.insertIntoTable(db, 'lived_in', ['artist_id', 'art_period_id'], [3, 3], "artist_id");
  //inserting owned by data
  utils.insertIntoTable(db, 'owned_by', ['artwork_id', 'collector_id'], [1, 1], "artwork_id");
  utils.insertIntoTable(db, 'owned_by', ['artwork_id', 'collector_id'], [2, 2], "artwork_id");
  utils.insertIntoTable(db, 'owned_by', ['artwork_id', 'collector_id'], [3, 1], "artwork_id");
  //inserting falls under data
  utils.insertIntoTable(db, 'falls_under', ['artwork_id', 'art_style_id'], [1, 1], "artwork_id");
  utils.insertIntoTable(db, 'falls_under', ['artwork_id', 'art_style_id'], [2, 2], "artwork_id");
  utils.insertIntoTable(db, 'falls_under', ['artwork_id', 'art_style_id'], [3, 3], "artwork_id");
  //finding artist with Spanish nationality and deleting the row
  utils.getIdFromAttribute(db, 'artists','nationality', 'Spanish', function(id) {
    utils.deleteFromTable(db, 'artists', id);
  });
  //finding artist with name Leonardo da Vinci and deleting the row
  utils.getIdFromAttribute(db, 'artists','name', 'Leonardo da Vinci', function(id) {
    utils.deleteFromTable(db, 'artists', id);
  });
  //finding all art periods that started between 1880 and 2000
  utils.selectByRange(db, 'art_periods', 'start_year', 1880, 2000);
  //counting the number of artists
  utils.countRows(db, 'artists');
  //updating multiple fields
  utils.updateMultipleFields(db, 'artists', {name: 'John Doe', birthdate: '2000-01-01'}, 'id = 1');
  //update column by id
  utils.updateColumnById(db, 'artists', 'name', 'Jane Doe', 2);
  //sorting artists by name
  utils.sortByParameter(db, 'artists', 'name');
  //searching for artists with name containing 'do'
  utils.searchByKeyword(db, 'artists', 'name', 'do');
  //selecting the first 2 artists
  utils.selectWithLimit(db, 'artists', 2);
  //selecting the next 2 artists
  utils.fetchDataWithOffset(db, 'artists', 1, 2);
  //delete all artists with id >= 3
  utils.deleteByCondition(db, 'artists', 'id >= 3');
  //joining artists and artworks
  utils.joinTwoTables(db, 'artists', 'artworks', 'id');
  //how many artworks are with collector 1
  utils.countRowsWithValue(db, 'owned_by', 'collector_id', 1);
  //get max value of year in artworks
  utils.getMaxValue(db, 'artworks', 'year');
  //get min value of year in artworks
  utils.getMinValue(db, 'artworks', 'year');
  //get avg value of year in artworks
  utils.getAvgValue(db, 'artworks', 'year');
  //delete artists where id = 1
  utils.deleteByCondition(db, 'artists', 'id = 1');
});