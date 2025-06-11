const express = require('express');
const router = express.Router();
const adminController = require('../Controllers/AdminController');
const { authenticate } = require('../Middlewares/Authenticate');
const authorizeRole = require('../Middlewares/AuthorizeRole');

router.use(authenticate);
router.use(authorizeRole(['admin']));
console.log('authenticate:', authenticate);
console.log('authorizeRole:', authorizeRole);
console.log('typeof authorizeRole:', typeof authorizeRole);


// Lister les utilisateurs en attente
router.get('/utilisateurs-en-attente', adminController.getUtilisateursEnAttente);
router.put('/attribuer-role/:id', adminController.attribuerRole);
// Mettre à jour le rôle d’un utilisateur

router.get('/', adminController.getAll);
router.get('/:id', adminController.getById);
router.post('/', adminController.create);
router.delete('/:id', adminController.delete);

module.exports = router;


