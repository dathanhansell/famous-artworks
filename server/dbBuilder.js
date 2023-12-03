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


const insertIntoTable = (db, table, columns, values, idName = "id") => {
  const placeholders = columns.map(() => '?').join(',');
  const stmt = db.prepare(`INSERT INTO ${table} (${columns.join(',')}) VALUES (${placeholders})`);

  stmt.run(values, function (err) {
    //console.log("insertIntoTable()");
    if (err) {
      throw err;
    }
    
  });
  stmt.finalize();
};
const csv = require('csv-parser');

const loadArtistsFromCSV = (db, filePath) => {
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      const name = row['Name'];
      const birthYear = row['Birth Year'];
      const nationality = row['Nationality']=="Nationality unknown"?"":row['Nationality'];
      const birthdate = birthYear == ""?"":birthYear + '-01-01'; // Assuming January 1 as birthdate
      insertIntoTable(db, 'artists', ['name', 'birthdate', 'nationality'], [name, birthdate, nationality], "id");
      //console.log(`Inserted ${row['Artist ID']} row(s) into artists table`);
      // insert into 'lived_in' table after artist is added
      db.get('SELECT last_insert_rowid() as id', (err, row) => {
        if (err) {
          console.error(err.message);
        }
        const artistId = row.id;
        const artPeriodId = Math.floor(Math.random() * 3) + 1; // random number between 1 and 3
        insertIntoTable(db, 'lived_in', ['artist_id', 'art_period_id'], [artistId, artPeriodId], "artist_id");
      });
    })
    .on('end', () => {
      console.log('CSV file successfully processed');
    });
};

const loadArtworksFromCSV = (db, filePath) => {
  var ba=1;
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      const title = row['Title'];
      const year = row['Date'];
      const medium = row['Medium'];
      const artistId = row['Artist ID'];
      insertIntoTable(db, 'artworks', ['title', 'year', 'medium'], [title, parseInt(year), medium], "id");
      //console.log(`Inserted ${ba++} row(s) into artworks table`);
      // insert into relationship tables after artwork is added
      db.get('SELECT last_insert_rowid() as id', (err, row) => {
        if (err) {
          console.error(err.message);
        }
        const artworkId = row.id;
        const museumId = Math.floor(Math.random() * 44) + 1; // random number between 1 and 10
        const artPeriodId = Math.floor(Math.random() * 17) + 1; // random number between 1 and 5
       // const collectorId = Math.floor(Math.random() * 50) + 1; // random number between 1 and 50
        const artStyleId = Math.floor(Math.random() * 17) + 1; // random number between 1 and 8

        insertIntoTable(db, 'created_by', ['artist_id', 'artwork_id'], [parseInt(artistId)+3, artworkId], "artist_id");
        insertIntoTable(db, 'belongs_to', ['artwork_id', 'museum_id'], [artworkId, museumId], "artwork_id");
        insertIntoTable(db, 'included_in', ['artwork_id', 'art_period_id'], [artworkId, artPeriodId], "artwork_id");
       // insertIntoTable(db, 'owned_by', ['artwork_id', 'collector_id'], [artworkId, collectorId], "artwork_id");
        insertIntoTable(db, 'falls_under', ['artwork_id', 'art_style_id'], [artworkId, artStyleId], "artwork_id");
      });
    })
    .on('end', () => {
      console.log('CSV file successfully processed');
    });
};


