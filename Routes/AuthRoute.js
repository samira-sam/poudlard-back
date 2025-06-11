const express = require('express');
const router = express.Router();
const AuthController = require('../Controllers/AuthController');
const { authenticate } = require('../Middlewares/Authenticate'); // Si vous avez un middleware pour vérifier les tokens

// Route d'inscription
router.post('/register', AuthController.register);


// Route de connexion
router.post('/login', AuthController.login);

// Route pour récupérer les infos de l'utilisateur (seulement connecté)
router.get('/me', authenticate, AuthController.getUser);
router.get('/user', authenticate, AuthController.getUser);
module.exports = router;
