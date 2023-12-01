const db = require("../models/db");
const { createRecord,deleteRecord,updateRecord,getAllRecords } = require("../utils/queryHelper");

const getAllArtworks = (req, res) => {
    getAllRecords('artworks', req, res);
};

const createArtwork = (req, res) => {
    createRecord('artworks', { title: req.body.title, year: req.body.year, medium: req.body.medium }, req, res);
};

const deleteArtwork = (req, res) => {
    deleteRecord('artworks', req.params.id, req, res);
};

const updateArtwork = (req, res) => {
    updateRecord('artworks', { title: req.body.title, year: req.body.year, medium: req.body.medium }, req.params.id, req, res);
};

module.exports = {
    getAllArtworks,
    createArtwork,
    deleteArtwork,
    updateArtwork,
};
