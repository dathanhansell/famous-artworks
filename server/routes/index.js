const express = require('express');
const router = express.Router();
const { createRouter } = require("../utils/queryHelper");

const authRoutes = require('./auth');
const artistsRoutes = require('./artists');
const artworksRoutes = require('./artworks');
const artPeriodsRoutes = require('./art_periods');
const museumsRoutes = require('./museums');
const collectorsRoutes = require('./collectors');
const artStylesRoutes = require('./art_styles');
const linkedRoutes = require('./linked');

const artistsRouter_gen = createRouter('artists', ['name', 'birthdate', 'nationality']);
const artworksRouter_gen = createRouter('artworks', ['title', 'year', 'medium']);
const artPeriodsRouter_gen = createRouter('art_periods', ['name', 'start_year', 'end_year']);
const museumsRouter_gen = createRouter('museums', ['name', 'location']);
const collectorsRouter_gen = createRouter('collectors', ['name', 'country']);
const artStylesRouter_gen = createRouter('art_styles', ['name']);

const created_by_gen = createRouter('created_by', ['artist_id','artwork_id']);
const belongs_to_gen = createRouter('belongs_to', ['artwork_id','museum_id']);
const included_in_gen = createRouter('included_in', ['artwork_id','art_period_id']);
const lived_in_gen = createRouter('lived_in', ['artist_id','art_period_id']);
const owned_by_gen = createRouter('owned_by', ['artwork_id','collector_id']);
const falls_under_gen = createRouter('falls_under', ['artwork_id','art_style_id']);
// Use specific routes first
routerUse(authRoutes);
routerUse(artistsRoutes);
routerUse(artworksRoutes);
routerUse(artPeriodsRoutes);
routerUse(museumsRoutes);
routerUse(collectorsRoutes);
routerUse(artStylesRoutes);
routerUse(linkedRoutes);
// then generic routes
routerUse(artistsRouter_gen);
routerUse(artworksRouter_gen);
routerUse(artPeriodsRouter_gen);
routerUse(museumsRouter_gen);
routerUse(collectorsRouter_gen);
routerUse(artStylesRouter_gen);

routerUse(created_by_gen);
routerUse(belongs_to_gen);
routerUse(included_in_gen);
routerUse(lived_in_gen);
routerUse(owned_by_gen);
routerUse(falls_under_gen);
// Other routes
routerUse(authRoutes);

module.exports = router;
function routerUse(func) {
    if (typeof func === 'function') {
        router.use(func);
    }
}

