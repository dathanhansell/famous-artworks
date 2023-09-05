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

db.serialize(() => {
  // Create users table
  db.run(
    "CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT, name TEXT)"
  );

  // Create artworks table
  db.run(
    "CREATE TABLE artworks (id INTEGER PRIMARY KEY AUTOINCREMENT, artist TEXT, title TEXT, dateOfCompletion TEXT, country TEXT, style TEXT, location TEXT)"
  );

  // Insert SQL statement
  let stmt = db.prepare(
    "INSERT INTO artworks (artist, title, dateOfCompletion, country, style, location) VALUES (?,?,?,?,?,?)"
  );

  // Insert actual data values
  stmt.run(
    "Leonardo da Vinci",
    "Mona Lisa",
    "1503-06",
    "Italy",
    "Renaissance",
    "Louvre Museum, Paris"
  );

  // Commit statement
  stmt.finalize();
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

  if (
    !update.artist ||
    !update.title ||
    !update.dateOfCompletion ||
    !update.country ||
    !update.style ||
    !update.location
  ) {
    return res.sendStatus(400);
  }

  let stmt = db.prepare(
    "UPDATE artworks SET artist = ?, title = ?, dateOfCompletion = ?, country = ?, style = ?, location = ? WHERE id = ?"
  );

  stmt.run(
    update.artist,
    update.title,
    update.dateOfCompletion,
    update.country,
    update.style,
    update.location,
    id,
    (err) => {
      if (err) {
        return console.error(err.message);
      }

      res.send("Data updated successfully!");
    }
  );
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
  if (
    !req.body.artist ||
    !req.body.title ||
    !req.body.dateOfCompletion ||
    !req.body.country ||
    !req.body.style ||
    !req.body.location
  ) {
    return res.sendStatus(400);
  }

  let stmt = db.prepare("INSERT INTO artworks VALUES (NULL,?,?,?,?,?,?)");
  stmt.run(
    req.body.artist,
    req.body.title,
    req.body.dateOfCompletion,
    req.body.country,
    req.body.style,
    req.body.location,
    (err) => {
      if (err) {
        return console.error(err.message);
      }
      res.send("Data inserted successfully!");
    }
  );
  stmt.finalize();
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
