const BuseService = require("../Services/BuseService");

class BuseController {

  async getAllBuse(req, res) {
    try {
      const Buse = await BuseService.getAllBuse();
      res.json(Buse);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la récupération des Buses" });
    }
  }

 
  async getLatestBuse(req, res) {
    try {
      const latestBuse = await BuseService.getLatestBuse();
      if (!latestBuse) {
        return res.status(404).json({ message: "Aucune buse à venir trouvée." });
      }
      res.json(latestBuse);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getBuseById(req, res) {
    try {
      const Buse = await BuseService.getBuseById(req.params.id);
      if (!Buse) return res.status(404).json({ error: "Buse non trouvée" });
      res.json(Buse);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la récupération de la Buse" });
    }
  }

  async addBuse(req, res) {
    try {
      const Buse = await BuseService.addBuse(req.body);
      res.status(201).json(Buse);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de l'ajout de la Buse" });
    }
  }

  async updateBuse(req, res) {
    try {
      const Buse = await BuseService.updateBuse(req.params.id, req.body);
      if (!Buse) return res.status(404).json({ error: "Buse non trouvée" });
      res.json(Buse);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la mise à jour de la Buse" });
    }
  }

  async deleteBuse(req, res) {
    try {
      const Buse = await BuseService.deleteBuse(req.params.id);
      if (!Buse) return res.status(404).json({ error: "Buse non trouvée" });
      res.json({ message: "Buse supprimée avec succès" });
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la suppression de la Buse" });
    }
  }
}

module.exports = new BuseController();

