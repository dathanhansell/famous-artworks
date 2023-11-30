const { joinTables } = require('../utils/queryHelper');
const db = require("../models/db");


const getAllArtists = (req, res) => {
    db.all("SELECT * FROM Artists", [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.send(rows);
    });
};

const createArtist = (req, res) => {
    if (!req.body.title || !req.body.year || !req.body.medium) {
        return res.sendStatus(400);
    }

    let stmt = db.prepare(
        "INSERT INTO Artists (title, year, medium) VALUES (?,?,?)"
    );
    stmt.run(req.body.title, req.body.year, req.body.medium, (err) => {
        if (err) {
            return console.error(err.message);
        }
        res.send("Data inserted successfully!");
    });
    stmt.finalize();
};

const deleteArtist = (req, res) => {
    const id = req.params.id;

    let stmt = db.prepare("DELETE FROM Artists WHERE id = ?");

    stmt.run(id, (err) => {
        if (err) {
            return console.error(err.message);
        }

        res.send("Artist deleted successfully!");
    });
};

const updateArtist = (req, res) => {
    const id = req.params.id;
    const update = req.body;

    if (!update.title || !update.year || !update.medium) {
        return res.sendStatus(400);
    }

    let stmt = db.prepare(
        "UPDATE Artists SET title = ?, year = ?, medium = ? WHERE id = ?"
    );

    stmt.run(update.title, update.year, update.medium, id, (err) => {
        if (err) {
            return console.error(err.message);
        }

        res.send("Data updated successfully!");
    });
};

module.exports = {
    getAllArtists,
    createArtist,
    deleteArtist,
    updateArtist,

};
