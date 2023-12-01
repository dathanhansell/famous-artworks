const express = require("express");
const router = express.Router();
const artworksController = require("../controllers/artworksController");

router.get("/artworks", artworksController.getAllArtworks);
router.post("/artworks", artworksController.createArtwork);
router.delete("/artworks/:id", artworksController.deleteArtwork);
router.put("/artworks/:id", artworksController.updateArtwork);

// New routes

module.exports = router;
