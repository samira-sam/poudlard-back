/*const express = require('express');
const router = express.Router();
const ResetPasswordController = require('../Controllers/ResetPasswordController');

const AuthController = require('../Controllers/AuthController');
const { authenticate } = require('../Middlewares/Authenticate'); // Si vous avez un middleware pour vérifier les tokens








// Route d'inscription
router.post('/register', AuthController.register);


// Route de connexion
router.post('/login', AuthController.login);

// Route pour récupérer les infos de l'utilisateur (seulement connecté)
router.get('/me', authenticate, AuthController.getUser);
router.get('/user', authenticate, AuthController.getUser);


// Routes pour mot de passe oublié / reset
router.post('/reset-password-request', ResetPasswordController.demanderReset);
router.post('/reset-password/:token', ResetPasswordController.resetMotDePasse);




module.exports = router;*/
const express = require('express');
const router = express.Router();
const AuthController = require('../Controllers/AuthController');
const ResetPasswordController = require('../Controllers/ResetPasswordController');
const resetPasswordController = new ResetPasswordController();

const { authenticate } = require('../Middlewares/Authenticate');

// Route d'inscription
router.post('/register', AuthController.register);

// Route de connexion
router.post('/login', AuthController.login);

// Route pour récupérer les infos de l'utilisateur (connecté)
router.get('/me', authenticate, AuthController.getUser);
router.get('/user', authenticate, AuthController.getUser);

// --- MODIFICATION ICI ---
// Mot de passe oublié - demande de reset
router.post('/request-password-reset', (req, res) => resetPasswordController.demanderReset(req, res)); // Renommé !

// Mot de passe oublié - soumission du nouveau mot de passe
router.post('/reset-password/:token', (req, res) => resetPasswordController.resetMotDePasse(req, res));

module.exports = router;

