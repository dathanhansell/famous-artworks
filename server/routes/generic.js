const express = require("express");
const db = require("../models/db");
const { createRecord, deleteRecord, updateRecord, getAllRecords, getRecordsLike } = require("../utils/queryHelper");

function createRouter(tableName, fields) {
    const router = express.Router();

    router.get(`/${tableName}/search`, (req, res) => getRecordsLike(tableName, req, res));
    router.get(`/${tableName}`, (req, res) => getAllRecords(tableName, req, res));
    router.post(`/${tableName}`, (req, res) => createRecord(tableName, getFields(req, fields), req, res));
    router.delete(`/${tableName}/:id`, (req, res) => deleteRecord(tableName, req.params.id, req, res));
    router.put(`/${tableName}/:id`, (req, res) => updateRecord(tableName, getFields(req, fields), req.params.id, req, res));

    function getFields(req, fields) {
        let result = {};
        fields.forEach(field => {
            result[field] = req.body[field];
        });
        return result;
    }

    return router;
}

const artistsRouter = createRouter('artists', ['name', 'birthdate', 'nationality']);
const artworksRouter = createRouter('artworks', ['title', 'year', 'medium']);
const artPeriodsRouter = createRouter('art_periods', ['name', 'start_year', 'end_year']);
const museumsRouter = createRouter('museums', ['name', 'location']);
const collectorsRouter = createRouter('collectors', ['name', 'country']);
const artStylesRouter = createRouter('art_styles', ['name']);

module.exports = {
    artistsRouter,
    artworksRouter,
    artPeriodsRouter,
    museumsRouter,
    collectorsRouter,
    artStylesRouter
};
