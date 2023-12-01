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

// Other routes
routerUse(authRoutes);

module.exports = router;
function routerUse(func) {
    if (typeof func === 'function') {
        router.use(func);
    }
}

