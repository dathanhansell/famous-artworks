const { joinTables } = require('../utils/queryHelper');
const db = require("../models/db");


const getAllStyles = (req, res) => {
    db.all("SELECT * FROM art_styles", [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.send(rows);
    });
};

const createStyle = (req, res) => {
    if (!req.body.name) {
        return res.sendStatus(400);
    }

    let stmt = db.prepare(
        "INSERT INTO art_styles (name) VALUES (?)"
    );
    stmt.run(req.body.name, (err) => {
        if (err) {
            return console.error(err.message);
        }
        res.send("Data inserted successfully!");
    });
    stmt.finalize();
};

const deleteStyle = (req, res) => {
    const id = req.params.id;

    let stmt = db.prepare("DELETE FROM art_styles WHERE id = ?");

    stmt.run(id, (err) => {
        if (err) {
            return console.error(err.message);
        }

        res.send("Styles deleted successfully!");
    });
};

const updateStyle = (req, res) => {
    const id = req.params.id;
    const update = req.body;

    if (!update.name ) {
        return res.sendStatus(400);
    }

    let stmt = db.prepare(
        "UPDATE art_styles SET name = ? WHERE id = ?"
    );

    stmt.run(update.name, id, (err) => {
        if (err) {
            return console.error(err.message);
        }

        res.send("Data updated successfully!");
    });
};

module.exports = {
    getAllStyles,
    createStyle,
    deleteStyle,
    updateStyle,

};
