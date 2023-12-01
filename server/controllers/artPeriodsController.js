const { getAllRecords, createRecord, deleteRecord, updateRecord } = require('../utils/queryHelper');
const db = require("../models/db");

const getAllPeriods = (req, res) => {
    getAllRecords('art_periods', req, res);
};

const createPeriod = (req, res) => {
    createRecord('art_periods', { name: req.body.name, start_year: req.body.start_year, end_year: req.body.end_year }, req, res);
};

const deletePeriod = (req, res) => {
    deleteRecord('art_periods', req.params.id, req, res);
};

const updatePeriod = (req, res) => {
    updateRecord('art_periods', { name: req.body.name, start_year: req.body.start_year, end_year: req.body.end_year }, req.params.id, req, res);
};

module.exports = {
    getAllPeriods,
    createPeriod,
    deletePeriod,
    updatePeriod,
};
