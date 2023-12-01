const db = require("../models/db");
const { createRecord, deleteRecord, updateRecord, getAllRecords,getRecordsLike } = require("../utils/queryHelper");

const getArtistsLike = async (req, res) => {
    getRecordsLike('artists', req, res);
};

const getAllArtists = (req, res) => {
    getAllRecords('artists', req, res);
};

const createArtist = (req, res) => {
    createRecord('artists', { title: req.body.title, year: req.body.year, medium: req.body.medium }, req, res);
};

const deleteArtist = (req, res) => {
    deleteRecord('artists', req.params.id, req, res);
};

const updateArtist = (req, res) => {
    updateRecord('artists', { title: req.body.title, year: req.body.year, medium: req.body.medium }, req.params.id, req, res);
};

module.exports = {
    getAllArtists,
    createArtist,
    deleteArtist,
    updateArtist,
    getArtistsLike,
};
