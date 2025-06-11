const VacancesService = require('../Services/VacancesService');

class VacancesController {
  async getAllVacances(req, res) {
    try {
      const Vacances = await VacancesService.getAllVacances();
      res.json(Vacances);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la récupération des Vacancess" });
    }
  }

  async getVacancesById(req, res) {
    try {
      const Vacances = await VacancesService.getVacancesById(req.params.id);
      if (!Vacances) return res.status(404).json({ error: "Vacances non trouvée" });
      res.json(Vacances);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la récupération de la Vacances" });
    }
  }

  async addVacances(req, res) {
    try {
      const Vacances = await VacancesService.addVacances(req.body);
      res.status(201).json(Vacances);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de l'ajout de la Vacances" });
    }
  }

  async updateVacances(req, res) {
    try {
      const Vacances = await VacancesService.updateVacances(req.params.id, req.body);
      if (!Vacances) return res.status(404).json({ error: "Vacances non trouvée" });
      res.json(Vacances);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la mise à jour de la Vacances" });
    }
  }

  async deleteVacances(req, res) {
    try {
      const Vacances = await VacancesService.deleteVacances(req.params.id);
      if (!Vacances) return res.status(404).json({ error: "Vacances non trouvée" });
      res.json({ message: "Vacances supprimée avec succès" });
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la suppression de la Vacances" });
    }
  }
}

module.exports = new VacancesController();
