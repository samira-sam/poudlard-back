
const express = require("express");
const ProfesseurController = require("../Controllers/ProfesseurController");
const router = express.Router();

const { authenticate } = require('../Middlewares/Authenticate'); 
const authorizeRole = require('../Middlewares/AuthorizeRole');   

router.get(
    "/",
    //authenticate,                               
    //authorizeRole(['admin', 'professeur']),       
    ProfesseurController.getAllProfesseurs
);



router.get(
    "/:id",
    //authenticate,
    //authorizeRole(['admin', 'professeur']),
    ProfesseurController.getProfesseurById
);

router.post(
    "/",
    //authenticate,
    //authorizeRole(['admin']),                     
    ProfesseurController.addProfesseur
);




router.put(
    "/:id",
    //authenticate,  --------------------> pour parametrer l'accès aux routes selon le role
    //authorizeRole(['admin']), -----------|                    
    ProfesseurController.updateProfesseur
);


router.delete(
    "/:id",
    //authenticate,
    //authorizeRole(['admin']),                     
    ProfesseurController.deleteProfesseur
);

module.exports = router;