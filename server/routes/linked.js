const express = require("express");
const router = express.Router();
const linkedController = require("../controllers/linkedController");
router.get("/artworks/artists/:artistId", linkedController.getArtworksByArtist);
router.get("/artworks/museums/:museumId", linkedController.getArtworksByMuseum);
router.get("/artworks/collectors/:collectorId", linkedController.getArtworksByCollector);
router.get("/artworks/periods/:periodId", linkedController.getArtworksByPeriod);
router.get("/artworks/styles/:art_styleId", linkedController.getArtworksByStyle);
router.get("/artists/periods/:art_periodId", linkedController.getArtistsByArtPeriod);
router.get("/museums/artworks/:artworkId", linkedController.getMuseumsByArtwork);
router.get("/periods/artworks/:artworkId", linkedController.getArtPeriodsByArtwork);
router.get("/artists/museums/:museumId", linkedController.getArtistsByMuseum);
router.get("/museums/artists/:artistId", linkedController.getMuseumsByArtist);
router.get("/styles/artworks/:artworkId", linkedController.getArtStylesByArtwork);
router.get("/collectors/styles/:art_styleId", linkedController.getCollectorsByArtStyle);

module.exports = router;
