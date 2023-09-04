const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3001;
const sqlite3 = require("sqlite3").verbose();
let db = new sqlite3.Database(":memory:");
const cors = require("cors");

app.use(cors());
app.use(bodyParser.json());

db.serialize(() => {
  db.run("CREATE TABLE artworks (id INTEGER PRIMARY KEY AUTOINCREMENT, artist TEXT, title TEXT, dateOfCompletion TEXT, country TEXT, style TEXT, location TEXT)");

  let stmt = db.prepare("INSERT INTO artworks (artist, title, dateOfCompletion, country, style, location) VALUES (?,?,?,?,?,?)");
  stmt.run("Leonardo da Vinci", "Mona Lisa", "1503-06", "Italy", "Renaissance", "Louvre Museum, Paris");
  stmt.finalize();
});
app.delete('/artworks/:id', (req, res) => {
  const id = req.params.id;

  let stmt = db.prepare("DELETE FROM artworks WHERE id = ?");

  stmt.run(id, (err) => {
    if (err) {
      return console.error(err.message);
    }

    res.send("Artwork deleted successfully!");
  });
});

app.put("/artworks/:id", (req, res) => {
  const id = req.params.id;
  const update = req.body;

  if (!update.artist || !update.title || !update.dateOfCompletion || !update.country || !update.style || !update.location) {
    return res.sendStatus(400);
  }

  let stmt = db.prepare("UPDATE artworks SET artist = ?, title = ?, dateOfCompletion = ?, country = ?, style = ?, location = ? WHERE id = ?");

  stmt.run(update.artist, update.title, update.dateOfCompletion, update.country, update.style, update.location, id, (err) => {
    if (err) {
      return console.error(err.message);
    }
  
    res.send("Data updated successfully!");
  });
});

app.get("/artworks", (req, res) => {
  db.all("SELECT * FROM artworks", [], (err, rows) => {
    if (err) {
      throw err;
    }
    res.send(rows);
  });
});

app.post("/artworks", (req, res) => {
  if (!req.body.artist || !req.body.title || !req.body.dateOfCompletion || !req.body.country || !req.body.style || !req.body.location) {
    return res.sendStatus(400);
  }

  let stmt = db.prepare("INSERT INTO artworks VALUES (NULL,?,?,?,?,?,?)");
  stmt.run(req.body.artist, req.body.title, req.body.dateOfCompletion, req.body.country, req.body.style, req.body.location, (err) => {
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