const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const app = express();
const port = 3001;
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
let db = new sqlite3.Database(":memory:");
const cors = require("cors");

app.use(cors());
app.use(bodyParser.json());

// Initialize session
app.use(
  session({
    secret: "rob-boss-is-cool",
    resave: false,
    saveUninitialized: true,
  })
);
const insertData = (stmt, values, tableName) => {
  stmt.run(values, function(err) {
    if (err) {
      console.log(`Error inserting into ${tableName} table: `, err);
    } else {
      console.log(`Inserted ${this.changes} row(s) into ${tableName} table`);
    }
  });
};

const fetchLatest = (tableName, idName) => {
  db.get(`SELECT * FROM ${tableName} ORDER BY ${idName} DESC LIMIT 1`, (err, row) => {
    if (err) {
      console.log("Error fetching last inserted row: ", err);
    } else {
      console.log("Last inserted row: ", row);
    }
  });
};

db.serialize(() => {
  console.log("Starting database serialization...");
  // Create users table
  db.run(
    "CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT, name TEXT)"
  );

  // Create artists table
  db.run(
    "CREATE TABLE artists (artist_id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, birthdate TEXT, nationality TEXT)"
  );

  // Create artworks table
  db.run(
    "CREATE TABLE artworks (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, year TEXT, medium TEXT)"
  );

  // Create art period table
  db.run(
    "CREATE TABLE art_period (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, start_year TEXT, end_year TEXT)"
  );

  // Create museum table
  db.run(
    "CREATE TABLE museum (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, location TEXT)"
  );

  // Create collector table
  db.run(
    "CREATE TABLE collector (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, country TEXT)"
  );

  // Create art style table
  db.run(
    "CREATE TABLE art_style (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)"
  );

  // Create created_by table for many-to-many relationship between artists and artworks
  db.run(
    "CREATE TABLE created_by (artist_id INTEGER, artwork_id INTEGER, FOREIGN KEY(artist_id) REFERENCES artists(artist_id), FOREIGN KEY(artwork_id) REFERENCES artworks(id), PRIMARY KEY(artist_id, artwork_id))"
  );

  // Insert SQL statement for artists table
  let artistStmt = db.prepare(
    "INSERT INTO artists (name, birthdate, nationality) VALUES (?,?,?)"
  );

  // Insert data into artists table and fetch latest inserted row

  insertData(artistStmt, ["Leonardo da Vinci", "April 15, 1452", "Italian"], "artists");
  fetchLatest("artists", "artist_id")

  // Commit artists statement
  artistStmt.finalize();


  // Insert SQL statement for artworks table
  let artworkStmt = db.prepare(
    "INSERT INTO artworks (title, year, medium) VALUES (?,?,?)"
  );

  // Insert data into artworks table and fetch latest inserted row
  insertData(artworkStmt, ["Mona Lisa", "1503-06", "Oil on Panel"], "artworks");
  fetchLatest("artworks", "id")

  // Commit artworks statement
  artworkStmt.finalize();


  // Insert SQL statement for created_by table (many-to-many relationship)
  let created_byStmt = db.prepare(
    "INSERT INTO created_by (artist_id, artwork_id) VALUES (?, ?)"
  );

  // Insert data into created_by table
  insertData(created_byStmt, [1, 1], "created_by"); // Assuming artist_id 1 and artwork_id 1 are related (Leonardo da Vinci created Mona Lisa)
  fetchLatest("created_by", "artist_id")
  // Commit created_by statement
  created_byStmt.finalize();

  // Create belongs_to table for one-to-one relationship between artworks and museums
  db.run(
    "CREATE TABLE belongs_to (artwork_id INTEGER, museum_id INTEGER, FOREIGN KEY(artwork_id) REFERENCES artworks(id), FOREIGN KEY(museum_id) REFERENCES museum(id), PRIMARY KEY(artwork_id))"
  );

  // Insert SQL statement for belongs_to table (one-to-one relationship)
  let belongs_toStmt = db.prepare(
    "INSERT INTO belongs_to (artwork_id, museum_id) VALUES (?, ?)"
  );

  // Insert data into belongs_to table
  insertData(belongs_toStmt, [1, 1], "belongs_to");  //Assuming artwork_id 1 and museum_id 1 are related
  fetchLatest("belongs_to", "museum_id") 

  // Commit belongs_to statement
  belongs_toStmt.finalize();

  // Create included_in table for one-to-one relationship between artworks and art_period
  db.run(
    "CREATE TABLE included_in (artwork_id INTEGER, art_period_id INTEGER, FOREIGN KEY(artwork_id) REFERENCES artworks(id), FOREIGN KEY(art_period_id) REFERENCES art_period(id), PRIMARY KEY(artwork_id))"
  );

  // Insert SQL statement for included_in table (one-to-one relationship)
  let included_inStmt = db.prepare(
    "INSERT INTO included_in (artwork_id, art_period_id) VALUES (?, ?)"
  );

  // Insert data into included_in table
  insertData(included_inStmt, [1, 1], "included_in");  // Assuming artwork_id 1 is included in art_period_id 1
  fetchLatest("included_in", "art_period_id") 

  // Commit included_in statement
  included_inStmt.finalize();

  // Create lived_in table for many-to-many relationship between artists and art_period
  db.run(
    "CREATE TABLE lived_in (artist_id INTEGER, art_period_id INTEGER, FOREIGN KEY(artist_id) REFERENCES artists(artist_id), FOREIGN KEY(art_period_id) REFERENCES art_period(id), PRIMARY KEY(artist_id, art_period_id))"
  );

  // Insert SQL statement for lived_in table (many-to-many relationship)
  let lived_inStmt = db.prepare(
    "INSERT INTO lived_in (artist_id, art_period_id) VALUES (?, ?)"
  );

  // Insert data into lived_in table
  insertData(lived_inStmt, [1, 1], "lived_in");  // Assuming artist_id 1 lived in art_period_id 1
  fetchLatest("lived_in", "art_period_id") 

  // Commit lived_in statement
  lived_inStmt.finalize();

  // Create owned_by table for one-to-many relationship between artworks and collectors
  db.run(
    "CREATE TABLE owned_by (artwork_id INTEGER, collector_id INTEGER, FOREIGN KEY(artwork_id) REFERENCES artworks(id), FOREIGN KEY(collector_id) REFERENCES collector(id))"
  );

  // Insert SQL statement for owned_by table (one-to-many relationship)
  let owned_byStmt = db.prepare(
    "INSERT INTO owned_by (artwork_id, collector_id) VALUES (?, ?)"
  );

  // Insert data into owned_by table
  insertData(owned_byStmt, [1, 1], "owned_by");  // Assuming artwork_id 1 is owned by collector_id 1
  fetchLatest("owned_by", "collector_id") 

  // Commit owned_by statement
  owned_byStmt.finalize();

  // Create falls_under table for one-to-many relationship between artworks and art_style
  db.run(
    "CREATE TABLE falls_under (artwork_id INTEGER, art_style_id INTEGER, FOREIGN KEY(artwork_id) REFERENCES artworks(id), FOREIGN KEY(art_style_id) REFERENCES art_style(id))"
  );

  // Insert SQL statement for falls_under table (one-to-many relationship)
  let falls_underStmt = db.prepare(
    "INSERT INTO falls_under (artwork_id, art_style_id) VALUES (?, ?)"
  );

  // Insert data into falls_under table
  insertData(falls_underStmt, [1, 1], "falls_under");  // Assuming artwork_id 1 falls under art_style_id 1
  fetchLatest("falls_under", "art_style_id")  

  // Commit falls_under statement
  falls_underStmt.finalize();
});

