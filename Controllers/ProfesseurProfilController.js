// backend/controllers/professeurProfil.controller.js
const professeurProfilService = require('../Services/ProfesseurProfilService'); // Assure-toi que le chemin est correct

const professeurProfilController = {

    /**
     * Récupère le profil du professeur connecté.
     * Accessible via GET /api/professeur/me
     * Nécessite une authentification et le rôle 'professeur'.
     */
    async getMyProfile(req, res) {
        try {
            // L'ID de l'utilisateur est récupéré du token d'authentification par le middleware.
            const userId = req.user.id; // Assurez-vous que votre middleware d'authentification attache l'ID de l'utilisateur à req.user.id

            const profil = await professeurProfilService.getProfesseurProfile(userId);
            if (!profil) {
                return res.status(404).json({
                    message: 'Profil professeur non trouvé.'
                });
            }
            res.status(200).json(profil);
        } catch (error) {
            console.error('Erreur dans getMyProfile (ProfesseurProfilController) :', error);
            res.status(500).json({
                message: 'Erreur serveur lors de la récupération du profil professeur.',
                error: error.message
            });
        }
    },

    /**
     * Récupère la liste des élèves du professeur connecté.
     * Accessible via GET /api/professeur/students
     * Nécessite une authentification et le rôle 'professeur'.
     */
    async getMyStudents(req, res) {
        try {
            const professeurId = req.user.id; // L'ID du professeur est l'ID de l'utilisateur connecté

            const students = await professeurProfilService.getStudentsForProfesseur(professeurId);
            res.status(200).json(students);
        } catch (error) {
            console.error('Erreur dans getMyStudents (ProfesseurProfilController) :', error);
            res.status(500).json({
                message: 'Erreur serveur lors de la récupération des élèves.',
                error: error.message
            });
        }
    },

    /**
     * Enregistre une note pour un élève par le professeur connecté.
     * Accessible via POST /api/professeur/grade
     * Nécessite une authentification et le rôle 'professeur'.
     * Corps de la requête attendu : { eleveId, matiereId, valeur, commentaire }
     */
    async gradeStudent(req, res) {
        try {
            const professeurId = req.user.id; // L'ID du professeur est l'ID de l'utilisateur connecté
            const {
                eleveId,
                matiereId,
                valeur,
                commentaire
            } = req.body;

            // Simple validation de base des entrées
            if (!eleveId || !matiereId || valeur === undefined || valeur === null) {
                return res.status(400).json({
                    message: 'Les champs eleveId, matiereId et valeur sont obligatoires.'
                });
            }

            const newNote = await professeurProfilService.gradeStudent(professeurId, eleveId, matiereId, valeur, commentaire);
            res.status(201).json({
                message: 'Note enregistrée avec succès.',
                note: newNote
            });
        } catch (error) {
            console.error('Erreur dans gradeStudent (ProfesseurProfilController) :', error);
            // Gérer les erreurs spécifiques du service (ex: non autorisé)
            if (error.message.includes('Professeur non autorisé') || error.message.includes("L'élève n'est pas inscrit")) {
                return res.status(403).json({
                    message: error.message
                });
            }
            res.status(500).json({
                message: 'Erreur serveur lors de l\'enregistrement de la note.',
                error: error.message
            });
        }
    },

    /**
     * Met à jour le profil du professeur connecté.
     * Accessible via PUT /api/professeur/me
     * Nécessite une authentification et le rôle 'professeur'.
     * Corps de la requête attendu : { nom, prenom, email, photo, description, fonction }
     */
    async updateMyProfile(req, res) {
        try {
            const userId = req.user.id; // L'ID de l'utilisateur est récupéré du token d'authentification
            const updateData = req.body;

            const updatedProfil = await professeurProfilService.updateProfesseurProfile(userId, updateData);
            res.status(200).json({
                message: 'Profil professeur mis à jour avec succès.',
                profil: updatedProfil
            });
        } catch (error) {
            console.error('Erreur dans updateMyProfile (ProfesseurProfilController) :', error);
            res.status(500).json({
                message: 'Erreur serveur lors de la mise à jour du profil professeur.',
                error: error.message
            });
        }
    }
};

module.exports = professeurProfilController;