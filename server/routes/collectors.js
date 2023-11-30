const express = require("express");
const router = express.Router();
const collectorsController = require("../controllers/collectorsController");

router.get("/collectors", collectorsController.getAllCollectors);
router.post("/collectors", collectorsController.createCollector);
router.delete("/collectors/:id", collectorsController.deleteCollector);
router.put("/collectors/:id", collectorsController.updateCollector);

module.exports = router;
