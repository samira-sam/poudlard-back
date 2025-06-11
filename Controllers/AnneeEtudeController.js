const AnneeEtudeService = require("../Services/AnneeEtudeService");

class AnneeEtudeController {
  async getAllAnneeEtudes(req, res) {
    try {
      const anneesEtude = await AnneeEtudeService.getAllAnneeEtudes();
      res.json(anneesEtude);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la récupération des années d'étude" });
    }
  }

  async getAnneeEtudeById(req, res) {
    try {
      const anneeEtude = await AnneeEtudeService.getAnneeEtudeById(req.params.id);
      if (!anneeEtude) return res.status(404).json({ error: "Année d'étude non trouvée" });
      res.json(anneeEtude);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la récupération de l'année d'étude" });
    }
  }

  async addAnneeEtude(req, res) {
    try {
      const anneeEtude = await AnneeEtudeService.addAnneeEtude(req.body);
      res.status(201).json(anneeEtude);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de l'ajout de l'année d'étude" });
    }
  }

  async updateAnneeEtude(req, res) {
    try {
      const anneeEtude = await AnneeEtudeService.updateAnneeEtude(req.params.id, req.body);
      if (!anneeEtude) return res.status(404).json({ error: "Année d'étude non trouvée" });
      res.json(anneeEtude);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la mise à jour de l'année d'étude" });
    }
  }

  async deleteAnneeEtude(req, res) {
    try {
      const anneeEtude = await AnneeEtudeService.deleteAnneeEtude(req.params.id);
      if (!anneeEtude) return res.status(404).json({ error: "Année d'étude non trouvée" });
      res.json({ message: "Année d'étude supprimée avec succès" });
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la suppression de l'année d'étude" });
    }
  }
}

module.exports = new AnneeEtudeController();
