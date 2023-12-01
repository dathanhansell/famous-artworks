const express = require("express");
const router = express.Router();
const museumsController = require("../controllers/museumsController");

router.get("/museums/search", museumsController.getMuseumsLike);
router.get("/museums", museumsController.getAllMuseums);
router.post("/museums", museumsController.createMuseum);
router.delete("/museums/:id", museumsController.deleteMuseum);
router.put("/museums/:id", museumsController.updateMuseum);

module.exports = router;
