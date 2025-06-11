/*const express = require('express');
const router = express.Router();
const uploadAdminController = require('../Controllers/UploadAdminController'); // Importe ton contrôleur

// --- Supprimez ou commentez cette ligne : ---
// router.get('/upload-photo', uploadAdminController.renderUploadForm);

// Route pour gérer l'upload de la photo (celle-ci doit rester)
// POST /admin/upload-photo
router.post('/upload-photo', uploadAdminController.uploadPhoto);

module.exports = router;*/


const express = require('express');
const router = express.Router();
const uploadAdminController = require('../Controllers/UploadAdminController'); // Importe ton contrôleur
const upload = require('../Config/multerConfig'); // <--- NOUVEAU : Importe la configuration Multer ici




// Ici, Multer s'exécute AVANT le contrôleur pour traiter le fichier.
router.post('/upload-photo', upload.single('photo'), uploadAdminController.uploadPhoto);

// C'est cette partie qui manquait !

module.exports = router;