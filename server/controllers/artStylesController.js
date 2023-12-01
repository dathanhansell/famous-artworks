const db = require("../models/db");
const { createRecord, deleteRecord, updateRecord, getAllRecords } = require("../utils/queryHelper");

const getAllStyles = (req, res) => {
    getAllRecords('art_styles', req, res);
};

const createStyle = (req, res) => {
    createRecord('art_styles', { name: req.body.name }, req, res);
};

const deleteStyle = (req, res) => {
    deleteRecord('art_styles', req.params.id, req, res);
};

const updateStyle = (req, res) => {
    updateRecord('art_styles', { name: req.body.name }, req.params.id, req, res);
};

module.exports = {
    getAllStyles,
    createStyle,
    deleteStyle,
    updateStyle,
};
