const InfoLivraisonService = require("../Services/InfoLivraisonService");

class InfoLivraisonController {
  async getAllInfoLivraisons(req, res) {
    try {
      const InfoLivraisons = await InfoLivraisonService.getAllInfoLivraisons();
      res.json(InfoLivraisons);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la récupération des InfoLivraisons" });
    }
  }

  async getInfoLivraisonById(req, res) {
    try {
      const InfoLivraison = await InfoLivraisonService.getInfoLivraisonById(req.params.id);
      if (!InfoLivraison) return res.status(404).json({ error: "InfoLivraison non trouvée" });
      res.json(InfoLivraison);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la récupération de la InfoLivraison" });
    }
  }

  async addInfoLivraison(req, res) {
    try {
      const InfoLivraison = await InfoLivraisonService.addInfoLivraison(req.body);
      res.status(201).json(InfoLivraison);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de l'ajout de la InfoLivraison" });
    }
  }

  async updateInfoLivraison(req, res) {
    try {
      const InfoLivraison = await InfoLivraisonService.updateInfoLivraison(req.params.id, req.body);
      if (!InfoLivraison) return res.status(404).json({ error: "InfoLivraison non trouvée" });
      res.json(InfoLivraison);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la mise à jour de la InfoLivraison" });
    }
  }

  async deleteInfoLivraison(req, res) {
    try {
      const InfoLivraison = await InfoLivraisonService.deleteInfoLivraison(req.params.id);
      if (!InfoLivraison) return res.status(404).json({ error: "InfoLivraison non trouvée" });
      res.json({ message: "InfoLivraison supprimée avec succès" });
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la suppression de la InfoLivraison" });
    }
  }
}

module.exports = new InfoLivraisonController();

