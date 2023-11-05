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




const selectLatest = (tableName, idName) => {
  db.get(`SELECT * FROM ${tableName} ORDER BY ${idName} DESC LIMIT 1`, (err, row) => {
    if (err) {
      console.log("Error fetching last inserted row: ", err);
    } else {
      console.log("Last inserted row: ", row);
    }
  });
};

function insertIntoTable(db, table, columns, values, idName="id") {
    let placeholders = columns.map(() => '?').join(',');
    let stmt = db.prepare(`INSERT INTO ${table} (${columns.join(',')}) VALUES (${placeholders})`);

    // Insert data into the table and fetch the latest inserted row
    stmt.run(values, function(err) {
        if (err) {
          console.log(`Error inserting into ${table} table: `, err);
        } else {
          console.log(`Inserted ${this.changes} row(s) into ${table} table`);
        }
      });
    //if its a link table, fetch the two rows that were linked
    if (values.length === 2 && typeof values[0] === 'number' && typeof values[1] === 'number') {
        let table1 = columns[0].replace(/_id$/, 's');
        let table2 = columns[1].replace(/_id$/, 's');
        selectById(db, table1, values[0]);
        selectById(db, table1, values[1]);
    }
    else{
        selectLatest(table, idName);
    }

    // Commit statement
    stmt.finalize();
}

function selectById(db, table, id) {
    db.get(`SELECT * FROM ${table} WHERE id = ?`, [id], (err, row) => {
        if (err) {
            console.log(`Error fetching ${table} with id ${id}: `, err);
        } else {
            console.log(table,": ", row);
        }
    });
}
const updateTable = (db, table, columns, values, id) => {
    let placeholders = columns.map((col) => `${col} = ?`).join(',');
    let stmt = db.prepare(`UPDATE ${table} SET ${placeholders} WHERE id = ?`);
    stmt.run([...values, id]);
    stmt.finalize();
};

const deleteFromTable = (db, table, id) => {
    let stmt = db.prepare(`DELETE FROM ${table} WHERE id = ?`);
    stmt.run(id, (err) => {
        if (err) {
            console.log(`Error deleting ${id} from ${table}: `, err);
        } else {
            console.log(`Successfully deleted ${id} from ${table}`);
        }
    });
    stmt.finalize();
};


function deleteTable(db, tableName) {
    db.run(`DROP TABLE IF EXISTS ${tableName}`, (err) => {
        if (err) {
            console.log(`Error deleting ${tableName} table: `, err);
        } else {
            console.log(`Successfully deleted ${tableName} table`);
        }
    });
}
function getIdFromAttribute(db, table,attributeName, attribute, callback) {
    db.get(`SELECT id FROM ${table} WHERE ${attributeName} = ?`, [attribute], (err, row) => {
        if (err) {
            console.log(`Error fetching ${table} with name ${name}: `, err);
            return;
        } 
        if (!row) {
            console.log(`No matching record found in ${table} with name ${name}`);
            return;
        }
        callback(row.id);
    });
}

