// Routes/InfoLivraisonRoute.js
const express = require("express");
const InfoLivraisonController = require("../Controllers/InfoLivraisonController");
const router = express.Router();

const { authenticate } = require('../Middlewares/Authenticate');
const authorizeRole = require('../Middlewares/AuthorizeRole');

router.get(
    "/",
    authenticate,
    authorizeRole(['admin']),
    InfoLivraisonController.getAllInfoLivraisons
);

router.get(
    "/:id",
    authenticate,
    authorizeRole(['admin']),
    InfoLivraisonController.getInfoLivraisonById
);

router.post(
    "/",
    authenticate,
    authorizeRole(['admin']),
    InfoLivraisonController.addInfoLivraison
);

router.put(
    "/:id",
    authenticate,
    authorizeRole(['admin']),
    InfoLivraisonController.updateInfoLivraison
);

router.delete(
    "/:id",
    authenticate,
    authorizeRole(['admin']),
    InfoLivraisonController.deleteInfoLivraison
);

module.exports = router;
