const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const artistsRoutes = require('./artists');
const artworksRoutes = require('./artworks');
const artPeriodsRoutes = require('./art_periods');
const museumsRoutes = require('./museums');
const collectorsRoutes = require('./collectors');
const artStylesRoutes = require('./art_styles');

router.use(authRoutes);
router.use(artistsRoutes);
router.use(artworksRoutes);
router.use(artPeriodsRoutes);
router.use(museumsRoutes);
router.use(collectorsRoutes);
router.use(artStylesRoutes);

module.exports = router;
