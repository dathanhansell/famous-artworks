const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const app = express();

const port = 3001;
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const db = new sqlite3.Database("./data.sqlite");
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
/*
// creating data tables
  db.run("CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT, name TEXT)");
  db.run("CREATE TABLE artists (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, birthdate TEXT, nationality TEXT)");
  db.run("CREATE TABLE artworks (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, year TEXT, medium TEXT)");
  db.run("CREATE TABLE art_periods (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, start_year TEXT, end_year TEXT)");
  db.run("CREATE TABLE museums (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, location TEXT)");
  db.run("CREATE TABLE collectors (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, country TEXT)");
  db.run("CREATE TABLE art_styles (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)");

  // creating relationship tables
  db.run("CREATE TABLE created_by (artist_id INTEGER, artwork_id INTEGER, FOREIGN KEY(artist_id) REFERENCES artists(artist_id), FOREIGN KEY(artwork_id) REFERENCES artworks(id), PRIMARY KEY(artist_id, artwork_id))");
  db.run("CREATE TABLE belongs_to (artwork_id INTEGER, museum_id INTEGER, FOREIGN KEY(artwork_id) REFERENCES artworks(id), FOREIGN KEY(museum_id) REFERENCES museums(id), PRIMARY KEY(artwork_id))");
  db.run("CREATE TABLE included_in (artwork_id INTEGER, art_period_id INTEGER, FOREIGN KEY(artwork_id) REFERENCES artworks(id), FOREIGN KEY(art_period_id) REFERENCES art_periods(id), PRIMARY KEY(artwork_id))");
  db.run("CREATE TABLE lived_in (artist_id INTEGER, art_period_id INTEGER, FOREIGN KEY(artist_id) REFERENCES artists(artist_id), FOREIGN KEY(art_period_id) REFERENCES art_periods(id), PRIMARY KEY(artist_id, art_period_id))");
  db.run("CREATE TABLE owned_by (artwork_id INTEGER, collector_id INTEGER, FOREIGN KEY(artwork_id) REFERENCES artworks(id), FOREIGN KEY(collector_id) REFERENCES collectors(id))");
  db.run("CREATE TABLE falls_under (artwork_id INTEGER, art_style_id INTEGER, FOREIGN KEY(artwork_id) REFERENCES artworks(id), FOREIGN KEY(art_style_id) REFERENCES art_styles(id))");*/
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
