const express = require("express");
const MaisonController = require("../Controllers/MaisonController");
const router = express.Router();

router.get("/", MaisonController.getAllMaisons);
router.get("/:id", MaisonController.getMaisonById);
router.post("/", MaisonController.addMaison);
router.put("/:id", MaisonController.updateMaison);
router.delete("/:id", MaisonController.deleteMaison);

module.exports = router;
