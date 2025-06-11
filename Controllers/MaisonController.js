const MaisonService = require("../Services/MaisonService");

class MaisonController {
  async getAllMaisons(req, res) {
    try {
      const maisons = await MaisonService.getAllMaisons();
      res.json(maisons);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la récupération des maisons" });
    }
  }

  async getMaisonById(req, res) {
    try {
      const maison = await MaisonService.getMaisonById(req.params.id);
      if (!maison) return res.status(404).json({ error: "Maison non trouvée" });
      res.json(maison);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la récupération de la maison" });
    }
  }

  async addMaison(req, res) {
    try {
      const maison = await MaisonService.addMaison(req.body);
      res.status(201).json(maison);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de l'ajout de la maison" });
    }
  }

  async updateMaison(req, res) {
    try {
      const maison = await MaisonService.updateMaison(req.params.id, req.body);
      if (!maison) return res.status(404).json({ error: "Maison non trouvée" });
      res.json(maison);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la mise à jour de la maison" });
    }
  }

  async deleteMaison(req, res) {
    try {
      const maison = await MaisonService.deleteMaison(req.params.id);
      if (!maison) return res.status(404).json({ error: "Maison non trouvée" });
      res.json({ message: "Maison supprimée avec succès" });
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la suppression de la maison" });
    }
  }
}

module.exports = new MaisonController();
