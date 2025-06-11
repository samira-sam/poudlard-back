const MatiereService = require("../Services/MatiereService");

class MatiereController {
  async getAllMatiere(req, res) { // Le nom de la fonction peut varier
    console.log("--- Fonction getAllMatiere appelée ---"); // Pour vérifier l'appel
    try {
      // Ligne qui appelle le service pour chercher les matières
      const matieres = await MatiereService.getAllMatiere(); 
       res.json(matieres);

    } catch (error) { // Si une erreur se produit dans le 'try'
      // AJOUTE CETTE LIGNE POUR VOIR L'ERREUR DÉTAILLÉE :
      console.log("### ERREUR DÉTAILLÉE lors de la récupération des matières:", error); 
      res.status(500).json({ error: "Erreur lors de la récupération des matières" });
    }
  }

  async getMatiereById(req, res) {
    try {
      const matiere = await MatiereService.getMatiereById(req.params.id);
      if (!matiere) {
        return res.status(404).json({ error: "Matière non trouvée" });
      }
      res.json(matiere);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la récupération de la matière" });
    }
  }

  async addMatiere(req, res) {
    try {
      const matiere = await MatiereService.addMatiere(req.body);
      res.status(201).json(matiere);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de l'ajout de la matière" });
    }
  }

  async updateMatiere(req, res) {
    try {
      const matiere = await MatiereService.updateMatiere(req.params.id, req.body);
      if (!matiere) {
        return res.status(404).json({ error: "Matière non trouvée" });
      }
      res.json(matiere);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la mise à jour de la matière" });
    }
  }

  async deleteMatiere(req, res) {
    try {
      const matiere = await MatiereService.deleteMatiere(req.params.id);
      if (!matiere) {
        return res.status(404).json({ error: "Matière non trouvée" });
      }
      res.json({ message: "Matière supprimée avec succès" });
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la suppression de la matière" });
    }
  }
}

module.exports = new MatiereController();
