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
  db.run("CREATE TABLE artworks (name TEXT, description TEXT)");

  let stmt = db.prepare("INSERT INTO artworks VALUES (?,?)");
  stmt.run("Mona Lisa", "A portrait by Leonardo da Vinci");
  stmt.finalize();
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
  if (!req.body.name || !req.body.description) {
    return res.sendStatus(400);
  }

  let stmt = db.prepare("INSERT INTO artworks VALUES (?,?)");
  stmt.run(req.body.name, req.body.description, (err) => {
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
