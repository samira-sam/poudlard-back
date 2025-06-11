const express = require("express");
const VacancesController = require("../Controllers/VacancesController");
const router = express.Router();

router.get("/", (req, res) => {
  VacancesController.getAllVacances(req, res);
});

router.get("/:id", (req, res) => {
  VacancesController.getVacancesById(req, res);
});

router.post("/", (req, res) => {
  VacancesController.addVacances(req, res);
});

router.put("/:id", (req, res) => {
  VacancesController.updateVacances(req, res);
});

router.delete("/:id", (req, res) => {
  VacancesController.deleteVacances(req, res);
});

module.exports = router;