const express = require("express");
const router = express.Router();
const artworksController = require("../controllers/artworksController");

router.get("/artworks", artworksController.getAllArtworks);
router.post("/artworks", artworksController.createArtwork);
router.delete("/artworks/:id", artworksController.deleteArtwork);
router.put("/artworks/:id", artworksController.updateArtwork);

// New routes
router.get("/artworks/artists/:artistId", artworksController.getArtworksByArtist);
router.get("/artworks/museums/:museumId", artworksController.getArtworksByMuseum);
router.get("/artworks/collectors/:collectorId", artworksController.getArtworksByCollector);
router.get("/artworks/periods/:periodId", artworksController.getArtworksByPeriod);
router.get("/artworks/styles/:styleId", artworksController.getArtworksByStyle);

module.exports = router;
