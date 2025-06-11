const ConcoursService = require("../Services/ConcoursService");

class ConcoursController {

   async getConcoursByAnnee(req, res) {
    try {
      const idAnnee = parseInt(req.params.idAnnee, 10);
      if (isNaN(idAnnee)) {
        return res.status(400).json({ message: "L'id de l'année doit être un nombre valide." });
      }

      const concours = await ConcoursService.getConcoursByAnnee(idAnnee);
      if (!concours || concours.length === 0) {
        return res.status(404).json({ message: `Aucun concours trouvé pour l'année ${idAnnee}` });
      }

      return res.status(200).json(concours);
    } catch (error) {
      console.error("Erreur dans getConcoursByAnnee:", error);
      return res.status(500).json({ message: "Erreur serveur" });
    }
  }
  async getAllConcours(req, res) {
    try {
      const Concours = await ConcoursService.getAllConcours();
      res.json(Concours);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la récupération des Concourss" });
    }
  }

  async getConcoursById(req, res) {
    try {
      const Concours = await ConcoursService.getConcoursById(req.params.id);
      if (!Concours) return res.status(404).json({ error: "Concours non trouvée" });
      res.json(Concours);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la récupération de la Concours" });
    }
  }

  async addConcours(req, res) {
    try {
      const Concours = await ConcoursService.addConcours(req.body);
      res.status(201).json(Concours);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de l'ajout de la Concours" });
    }
  }

  async updateConcours(req, res) {
    try {
      const Concours = await ConcoursService.updateConcours(req.params.id, req.body);
      if (!Concours) return res.status(404).json({ error: "Concours non trouvée" });
      res.json(Concours);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la mise à jour de la Concours" });
    }
  }

  async deleteConcours(req, res) {
    try {
      const Concours = await ConcoursService.deleteConcours(req.params.id);
      if (!Concours) return res.status(404).json({ error: "Concours non trouvée" });
      res.json({ message: "Concours supprimée avec succès" });
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la suppression de la Concours" });
    }
  }
}

module.exports = new ConcoursController();