// POST user register
app.post("/register", async (req, res) => {
  const { username, password, name } = req.body;

  // Hash the user's password using bcrypt
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert the user's registration data into the "users" table
  const stmt = db.prepare(
    "INSERT INTO users (username, password, name) VALUES (?, ?, ?)"
  );
  stmt.run(username, hashedPassword, name, (err) => {
    if (err) {
      return res.status(500).send("Registration failed.");
    }
    res.status(201).send("User registered successfully!");
  });
  stmt.finalize();
});

// POST user login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Retrieve the user's data from the database based on the provided username
  db.get(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async (err, user) => {
      if (err) {
        return res.status(500).send("Login failed.");
      }

      if (!user) {
        return res.status(401).send("Invalid username or password.");
      }

      // Compare the hashed password with the provided password using bcrypt
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).send("Invalid username or password.");
      }

      // Set session variable to indicate authentication
      req.session.isAuthenticated = true;
      req.session.userId = user.id;

      res.status(200).send("Login successful!");
    }
  );
});

// POST user logout
app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
    }
    res.status(200).send("Logged out successfully!");
  });
});

// DELETE artwork in artworks table using id as param
app.delete("/artworks/:id", (req, res) => {
  const id = req.params.id;

  let stmt = db.prepare("DELETE FROM artworks WHERE id = ?");

  stmt.run(id, (err) => {
    if (err) {
      return console.error(err.message);
    }

    res.send("Artwork deleted successfully!");
  });
});

// PUT artwork in artworks table using id as param
app.put("/artworks/:id", (req, res) => {
  const id = req.params.id;
  const update = req.body;

  if (!update.title || !update.year || !update.medium) {
    return res.sendStatus(400);
  }

  let stmt = db.prepare(
    "UPDATE artworks SET title = ?, year = ?, medium = ? WHERE id = ?"
  );

  stmt.run(update.title, update.year, update.medium, id, (err) => {
    if (err) {
      return console.error(err.message);
    }

    res.send("Data updated successfully!");
  });
});

// GET all artworks
app.get("/artworks", (req, res) => {
  db.all("SELECT * FROM artworks", [], (err, rows) => {
    if (err) {
      throw err;
    }
    res.send(rows);
  });
});

// POST artwork in artworks table
app.post("/artworks", (req, res) => {
  if (!req.body.title || !req.body.year || !req.body.medium) {
    return res.sendStatus(400);
  }

  let stmt = db.prepare(
    "INSERT INTO artworks (title, year, medium) VALUES (?,?,?)"
  );
  stmt.run(req.body.title, req.body.year, req.body.medium, (err) => {
    if (err) {
      return console.error(err.message);
    }
    res.send("Data inserted successfully!");
  });
  stmt.finalize();
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
