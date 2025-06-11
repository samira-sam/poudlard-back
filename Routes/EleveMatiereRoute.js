const express = require('express');
const router = express.Router();
const InscriptionController = require('../Controllers/EleveMatiereController'); 
//const  {authenticate } = require('../Middlewares/Authenticate'); // middleware d'authentification
//const authorizeRole  = require('../Middlewares/AuthorizeRole'); // middleware pour vérifier le rôle admin

// Route pour inscrire un élève à une matière
// Seul admin a accès ['admin']
router.post(
  '/eleve-matiere',
  //authenticate,          // utilisateur est connecté ?
  //authorizeRole(['admin']),   // utilisateur connecté est un admin ?
  InscriptionController.inscrireEleveMatiere
);

module.exports = router;