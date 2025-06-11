// backend/routes/professeurProfil.routes.js
const express = require('express');
const router = express.Router();
const professeurProfilController = require('../Controllers/ProfesseurProfilController'); // Vérifie le chemin
const { authenticate } = require('../Middlewares/Authenticate'); // Vérifie le chemin vers authenticate
const authorizeRole = require('../Middlewares/AuthorizeRole'); // IMPORTE TON MIDDLEWARE authorizeRole

// --- Routes pour le Professeur ---

// GET : Récupérer le profil du professeur connecté
// URL: /api/professeur/me
router.get('/profil', authenticate, authorizeRole(['professeur']), professeurProfilController.getMyProfile);

// PUT : Mettre à jour le profil du professeur connecté
// URL: /api/professeur/me
router.put('/profil', authenticate, authorizeRole(['professeur']), professeurProfilController.updateMyProfile);

// GET : Récupérer la liste des élèves pour le professeur connecté
// URL: /api/professeur/students
router.get('/mes-eleves', authenticate, authorizeRole(['professeur']), professeurProfilController.getMyStudents);

// POST : Enregistrer une note pour un élève
// URL: /api/professeur/grade
router.post('/note', authenticate, authorizeRole(['professeur']), professeurProfilController.gradeStudent);

module.exports = router;