db.serialize(() => {

  // creating data tables
  db.run("CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT, name TEXT)");
  db.run("CREATE TABLE artists (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, birthdate TEXT, nationality TEXT)");
  db.run("CREATE TABLE artworks (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, year TEXT, medium TEXT)");
  db.run("CREATE TABLE art_periods (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, start_year TEXT, end_year TEXT)");
  db.run("CREATE TABLE museums (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, location TEXT)");
  db.run("CREATE TABLE collectors (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, country TEXT)");
  db.run("CREATE TABLE art_styles (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)");

  // creating relationship tables
  db.run("CREATE TABLE created_by (artist_id INTEGER, artwork_id INTEGER, FOREIGN KEY(artist_id) REFERENCES artists(id) ON DELETE CASCADE, FOREIGN KEY(artwork_id) REFERENCES artworks(id) ON DELETE CASCADE, PRIMARY KEY(artist_id, artwork_id))");
  db.run("CREATE TABLE belongs_to (artwork_id INTEGER, museum_id INTEGER, FOREIGN KEY(artwork_id) REFERENCES artworks(id) ON DELETE CASCADE, FOREIGN KEY(museum_id) REFERENCES museums(id) ON DELETE CASCADE, PRIMARY KEY(artwork_id, museum_id))");
  db.run("CREATE TABLE included_in (artwork_id INTEGER, art_period_id INTEGER, FOREIGN KEY(artwork_id) REFERENCES artworks(id) ON DELETE CASCADE, FOREIGN KEY(art_period_id) REFERENCES art_periods(id) ON DELETE CASCADE, PRIMARY KEY(artwork_id, art_period_id))");
  db.run("CREATE TABLE lived_in (artist_id INTEGER, art_period_id INTEGER, FOREIGN KEY(artist_id) REFERENCES artists(id) ON DELETE CASCADE, FOREIGN KEY(art_period_id) REFERENCES art_periods(id) ON DELETE CASCADE, PRIMARY KEY(artist_id, art_period_id))");
  db.run("CREATE TABLE owned_by (artwork_id INTEGER, collector_id INTEGER, FOREIGN KEY(artwork_id) REFERENCES artworks(id) ON DELETE CASCADE, FOREIGN KEY(collector_id) REFERENCES collectors(id) ON DELETE CASCADE)");
  db.run("CREATE TABLE falls_under (artwork_id INTEGER, art_style_id INTEGER, FOREIGN KEY(artwork_id) REFERENCES artworks(id) ON DELETE CASCADE, FOREIGN KEY(art_style_id) REFERENCES art_styles(id) ON DELETE CASCADE)");

  //inserting user data
  insertIntoTable(db, 'users', ['username', 'password', 'name'], ['johndoe', 'password123', 'John Doe']);
  insertIntoTable(db, 'users', ['username', 'password', 'name'], ['janedoe', 'password456', 'Jane Doe']);

  insertIntoTable(db, 'artists', ['name', 'birthdate', 'nationality'], ["Leonardo da Vinci", "1452-04-15", "Italian"], "id");
  insertIntoTable(db, 'lived_in', ['artist_id', 'art_period_id'], [1, 1], "artist_id");
  insertIntoTable(db, 'artists', ['name', 'birthdate', 'nationality'], ["Pablo Picasso", "1881-10-25", "Spanish"], "id");
  insertIntoTable(db, 'lived_in', ['artist_id', 'art_period_id'], [2, 1], "artist_id");
  insertIntoTable(db, 'lived_in', ['artist_id', 'art_period_id'], [2, 4], "artist_id");
  insertIntoTable(db, 'artists', ['name', 'birthdate', 'nationality'], ["Georges Seurat", "1859-12-02", "French"], "id");
  insertIntoTable(db, 'lived_in', ['artist_id', 'art_period_id'], [3, 3], "artist_id");



  insertIntoTable(db, 'artworks', ['title', 'year', 'medium'], ["Mona Lisa", "1503", "Oil on Panel"], "id");
  insertIntoTable(db, 'created_by', ['artist_id', 'artwork_id'], [1, 1], "artist_id");
  insertIntoTable(db, 'belongs_to', ['artwork_id', 'museum_id'], [1, 1], "artwork_id");
  insertIntoTable(db, 'included_in', ['artwork_id', 'art_period_id'], [1, 1], "artwork_id");
  insertIntoTable(db, 'owned_by', ['artwork_id', 'collector_id'], [1, 1], "artwork_id");
  insertIntoTable(db, 'falls_under', ['artwork_id', 'art_style_id'], [1, 1], "artwork_id");
  insertIntoTable(db, 'artworks', ['title', 'year', 'medium'], ["Girl with a Mandolin", "1910", "Oil on canvas"], "id");
  insertIntoTable(db, 'created_by', ['artist_id', 'artwork_id'], [2, 2], "artist_id");
  insertIntoTable(db, 'belongs_to', ['artwork_id', 'museum_id'], [2, 2], "artwork_id");
  insertIntoTable(db, 'included_in', ['artwork_id', 'art_period_id'], [2, 2], "artwork_id");
  insertIntoTable(db, 'owned_by', ['artwork_id', 'collector_id'], [2, 2], "artwork_id");
  insertIntoTable(db, 'falls_under', ['artwork_id', 'art_style_id'], [2, 2], "artwork_id");
  insertIntoTable(db, 'artworks', ['title', 'year', 'medium'], ["A Sunday Afternoon on the Island of La Grande Jatte", "1884", "Oil on canvas"], "id");
  insertIntoTable(db, 'created_by', ['artist_id', 'artwork_id'], [3, 3], "artist_id");
  insertIntoTable(db, 'belongs_to', ['artwork_id', 'museum_id'], [3, 3], "artwork_id");
  insertIntoTable(db, 'included_in', ['artwork_id', 'art_period_id'], [3, 3], "artwork_id");
  insertIntoTable(db, 'owned_by', ['artwork_id', 'collector_id'], [3, 1], "artwork_id");
  insertIntoTable(db, 'falls_under', ['artwork_id', 'art_style_id'], [3, 3], "artwork_id");
  insertIntoTable(db, 'artworks', ['title', 'year', 'medium'], ["The Old Guitarist", "1904", "Oil on canvas"], "id");
  insertIntoTable(db, 'created_by', ['artist_id', 'artwork_id'], [2, 4], "artist_id");
  insertIntoTable(db, 'belongs_to', ['artwork_id', 'museum_id'], [4, 1], "artwork_id");
  insertIntoTable(db, 'included_in', ['artwork_id', 'art_period_id'], [4, 4], "artwork_id");
  insertIntoTable(db, 'owned_by', ['artwork_id', 'collector_id'], [4, 2], "artwork_id");
  insertIntoTable(db, 'falls_under', ['artwork_id', 'art_style_id'], [4, 4], "artwork_id");
  insertIntoTable(db, 'artworks', ['title', 'year', 'medium'], ["Vitruvian Man", "1490", "Ink"], "id");
  insertIntoTable(db, 'created_by', ['artist_id', 'artwork_id'], [1, 5], "artist_id");
  insertIntoTable(db, 'belongs_to', ['artwork_id', 'museum_id'], [5, 1], "artwork_id");
  insertIntoTable(db, 'included_in', ['artwork_id', 'art_period_id'], [5, 1], "artwork_id");
  insertIntoTable(db, 'owned_by', ['artwork_id', 'collector_id'], [5, 2], "artwork_id");
  insertIntoTable(db, 'falls_under', ['artwork_id', 'art_style_id'], [5, 1], "artwork_id");
loadArtistsFromCSV(db, './artists.csv');
loadArtworksFromCSV(db, './artworks.csv');
  insertIntoTable(db, 'art_periods', ['name', 'start_year', 'end_year'], ["Renaissance", "1350", "1600"], "id");
  insertIntoTable(db, 'art_periods', ['name', 'start_year', 'end_year'], ["Post-Impressionism", "1885", "1910"]);
  insertIntoTable(db, 'art_periods', ['name', 'start_year', 'end_year'], ["Cubism", "1907", "1914"]);
  insertIntoTable(db, 'art_periods', ['name', 'start_year', 'end_year'], ["Expressionism", "1912", "1920"]);
  insertIntoTable(db, 'art_periods', ['name', 'start_year', 'end_year'], ["Baroque", "1600", "1750"]);
  insertIntoTable(db, 'art_periods', ['name', 'start_year', 'end_year'], ["Rococo", "1720", "1780"]);
  insertIntoTable(db, 'art_periods', ['name', 'start_year', 'end_year'], ["Neoclassicism", "1750", "1850"]);
  insertIntoTable(db, 'art_periods', ['name', 'start_year', 'end_year'], ["Romanticism", "1800", "1850"]);
  insertIntoTable(db, 'art_periods', ['name', 'start_year', 'end_year'], ["Realism", "1848", "1900"]);
  insertIntoTable(db, 'art_periods', ['name', 'start_year', 'end_year'], ["Impressionism", "1865", "1885"]);
  insertIntoTable(db, 'art_periods', ['name', 'start_year', 'end_year'], ["Fauvism", "1904", "1910"]);
  insertIntoTable(db, 'art_periods', ['name', 'start_year', 'end_year'], ["Futurism", "1909", "1944"]);
  insertIntoTable(db, 'art_periods', ['name', 'start_year', 'end_year'], ["Dada", "1916", "1922"]);
  insertIntoTable(db, 'art_periods', ['name', 'start_year', 'end_year'], ["Surrealism", "1924", "1966"]);
  insertIntoTable(db, 'art_periods', ['name', 'start_year', 'end_year'], ["Abstract Expressionism", "1940", "1955"]);
  insertIntoTable(db, 'art_periods', ['name', 'start_year', 'end_year'], ["Pop Art", "1950", "1970"]);
  insertIntoTable(db, 'art_periods', ['name', 'start_year', 'end_year'], ["Minimalism", "1960", "1975"]);
  insertIntoTable(db, 'art_periods', ['name', 'start_year', 'end_year'], ["Postmodernism", "1970", "Present"]);

  insertIntoTable(db, 'museums', ['name', 'location'], ["The Louvre", "Paris, France"], "id");
  insertIntoTable(db, 'museums', ['name', 'location'], ["Museum of Modern Art", "New York, USA"], "id");
  insertIntoTable(db, 'museums', ['name', 'location'], ["The Art Institute of Chicago", "Chicago, USA"], "id");
  insertIntoTable(db, 'museums', ['name', 'location'], ["Philadelphia Museum of Art","Philadelphia, USA"], "id");
  insertIntoTable(db, 'museums', ['name', 'location'], ["Musée Rodin","Paris, France"], "id");
  insertIntoTable(db, 'museums', ['name', 'location'], ["Museo Nacional Centro de Arte Reina Sofía","Madrid, Spain"], "id");
  insertIntoTable(db, 'museums', ['name', 'location'], ["Cleveland Museum of Art","Cleveland, USA"], "id");
  insertIntoTable(db, 'museums', ['name', 'location'], ["Detroit Institute of Arts","Detroit, USA"], "id");
  insertIntoTable(db, 'museums', ['name', 'location'], ["Musée d'Art Moderne de la Ville de Paris","Paris, France"], "id");
  insertIntoTable(db, 'museums', ['name', 'location'], ["The Nelson-Atkins Museum of Art","Kansas City, USA"], "id");
  insertIntoTable(db, 'museums', ['name', 'location'], ["Art Gallery of New South Wales","Sydney, Australia"], "id");
  insertIntoTable(db, 'museums', ['name', 'location'], ["National Gallery of Victoria","Melbourne, Australia"], "id");
  insertIntoTable(db, 'museums', ['name', 'location'], ["J. Paul Getty Museum","Los Angeles, USA"], "id");
  insertIntoTable(db, 'museums', ['name', 'location'], ["San Francisco Museum of Modern Art","San Francisco, USA"], "id");
  insertIntoTable(db, 'museums', ['name', 'location'], ["Museum of Fine Arts","Boston, USA"], "id");
  insertIntoTable(db, 'museums', ['name', 'location'], ["Whitney Museum of American Art","New York, USA"], "id");
  insertIntoTable(db, 'museums', ['name', 'location'], ["Solomon R. Guggenheim Museum","New York, USA"], "id");
  insertIntoTable(db, 'museums', ['name', 'location'], ["The National Art Center","Tokyo, Japan"], "id");
  insertIntoTable(db, 'museums', ['name', 'location'], ["National Museum of Modern and Contemporary Art","Seoul, South Korea"], "id");
  insertIntoTable(db, 'museums', ['name', 'location'], ["Museum of Contemporary Art, Los Angeles","Los Angeles, USA"], "id");
  insertIntoTable(db, 'museums', ['name', 'location'], ["Denver Art Museum","Denver, USA"], "id");
  insertIntoTable(db, 'museums', ['name', 'location'], ["Hirshhorn Museum and Sculpture Garden","Washington D.C., USA"], "id");
  insertIntoTable(db, 'museums', ['name', 'location'], ["Indianapolis Museum of Art","Indianapolis, USA"], "id");
  insertIntoTable(db, 'museums', ['name', 'location'], ["Museum of Contemporary Art Chicago","Chicago, USA"], "id");
  insertIntoTable(db, 'museums', ['name', 'location'], ["Seattle Art Museum","Seattle, USA"], "id");
  insertIntoTable(db, 'museums', ['name', 'location'], ["The Walters Art Museum","Baltimore, USA"], "id");
  insertIntoTable(db, 'museums', ['name', 'location'], ["D'Orsay Museum","Paris, France"], "id");
  insertIntoTable(db, 'museums', ['name', 'location'], ["National Gallery of Art","Washington D.C., USA"], "id");
  insertIntoTable(db, 'museums', ['name', 'location'], ["Pergamon Museum","Berlin, Germany"], "id");
  insertIntoTable(db, 'museums', ['name', 'location'], ["Centre Pompidou","Paris, France"], "id");
  insertIntoTable(db, 'museums', ['name', 'location'], ["The State Tretyakov Gallery","Moscow, Russia"], "id");
  insertIntoTable(db, 'museums', ['name', 'location'], ["Tokyo National Museum","Tokyo, Japan"], "id");
  insertIntoTable(db, 'museums', ['name', 'location'], ["National Museum of Western Art","Tokyo, Japan"], "id");
  insertIntoTable(db, 'museums', ['name', 'location'], ["National Palace Museum","Taipei, Taiwan"], "id");
  insertIntoTable(db, 'museums', ['name', 'location'], ["State Hermitage Museum","St. Petersburg, Russia"], "id");
  insertIntoTable(db, 'museums', ['name', 'location'], ["Musée du quai Branly - Jacques Chirac","Paris, France"], "id");
  insertIntoTable(db, 'museums', ['name', 'location'], ["Museum of Contemporary Art Australia","Sydney, Australia"], "id");
  insertIntoTable(db, 'museums', ['name', 'location'], ["British Museum","London, UK"], "id");
  insertIntoTable(db, 'museums', ['name', 'location'], ["Metropolitan Museum of Art","New York, USA"], "id");
  insertIntoTable(db, 'museums', ['name', 'location'], ["Vatican Museums","Vatican City"], "id");
  insertIntoTable(db, 'museums', ['name', 'location'], ["Uffizi Gallery","Florence, Italy"], "id");
  insertIntoTable(db, 'museums', ['name', 'location'], ["Prado Museum","Madrid, Spain"], "id");
  insertIntoTable(db, 'museums', ['name', 'location'], ["Hermitage Museum","Saint Petersburg, Russia"], "id");
  insertIntoTable(db, 'museums', ['name', 'location'], ["National Gallery","London, UK"], "id");

  insertIntoTable(db, 'collectors', ['name', 'country'], ["John Doe", "USA"], "id");
  insertIntoTable(db, 'collectors', ['name', 'country'], ["Jane Doe", "USA"], "id");

  insertIntoTable(db, 'art_styles', ['name'], ['Renaissance']);
  insertIntoTable(db, 'art_styles', ['name'], ['Pointillism']);
  insertIntoTable(db, 'art_styles', ['name'], ['Cubism']);
  insertIntoTable(db, 'art_styles', ['name'], ['Expressionism']);
  insertIntoTable(db, 'art_styles', ['name'], ["Abstract"]);
  insertIntoTable(db, 'art_styles', ['name'], ["Art Nouveau"]);
  insertIntoTable(db, 'art_styles', ['name'], ["Baroque"]);
  insertIntoTable(db, 'art_styles', ['name'], ["Dada"]);
  insertIntoTable(db, 'art_styles', ['name'], ["Fauvism"]);
  insertIntoTable(db, 'art_styles', ['name'], ["Impressionism"]);
  insertIntoTable(db, 'art_styles', ['name'], ["Minimalism"]);
  insertIntoTable(db, 'art_styles', ['name'], ["Modernism"]);
  insertIntoTable(db, 'art_styles', ['name'], ["Neo-Classical"]);
  insertIntoTable(db, 'art_styles', ['name'], ["Pop Art"]);
  insertIntoTable(db, 'art_styles', ['name'], ["Post-Impressionism"]);
  insertIntoTable(db, 'art_styles', ['name'], ["Realism"]);
  insertIntoTable(db, 'art_styles', ['name'], ["Romanticism"]);
  insertIntoTable(db, 'art_styles', ['name'], ["Surrealism"]);
  insertIntoTable(db, 'art_styles', ['name'], ["Symbolism"]);
  insertIntoTable(db, 'art_styles', ['name'], ["Rococo"]);
  insertIntoTable(db, 'art_styles', ['name'], ["Gothic Art"]);
  insertIntoTable(db, 'art_styles', ['name'], ["Byzantine Art"]);
  insertIntoTable(db, 'art_styles', ['name'], ["Constructivism"]);
  insertIntoTable(db, 'art_styles', ['name'], ["Futurism"]);
  insertIntoTable(db, 'art_styles', ['name'], ["Abstract Expressionism"]);
  insertIntoTable(db, 'art_styles', ['name'], ["Conceptual Art"]);
  insertIntoTable(db, 'art_styles', ['name'], ["Photorealism"]);

  insertIntoTable(db, 'owned_by', ['artwork_id', 'collector_id'], [50, 2], "artwork_id");
  insertIntoTable(db, 'owned_by', ['artwork_id', 'collector_id'], [500, 2], "artwork_id");
  insertIntoTable(db, 'owned_by', ['artwork_id', 'collector_id'], [5000, 2], "artwork_id");
  insertIntoTable(db, 'owned_by', ['artwork_id', 'collector_id'], [10, 2], "artwork_id");
  insertIntoTable(db, 'owned_by', ['artwork_id', 'collector_id'], [100, 2], "artwork_id");
  insertIntoTable(db, 'owned_by', ['artwork_id', 'collector_id'], [1000, 2], "artwork_id");
  insertIntoTable(db, 'owned_by', ['artwork_id', 'collector_id'], [20, 2], "artwork_id");
  insertIntoTable(db, 'owned_by', ['artwork_id', 'collector_id'], [220, 2], "artwork_id");
  insertIntoTable(db, 'owned_by', ['artwork_id', 'collector_id'], [2220, 2], "artwork_id");
  insertIntoTable(db, 'owned_by', ['artwork_id', 'collector_id'], [5130, 1], "artwork_id");
  insertIntoTable(db, 'owned_by', ['artwork_id', 'collector_id'], [140, 1], "artwork_id");
  insertIntoTable(db, 'owned_by', ['artwork_id', 'collector_id'], [516, 1], "artwork_id");
  insertIntoTable(db, 'owned_by', ['artwork_id', 'collector_id'], [3124, 1], "artwork_id");
  insertIntoTable(db, 'owned_by', ['artwork_id', 'collector_id'], [6243, 1], "artwork_id");
  insertIntoTable(db, 'owned_by', ['artwork_id', 'collector_id'], [5, 1], "artwork_id");
  insertIntoTable(db, 'owned_by', ['artwork_id', 'collector_id'], [5440, 1], "artwork_id");
  insertIntoTable(db, 'owned_by', ['artwork_id', 'collector_id'], [2634, 1], "artwork_id");
  insertIntoTable(db, 'owned_by', ['artwork_id', 'collector_id'], [578, 1], "artwork_id");
});