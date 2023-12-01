const db = require("../models/db");

const getAllArtworks = (req, res) => {
    db.all("SELECT * FROM artworks", [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.send(rows);
    });
};

const createArtwork = (req, res) => {
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
};

const deleteArtwork = (req, res) => {
    const id = req.params.id;

    let stmt = db.prepare("DELETE FROM artworks WHERE id = ?");

    stmt.run(id, (err) => {
        if (err) {
            return console.error(err.message);
        }

        res.send("Artwork deleted successfully!");
    });
};

const updateArtwork = (req, res) => {
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
};

module.exports = {
    getAllArtworks,
    createArtwork,
    deleteArtwork,
    updateArtwork,
};
