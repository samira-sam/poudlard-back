const express = require("express");
const AnneeEtudeController = require("../Controllers/AnneeEtudeController");
const router = express.Router();

router.get("/", (req, res) => {
  AnneeEtudeController.getAllAnneeEtudes(req, res);
});

router.get("/:id", (req, res) => {
  AnneeEtudeController.getAnneeEtudeById(req, res);
});

router.post("/", (req, res) => {
  AnneeEtudeController.addAnneeEtude(req, res);
});

router.put("/:id", (req, res) => {
  AnneeEtudeController.updateAnneeEtude(req, res);
});

router.delete("/:id", (req, res) => {
  AnneeEtudeController.deleteAnneeEtude(req, res);
});

module.exports = router;
