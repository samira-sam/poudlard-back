
// BdcRoute.js
const express = require("express");
const BdcController = require("../Controllers/BdcController");
const router = express.Router();

// N'oublie pas d'importer nos gardes du corps !
const { authenticate } = require('../Middlewares/Authenticate'); // Adapte le chemin si besoin
const authorizeRole = require('../Middlewares/AuthorizeRole');   // Adapte le chemin si besoin

// --- Qui peut VOIR la liste de tous les Bdcs ? ---

router.get(
    "/",
    authenticate,                                 // Il faut être connecté
    authorizeRole(['admin']),      
    BdcController.getAllBdcs
);

// --- Qui peut VOIR les détails d'UN Bdc spécifique ? ---
// Pareil, peut-être admins 
router.get(
    "/:id",
    authenticate,
    authorizeRole(['admin']),
    BdcController.getBdcById
);

// --- Qui peut AJOUTER un nouveau Bdc ? ---
// Normalement, seul un admin peut faire ça.
router.post(
    "/",
    authenticate,
    authorizeRole(['admin']),                     
    BdcController.addBdc
);


router.put(
    "/:id",
    authenticate,
    authorizeRole(['admin']),                     
    BdcController.updateBdc
);


router.delete(
    "/:id",
    authenticate,
    authorizeRole(['admin']),                     
    BdcController.deleteBdc
);

module.exports = router;