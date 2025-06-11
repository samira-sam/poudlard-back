/*// routes/EleveProfilRoutes.js

const express = require('express');
const router = express.Router();
const EleveProfilController = require('../Controllers/EleveProfilController');
const { authenticate } = require('../Middlewares/Authenticate'); // Destructuring pour importer directement la fonction authenticate

// Route pour obtenir le profil de l'élève
router.get('/eleve/profil', authenticate, EleveProfilController.getProfil);

// ⭐ NOUVELLE ROUTE POUR METTRE À JOUR LE PROFIL DE L'ÉLÈVE ⭐
// Utilise PUT pour la mise à jour complète ou PATCH pour la mise à jour partielle
router.put('/eleve/profil', authenticate, EleveProfilController.updateProfil); // Ou router.patch

module.exports = router;*/




// routes/EleveProfilRoutes.js

const express = require('express');
const router = express.Router();
const EleveProfilController = require('../Controllers/EleveProfilController');
const { authenticate } = require('../Middlewares/Authenticate'); // Destructuring pour importer directement la fonction authenticate
const authorizeRole = require('../Middlewares/AuthorizeRole'); // ⭐ IMPORTE TON MIDDLEWARE DE RÔLE ⭐

// Route pour obtenir le profil de l'élève
// L'élève doit être authentifié ET avoir le rôle 'eleve'
router.get('/eleve/profil', authenticate, authorizeRole(['eleve']), EleveProfilController.getProfil);

// Route pour mettre à jour le profil de l'élève
// L'élève doit être authentifié ET avoir le rôle 'eleve'
router.put('/eleve/profil', authenticate, authorizeRole(['eleve']), EleveProfilController.updateProfil); // Ou router.patch

module.exports = router;
