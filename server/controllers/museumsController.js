const db = require("../models/db");
const { get } = require("../routes");
const { createRecord, deleteRecord, updateRecord, getAllRecords,getRecordsLike } = require("../utils/queryHelper");

const getMuseumsLike = async (req, res) => {
    getRecordsLike('museums', req, res);
};

const getAllMuseums = (req, res) => {
    getAllRecords('museums', req, res);
};

const createMuseum = (req, res) => {
    createRecord('museums', { name: req.body.name, location: req.body.location }, req, res);
};

const deleteMuseum = (req, res) => {
    deleteRecord('museums', req.params.id, req, res);
};

const updateMuseum = (req, res) => {
    updateRecord('museums', { name: req.body.name, location: req.body.location }, req.params.id, req, res);
};

module.exports = {
    getAllMuseums,
    createMuseum,
    deleteMuseum,
    updateMuseum,
    getMuseumsLike,
};
