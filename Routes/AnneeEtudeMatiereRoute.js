const express = require('express');
const router = express.Router();
const AnneeEtudeMatiereController = require('../Controllers/AnneeEtudeMatiereController');
//const  {authenticate } = require('../Middlewares/Authenticate'); // middleware d'authentification
//const authorizeRole  = require('../Middlewares/AuthorizeRole');

router.post(
  '/',
  //authenticate,          
  AnneeEtudeMatiereController.ajouterAnneeEtudeMatiere
);
router.get(
  "/",
  //authenticate,                                
  //authorizeRole(['admin']),      
  AnneeEtudeMatiereController.getAllAnneeEtudeMatiere
);

module.exports = router;