db.serialize(() => {
  console.log("Starting database serialization...");

  db.run("CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT, name TEXT)");
  db.run("CREATE TABLE artists (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, birthdate TEXT, nationality TEXT)");
  db.run("CREATE TABLE artworks (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, year TEXT, medium TEXT)");
  db.run("CREATE TABLE art_periods (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, start_year TEXT, end_year TEXT)");
  db.run("CREATE TABLE museums (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, location TEXT)");
  db.run("CREATE TABLE collectors (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, country TEXT)");
  db.run("CREATE TABLE art_styles (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)");
  deleteTable(db, 'art_styles');
  db.run("CREATE TABLE art_styles (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)");

  db.run("CREATE TABLE created_by (artist_id INTEGER, artwork_id INTEGER, FOREIGN KEY(artist_id) REFERENCES artists(artist_id), FOREIGN KEY(artwork_id) REFERENCES artworks(id), PRIMARY KEY(artist_id, artwork_id))");
  db.run("CREATE TABLE belongs_to (artwork_id INTEGER, museum_id INTEGER, FOREIGN KEY(artwork_id) REFERENCES artworks(id), FOREIGN KEY(museum_id) REFERENCES museums(id), PRIMARY KEY(artwork_id))");
  db.run("CREATE TABLE included_in (artwork_id INTEGER, art_period_id INTEGER, FOREIGN KEY(artwork_id) REFERENCES artworks(id), FOREIGN KEY(art_period_id) REFERENCES art_periods(id), PRIMARY KEY(artwork_id))");
  db.run("CREATE TABLE lived_in (artist_id INTEGER, art_period_id INTEGER, FOREIGN KEY(artist_id) REFERENCES artists(artist_id), FOREIGN KEY(art_period_id) REFERENCES art_periods(id), PRIMARY KEY(artist_id, art_period_id))");
  db.run("CREATE TABLE owned_by (artwork_id INTEGER, collector_id INTEGER, FOREIGN KEY(artwork_id) REFERENCES artworks(id), FOREIGN KEY(collector_id) REFERENCES collectors(id))");
  db.run("CREATE TABLE falls_under (artwork_id INTEGER, art_style_id INTEGER, FOREIGN KEY(artwork_id) REFERENCES artworks(id), FOREIGN KEY(art_style_id) REFERENCES art_styles(id))");
  insertIntoTable(db, 'users', ['username', 'password', 'name'], ['johndoe', 'password123', 'John Doe']);
  insertIntoTable(db, 'artists', ['name', 'birthdate', 'nationality'], ["Leanardo do Vanci", "April 15, 1452", "Italian"], "id");
  insertIntoTable(db, 'artists', ['name', 'birthdate', 'nationality'], ["Pablo Picasso", "October 25, 1881", "Spanish"], "id");
  insertIntoTable(db, 'artists', ['name', 'birthdate', 'nationality'], ["Georges Seurat", "December 2, 1859", "French"], "id");
  insertIntoTable(db, 'artworks', ['title', 'year', 'medium'], ["Mona Lisa", "1503-06", "Oil on Panel"], "id");
  insertIntoTable(db, 'artworks', ['title', 'year', 'medium'], ["A Sunday Afternoon on the Island of La Grande Jatte", "1884-1886", "Oil on canvas"], "id");
  insertIntoTable(db, 'artworks', ['title', 'year', 'medium'], ["Girl with a Mandolin", "1910", "Oil on canvas"], "id");
  insertIntoTable(db, 'art_periods', ['name', 'start_year', 'end_year'], ["Renaissance", "1350", "1600"], "id");
  insertIntoTable(db, 'art_periods', ['name', 'start_year', 'end_year'], ["Post-Impressionism", "1885", "1910"]);
  insertIntoTable(db, 'art_periods', ['name', 'start_year', 'end_year'], ["Cubism", "1907", "1914"]);
  insertIntoTable(db, 'museums', ['name', 'location'], ["The Louvre", "Paris, France"], "id");
  insertIntoTable(db, 'museums', ['name', 'location'], ["The Art Institute of Chicago", "Chicago, USA"], "id");
  insertIntoTable(db, 'museums', ['name', 'location'], ["museums of Modern Art", "New York, USA"], "id");
  updateTable(db, 'museums', ['name'], ['Museum of Modern Art'], 3);
  insertIntoTable(db, 'collectors', ['name', 'country'], ["John Doe", "USA"], "id");
  insertIntoTable(db, 'collectors', ['name', 'country'], ["Jane Doe", "USA"], "id");
  insertIntoTable(db, 'art_styles', ['name'], ['Renaissance']);
  insertIntoTable(db, 'art_styles', ['name'], ['Cubism']);
  insertIntoTable(db, 'art_styles', ['name'], ['Pointillism']);
  updateTable(db, 'artists', ['name'], ['Leonardo da Vinci'], 1);
  updateTable(db, 'artists', ['birthdate'], ['April 1st 2023'], 2);
  insertIntoTable(db, 'created_by', ['artist_id', 'artwork_id'], [1, 1], "artist_id");
  insertIntoTable(db, 'created_by', ['artist_id', 'artwork_id'], [2, 2], "artist_id");
  insertIntoTable(db, 'created_by', ['artist_id', 'artwork_id'], [3, 3], "artist_id");
  insertIntoTable(db, 'belongs_to', ['artwork_id', 'museum_id'], [1, 1], "artwork_id");
  insertIntoTable(db, 'belongs_to', ['artwork_id', 'museum_id'], [2, 2], "artwork_id");
  insertIntoTable(db, 'included_in', ['artwork_id', 'art_period_id'], [1, 1], "artwork_id");
  insertIntoTable(db, 'included_in', ['artwork_id', 'art_period_id'], [2, 2], "artwork_id");
  insertIntoTable(db, 'included_in', ['artwork_id', 'art_period_id'], [3, 3], "artwork_id");
  insertIntoTable(db, 'lived_in', ['artist_id', 'art_period_id'], [1, 1], "artist_id");
  insertIntoTable(db, 'lived_in', ['artist_id', 'art_period_id'], [2, 2], "artist_id");
  insertIntoTable(db, 'lived_in', ['artist_id', 'art_period_id'], [3, 3], "artist_id");
  insertIntoTable(db, 'owned_by', ['artwork_id', 'collector_id'], [1, 1], "artwork_id");
  insertIntoTable(db, 'owned_by', ['artwork_id', 'collector_id'], [2, 2], "artwork_id");
  insertIntoTable(db, 'owned_by', ['artwork_id', 'collector_id'], [3, 1], "artwork_id");
  insertIntoTable(db, 'falls_under', ['artwork_id', 'art_style_id'], [1, 1], "artwork_id");
  insertIntoTable(db, 'falls_under', ['artwork_id', 'art_style_id'], [2, 2], "artwork_id");
  insertIntoTable(db, 'falls_under', ['artwork_id', 'art_style_id'], [3, 3], "artwork_id");
  getIdFromAttribute(db, 'artists','nationality', 'Spanish', function(id) {
    deleteFromTable(db, 'artists', id);
  });
  insertIntoTable(db, 'belongs_to', ['artwork_id', 'museum_id'], [3, 3], "artwork_id");
  getIdFromAttribute(db, 'artists','name', 'Leonardo da Vinci', function(id) {
    deleteFromTable(db, 'artists', id);
  });
});