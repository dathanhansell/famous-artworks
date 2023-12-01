const db = require("../models/db");
const { createRecord, deleteRecord, updateRecord, getAllRecords } = require("../utils/queryHelper");

const getAllCollectors = (req, res) => {
    getAllRecords('collectors', req, res);
};

const createCollector = (req, res) => {
    createRecord('collectors', { name: req.body.name, country: req.body.country }, req, res);
};

const deleteCollector = (req, res) => {
    deleteRecord('collectors', req.params.id, req, res);
};

const updateCollector = (req, res) => {
    updateRecord('collectors', { name: req.body.name, country: req.body.country }, req.params.id, req, res);
};

module.exports = {
    getAllCollectors,
    createCollector,
    deleteCollector,
    updateCollector,
};
