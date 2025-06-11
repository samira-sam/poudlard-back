const UtilisateurService = require("../Services/UtilisateurService");

class UtilisateurController {
  async findUsersByRole(req, res) {
    const roleDemande = req.params.roleName;
    try {
      const utilisateurs = await UtilisateurService.getUtilisateursByRole(roleDemande);
      if (utilisateurs && utilisateurs.length > 0) {
        res.json(utilisateurs);
      } else {
        res.json([]);
      }
    } catch (error) {
      console.error("Erreur dans findUsersByRole:", error);
      res.status(500).json({ error: "Erreur lors de la recherche des utilisateurs par rôle." });
    }
  }

  async getAllUtilisateur(req, res) {
    try {
      const utilisateurs = await UtilisateurService.getAllUtilisateur();
      res.json(utilisateurs);
    } catch (error) {
      console.error("Erreur dans getAllUtilisateur:", error);
      res.status(500).json({ error: "Erreur lors de la récupération des utilisateurs" });
    }
  }

  async getUtilisateurById(req, res) {
    try {
      const utilisateur = await UtilisateurService.getUtilisateurById(req.params.id);
      if (!utilisateur) {
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }
      res.json(utilisateur);
    } catch (error) {
      console.error("Erreur dans getUtilisateurById:", error);
      res.status(500).json({ error: "Erreur lors de la récupération de l'utilisateur" });
    }
  }

  async addUtilisateur(req, res) {
    try {
      const utilisateur = await UtilisateurService.addUtilisateur(req.body);
      res.status(201).json(utilisateur);
    } catch (error) {
      console.error("Erreur dans addUtilisateur:", error);
      res.status(500).json({ error: "Erreur lors de l'ajout de l'utilisateur" });
    }
  }

  async updateUtilisateur(req, res) {
    try {
      const utilisateur = await UtilisateurService.updateUtilisateur(req.params.id, req.body);
      if (!utilisateur) {
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }
      res.json(utilisateur);
    } catch (error) {
      console.error("Erreur dans updateUtilisateur:", error);
      res.status(500).json({ error: "Erreur lors de la mise à jour de l'utilisateur" });
    }
  }

  async deleteUtilisateur(req, res) {
    try {
      const success = await UtilisateurService.deleteUtilisateur(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }
      res.json({ message: "Utilisateur supprimé avec succès" });
    } catch (error) {
      console.error("Erreur dans deleteUtilisateur:", error);
      res.status(500).json({ error: "Erreur lors de la suppression de l'utilisateur" });
    }
  }
}

module.exports = new UtilisateurController();
