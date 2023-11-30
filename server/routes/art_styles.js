const express = require("express");
const router = express.Router();
const artStylesController = require("../controllers/artStylesController");

router.get("/styles", artStylesController.getAllStyles);
router.post("/styles", artStylesController.createStyle);
router.delete("/styles/:id", artStylesController.deleteStyle);
router.put("/styles/:id", artStylesController.updateStyle);

module.exports = router;
