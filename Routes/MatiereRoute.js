const express = require("express");
const MatiereController = require("../Controllers/MatiereController");
const router = express.Router();

router.get("/", MatiereController.getAllMatiere);
router.get("/:id", MatiereController.getMatiereById);
router.post("/", MatiereController.addMatiere);
router.put("/:id", MatiereController.updateMatiere);
router.delete("/:id", MatiereController.deleteMatiere);

module.exports = router;
