const { getItemsByParameter } = require('../utils/queryHelper');
const db = require("../models/db");
// Artworks
const getArtworksByArtist = async (req, res) => {
    getItemsByParameter(req, res,'artworks', 'artists', 'created_by');
};

const getArtworksByMuseum = async (req, res) => {
    getItemsByParameter(req, res,'artworks', 'museums', 'belongs_to');
};

const getArtworksByPeriod = async (req, res) => {
    getItemsByParameter(req, res,'artworks', 'art_periods', 'included_in');
};

const getArtworksByStyle = async (req, res) => {
    getItemsByParameter(req, res,'artworks', 'art_styles', 'falls_under');
};

const getArtworksByCollector = async (req, res) => {
    getItemsByParameter(req, res,'artworks', 'collectors', 'owned_by');
};

// Artists
const getArtistsByArtPeriod = async (req, res) => {
    getItemsByParameter(req, res,'artists', 'art_periods', 'lived_in');
};

// Museums
const getMuseumsByArtwork = async (req, res) => {
    getItemsByParameter(req, res,'museums', 'artworks', 'belongs_to');
};

// Art Periods
const getArtPeriodsByArtwork = async (req, res) => {
    getItemsByParameter(req, res,'art_periods', 'artworks', 'included_in');
};

// Idirect relationships
const getArtistsByMuseum = async (req, res) => {
    getItemsByParameter(req, res,'artists', 'museums', 'created_by', 'belongs_to',"artworks");
};

// Museums
const getMuseumsByArtist = async (req, res) => {
    getItemsByParameter(req, res,'museums', 'artists', 'created_by', 'belongs_to','artworks');
};

// Art Styles
const getArtStylesByArtwork = async (req, res) => {
    getItemsByParameter(req, res,'art_styles', 'artworks', 'falls_under');
};

// Collectors
const getCollectorsByArtStyle = async (req, res) => {
    getItemsByParameter(req, res,'collectors', 'art_styles', 'owned_by','falls_under', 'artworks');
};


module.exports = {
    getArtworksByArtist,
    getArtworksByMuseum,
    getArtworksByPeriod,
    getArtworksByStyle,
    getArtworksByCollector,
    getArtistsByArtPeriod,
    getMuseumsByArtwork,
    getArtPeriodsByArtwork,
    getArtistsByMuseum,
    getMuseumsByArtist,
    getArtStylesByArtwork,
    getCollectorsByArtStyle,
};