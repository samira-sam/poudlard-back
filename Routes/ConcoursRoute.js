const express = require('express');
const router = express.Router();
const ConcoursController= require('../Controllers/ConcoursController');
//const { authenticate } = require('../Middlewares/Authenticate'); 
//const authorizeRole = require('../Middlewares/AuthorizeRole');



router.get(
    '/annee/:idAnnee', //ex:concours/annee/7
    ConcoursController.getConcoursByAnnee);

router.get(
    "/",
    //authenticate,
    //authorizeRole(['admin']),
    ConcoursController.getAllConcours
);

router.get(
    "/:id",
    //authenticate,
    //authorizeRole(['admin']),
    ConcoursController.getConcoursById
);

router.post(
    "/",
    //authenticate,
    //authorizeRole(['admin']),
    ConcoursController.addConcours
);

router.put(
    "/:id",
    //authenticate,
    //authorizeRole(['admin']),
    ConcoursController.updateConcours
);

router.delete(
    "/:id",
    //authenticate,
    //authorizeRole(['admin']),
    ConcoursController.deleteConcours
);

module.exports = router;

