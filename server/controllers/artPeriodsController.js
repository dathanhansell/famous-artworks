const { joinTables } = require('../utils/queryHelper');
const db = require("../models/db");


const getAllPeriods = (req, res) => {
    db.all("SELECT * FROM art_periods", [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.send(rows);
    });
};

const createPeriod = (req, res) => {
    if (!req.body.name || !req.body.start_year || !req.body.end_year) {
        return res.sendStatus(400);
    }

    let stmt = db.prepare(
        "INSERT INTO art_periods (name, start_year, end_year) VALUES (?,?,?)"
    );
    stmt.run(req.body.name, req.body.start_year, req.body.end_year, (err) => {
        if (err) {
            return console.error(err.message);
        }
        res.send("Data inserted successfully!");
    });
    stmt.finalize();
};

const deletePeriod = (req, res) => {
    const id = req.params.id;

    let stmt = db.prepare("DELETE FROM art_periods WHERE id = ?");

    stmt.run(id, (err) => {
        if (err) {
            return console.error(err.message);
        }

        res.send("Period deleted successfully!");
    });
};

const updatePeriod = (req, res) => {
    const id = req.params.id;
    const update = req.body;

    if (!update.name || !update.start_year || !update.end_year) {
        return res.sendStatus(400);
    }

    let stmt = db.prepare(
        "UPDATE art_periods SET name = ?, start_year = ?, end_year = ? WHERE id = ?"
    );

    stmt.run(update.name, update.start_year, update.end_year, id, (err) => {
        if (err) {
            return console.error(err.message);
        }

        res.send("Data updated successfully!");
    });
};

module.exports = {
    getAllPeriods,
    createPeriod,
    deletePeriod,
    updatePeriod,

};
