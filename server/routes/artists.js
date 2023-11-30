const express = require("express");
const router = express.Router();
const artistsController = require("../controllers/artistsController");

router.get("/artists", artistsController.getAllArtists);
router.post("/artists", artistsController.createArtist);
router.delete("/artists/:id", artistsController.deleteArtist);
router.put("/artists/:id", artistsController.updateArtist);


module.exports = router;
