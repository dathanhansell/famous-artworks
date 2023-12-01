const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const artistsRoutes = require('./artists');
const artworksRoutes = require('./artworks');
const artPeriodsRoutes = require('./art_periods');
const museumsRoutes = require('./museums');
const collectorsRoutes = require('./collectors');
const artStylesRoutes = require('./art_styles');
const linkedRoutes = require('./linked');
const genericRoutes = require('./generic');
const {
    artistsRouter: artistsRouter_gen,
    artworksRouter: artworksRouter_gen,
    artPeriodsRouter: artPeriodsRouter_gen,
    museumsRouter: museumsRouter_gen,
    collectorsRouter: collectorsRouter_gen,
    artStylesRouter: artStylesRouter_gen
} = require('./generic');

// Use specific routes first
routerUse(authRoutes);
routerUse(artistsRoutes);
routerUse(artworksRoutes);
routerUse(artPeriodsRoutes);
routerUse(museumsRoutes);
routerUse(collectorsRoutes);
routerUse(artStylesRoutes);
routerUse(linkedRoutes);
routerUse(genericRoutes);
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

