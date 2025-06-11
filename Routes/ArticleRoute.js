
// ArticleRoute.js
const express = require("express");
const ArticleController = require("../Controllers/ArticleController");
const router = express.Router();

// N'oublie pas d'importer nos gardes du corps !
const { authenticate } = require('../Middlewares/Authenticate'); // Adapte le chemin si besoin
const authorizeRole = require('../Middlewares/AuthorizeRole');   // Adapte le chemin si besoin

// --- Qui peut VOIR la liste de tous les Articles ? ---

router.get(
    "/",
    //authenticate,                                 // Il faut être connecté
    //authorizeRole(['admin']),      
    ArticleController.getAllArticles
);

// --- Qui peut VOIR les détails d'UN Article spécifique ? ---
// Pareil, peut-être admins 
router.get(
    "/:id",
    //authenticate,
    //authorizeRole(['admin']),
    ArticleController.getArticleById
);

// --- Qui peut AJOUTER un nouveau Article ? ---
// Normalement, seul un admin peut faire ça.
router.post(
    "/",
    //authenticate,
    //authorizeRole(['admin']),                     
    ArticleController.addArticle
);


router.put(
    "/:id",
    //authenticate,
    //authorizeRole(['admin']),                     
    ArticleController.updateArticle
);


router.delete(
    "/:id",
   // authenticate,
    //authorizeRole(['admin']),                     
    ArticleController.deleteArticle
);

module.exports = router;