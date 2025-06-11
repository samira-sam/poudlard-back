/*const express = require("express");
const EleveController = require("../Controllers/EleveController");
const router = express.Router();

router.get("/", (req, res) => {
  EleveController.getAllEleves(req, res);
});

router.get("/:id", (req, res) => {
  EleveController.getEleveById(req, res);
});

router.post("/", (req, res) => {
  EleveController.addEleve(req, res);
});

router.put("/:id", (req, res) => {
  EleveController.updateEleve(req, res);
});

router.delete("/:id", (req, res) => {
  EleveController.deleteEleve(req, res);
});

module.exports = router;*/





const express = require('express');
const router = express.Router();

const eleveController = require('../Controllers/EleveController');
const { authenticate } = require('../Middlewares/Authenticate'); // Adapte le chemin si besoin
const authorizeRole = require('../Middlewares/AuthorizeRole'); 

// Routes accessibles à tous (si besoin public)
router.get('/', eleveController.getAllEleves);
router.get('/:id', eleveController.getEleveById);

// Routes protégées - nécessitent authentification + rôle admin
router.post(
  '/',
  authenticate,
  authorizeRole(['admin']),
  eleveController.addEleve
);

router.put(
  '/:id',
  authenticate,
  authorizeRole(['admin']),
  eleveController.updateEleve
);

router.delete(
  '/:id',
  authenticate,
  authorizeRole(['admin']),
  eleveController.deleteEleve
);

module.exports = router;



