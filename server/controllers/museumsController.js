const { joinTables } = require('../utils/queryHelper');
const db = require("../models/db");


const getAllMuseums = (req, res) => {
    db.all("SELECT * FROM museums", [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.send(rows);
    });
};

const createMuseum = (req, res) => {
    if (!req.body.name | !req.body.location) {
        return res.sendStatus(400);
    }

    let stmt = db.prepare(
        "INSERT INTO museums (name, location) VALUES (?,?)"
    );
    stmt.run(req.body.name, (err) => {
        if (err) {
            return console.error(err.message);
        }
        res.send("Data inserted successfully!");
    });
    stmt.finalize();
};

const deleteMuseum = (req, res) => {
    const id = req.params.id;

    let stmt = db.prepare("DELETE FROM museums WHERE id = ?");

    stmt.run(id, (err) => {
        if (err) {
            return console.error(err.message);
        }

        res.send("Museums deleted successfully!");
    });
};

const updateMuseum = (req, res) => {
    const id = req.params.id;
    const update = req.body;

    if (!update.name | !update.location) {
        return res.sendStatus(400);
    }

    let stmt = db.prepare(
        "UPDATE museums SET name = ?, location = ? WHERE id = ?"
    );

    stmt.run(update.name,update.location, id, (err) => {
        if (err) {
            return console.error(err.message);
        }

        res.send("Data updated successfully!");
    });
};

module.exports = {
    getAllMuseums,
    createMuseum,
    deleteMuseum,
    updateMuseum,

};
