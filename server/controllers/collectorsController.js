const { joinTables } = require('../utils/queryHelper');
const db = require("../models/db");


const getAllCollectors = (req, res) => {
    db.all("SELECT * FROM collectors", [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.send(rows);
    });
};

const createCollector = (req, res) => {
    if (!req.body.name | !req.body.country) {
        return res.sendStatus(400);
    }

    let stmt = db.prepare(
        "INSERT INTO collectors (name, country) VALUES (?,?)"
    );
    stmt.run(req.body.name, (err) => {
        if (err) {
            return console.error(err.message);
        }
        res.send("Data inserted successfully!");
    });
    stmt.finalize();
};

const deleteCollector = (req, res) => {
    const id = req.params.id;

    let stmt = db.prepare("DELETE FROM collectors WHERE id = ?");

    stmt.run(id, (err) => {
        if (err) {
            return console.error(err.message);
        }

        res.send("Collectors deleted successfully!");
    });
};

const updateCollector = (req, res) => {
    const id = req.params.id;
    const update = req.body;

    if (!update.name | !update.country) {
        return res.sendStatus(400);
    }

    let stmt = db.prepare(
        "UPDATE collectors SET name = ?, country = ? WHERE id = ?"
    );

    stmt.run(update.name,update.country, id, (err) => {
        if (err) {
            return console.error(err.message);
        }

        res.send("Data updated successfully!");
    });
};

module.exports = {
    getAllCollectors,
    createCollector,
    deleteCollector,
    updateCollector,

};
