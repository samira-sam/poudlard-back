// controllers/EleveProfilController.js

const EleveProfilService = require('../Services/EleveProfilService');

class EleveProfilController {
  async getProfil(req, res) {
    try {
      const id_utilisateur = req.user.id; // on suppose que le middleware d'auth fournit req.user

      const profil = await EleveProfilService.getProfilByUtilisateurId(id_utilisateur);

      if (!profil) {
        return res.status(404).json({ message: "Profil de l'élève introuvable." });
      }

      res.json(profil);
    } catch (error) {
      console.error("Erreur dans getProfil:", error);
      res.status(500).json({ message: "Erreur serveur lors de la récupération du profil." });
    }
  }
   // --- NOUVELLE MÉTHODE POUR LA MISE À JOUR DU PROFIL ---
  async updateProfil(req, res) {
    try {
      const id_utilisateur = req.user.id; // L'ID de l'utilisateur qui fait la requête (authentifié)
      const profilData = req.body; // Les données envoyées par le frontend pour la mise à jour

      if (!profilData || Object.keys(profilData).length === 0) {
        return res.status(400).json({ message: "Aucune donnée de profil fournie pour la mise à jour." });
      }

      const updatedProfil = await EleveProfilService.updateProfil(id_utilisateur, profilData);

      if (!updatedProfil) {
        // Cela ne devrait pas arriver si EleveProfilService gère bien les erreurs,
        // mais c'est une sécurité.
        return res.status(404).json({ message: "Profil de l'élève introuvable ou échec de la mise à jour." });
      }

      res.json({ message: "Profil mis à jour avec succès !", profil: updatedProfil });

    } catch (error) {
      console.error("Erreur dans updateProfil:", error);
      if (error.message.includes("introuvable")) { // Vérifie si l'erreur vient du service
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: "Erreur serveur lors de la mise à jour du profil." });
    }
  }
}

module.exports = new EleveProfilController();
