const BdcService = require("../Services/BdcService");

class BdcController {
  async getAllBdcs(req, res) {
    try {
      const Bdc = await BdcService.getAllBdcs();
      res.json(Bdc);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la récupération des Bdcs" });
    }
  }

  async getBdcById(req, res) {
    try {
      const Bdc = await BdcService.getBdcById(req.params.id);
      if (!Bdc) return res.status(404).json({ error: "Bdc non trouvée" });
      res.json(Bdc);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la récupération de la Bdc" });
    }
  }

  async addBdc(req, res) {
    try {
      const Bdc = await BdcService.addBdc(req.body);
      res.status(201).json(Bdc);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de l'ajout de la Bdc" });
    }
  }

  async updateBdc(req, res) {
    try {
      const Bdc = await BdcService.updateBdc(req.params.id, req.body);
      if (!Bdc) return res.status(404).json({ error: "Bdc non trouvée" });
      res.json(Bdc);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la mise à jour de la Bdc" });
    }
  }

  async deleteBdc(req, res) {
    try {
      const Bdc = await BdcService.deleteBdc(req.params.id);
      if (!Bdc) return res.status(404).json({ error: "Bdc non trouvée" });
      res.json({ message: "Bdc supprimée avec succès" });
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la suppression de la Bdc" });
    }
  }
}

module.exports = new BdcController();

