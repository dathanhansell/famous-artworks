const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./data.sqlite");

module.exports = db;

db.serialize(() => {
  console.log("Starting database serialization...");
  /*
  // creating data tables
  db.run(
    "CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT, name TEXT)"
  );
  db.run(
    "CREATE TABLE artists (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, birthdate TEXT, nationality TEXT)"
  );
  db.run(
    "CREATE TABLE artworks (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, year TEXT, medium TEXT)"
  );
  db.run(
    "CREATE TABLE art_periods (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, start_year TEXT, end_year TEXT)"
  );
  db.run(
    "CREATE TABLE museums (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, location TEXT)"
  );
  db.run(
    "CREATE TABLE collectors (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, country TEXT)"
  );
  db.run(
    "CREATE TABLE art_styles (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)"
  );

  // creating relationship tables
  db.run(
    "CREATE TABLE created_by (artist_id INTEGER, artwork_id INTEGER, FOREIGN KEY(artist_id) REFERENCES artists(artist_id), FOREIGN KEY(artwork_id) REFERENCES artworks(id), PRIMARY KEY(artist_id, artwork_id))"
  );
  db.run(
    "CREATE TABLE belongs_to (artwork_id INTEGER, museum_id INTEGER, FOREIGN KEY(artwork_id) REFERENCES artworks(id), FOREIGN KEY(museum_id) REFERENCES museums(id), PRIMARY KEY(artwork_id))"
  );
  db.run(
    "CREATE TABLE included_in (artwork_id INTEGER, art_period_id INTEGER, FOREIGN KEY(artwork_id) REFERENCES artworks(id), FOREIGN KEY(art_period_id) REFERENCES art_periods(id), PRIMARY KEY(artwork_id))"
  );
  db.run(
    "CREATE TABLE lived_in (artist_id INTEGER, art_period_id INTEGER, FOREIGN KEY(artist_id) REFERENCES artists(artist_id), FOREIGN KEY(art_period_id) REFERENCES art_periods(id), PRIMARY KEY(artist_id, art_period_id))"
  );
  db.run(
    "CREATE TABLE owned_by (artwork_id INTEGER, collector_id INTEGER, FOREIGN KEY(artwork_id) REFERENCES artworks(id), FOREIGN KEY(collector_id) REFERENCES collectors(id))"
  );
  db.run(
    "CREATE TABLE falls_under (artwork_id INTEGER, art_style_id INTEGER, FOREIGN KEY(artwork_id) REFERENCES artworks(id), FOREIGN KEY(art_style_id) REFERENCES art_styles(id))"
  );*/
});
