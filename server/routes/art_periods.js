const express = require("express");
const router = express.Router();
const artPeriodsController = require("../controllers/artPeriodsController");

router.get("/periods", artPeriodsController.getAllPeriods);
router.post("/periods", artPeriodsController.createPeriod);
router.delete("/periods/:id", artPeriodsController.deletePeriod);
router.put("/periods/:id", artPeriodsController.updatePeriod);

module.exports = router;
