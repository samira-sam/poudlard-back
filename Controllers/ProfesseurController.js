/*const ProfesseurService = require("../Services/ProfesseurService");

class ProfesseurController {
  async getAllProfesseurs(req, res) {
    try {
      const professeurs = await ProfesseurService.getAllProfesseurs();
      res.json(professeurs);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la récupération des professeurs." });
       console.error("Erreur détaillée lors de la récupération des professeurs:", error);
      res.status(500).json({ error: "Erreur lors de la récupération des professeurs." });
    }
  }

  async getProfesseurById(req, res) {
    try {
      const professeur = await ProfesseurService.getProfesseurById(req.params.id);
      if (!professeur) return res.status(404).json({ error: "Professeur non trouvé." });
      res.json(professeur);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la récupération du professeur." });
    }
  }
async  addProfesseur (req, res)  {
  try {
    const newProf = await ProfesseurService.addProfesseur({
      id_professeur: req.body.id_professeur,
      id_matiere: req.body.id_matiere,
      id_maison_directeur: req.body.id_maison_directeur,
      fonction: req.body.fonction, // facultatif
    });

    res.status(201).json(newProf);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l’ajout du professeur', error });
  }
};

  async addProfesseur(req, res) {
    try {
      const professeur = await ProfesseurService.addProfesseur(req.body);
      res.status(201).json(professeur);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de l'ajout du professeur." });
    }
  }

  async updateProfesseur(req, res) {
    try {
      const professeur = await ProfesseurService.updateProfesseur(req.params.id, req.body);
      if (!professeur) return res.status(404).json({ error: "Professeur non trouvé." });
      res.json(professeur);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la mise à jour du professeur." });
    }
  }

  async deleteProfesseur(req, res) {
    try {
      const professeur = await ProfesseurService.deleteProfesseur(req.params.id);
      if (!professeur) return res.status(404).json({ error: "Professeur non trouvé." });
      res.json({ message: "Professeur supprimé avec succès." });
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la suppression du professeur." });
    }
  }
}
module.exports = new ProfesseurController();*/



const ProfesseurService = require("../Services/ProfesseurService");

class ProfesseurController {
  async getAllProfesseurs(req, res) {
    try {
      const professeurs = await ProfesseurService.getAllProfesseurs();
      res.json(professeurs);
    } catch (error) {
      console.error("Erreur dans getAllProfesseurs:", error);
      res.status(500).json({ error: "Erreur lors de la récupération des professeurs." });
    }
  }

  async getProfesseurById(req, res) {
    try {
      const professeur = await ProfesseurService.getProfesseurById(req.params.id);
      if (!professeur) return res.status(404).json({ error: "Professeur non trouvé." });
      res.json(professeur);
    } catch (error) {
      console.error("Erreur dans getProfesseurById:", error);
      res.status(500).json({ error: "Erreur lors de la récupération du professeur." });
    }
  }

  async addProfesseur(req, res) {
    try {
      const professeur = await ProfesseurService.addProfesseur(req.body);
      res.status(201).json(professeur);
    } catch (error) {
      console.error("Erreur dans addProfesseur:", error);
      res.status(500).json({ error: "Erreur lors de l'ajout du professeur." });
    }
  }

  async updateProfesseur(req, res) {
    try {
      const professeur = await ProfesseurService.updateProfesseur(req.params.id, req.body);
      if (!professeur) return res.status(404).json({ error: "Professeur non trouvé." });
      res.json(professeur);
    } catch (error) {
      console.error("Erreur dans updateProfesseur:", error);
      res.status(500).json({ error: "Erreur lors de la mise à jour du professeur." });
    }
  }

  async deleteProfesseur(req, res) {
    try {
      const professeur = await ProfesseurService.deleteProfesseur(req.params.id);
      if (!professeur) return res.status(404).json({ error: "Professeur non trouvé." });
      res.json({ message: "Professeur supprimé avec succès." });
    } catch (error) {
      console.error("Erreur dans deleteProfesseur:", error);
      res.status(500).json({ error: "Erreur lors de la suppression du professeur." });
    }
  }
}

module.exports = new ProfesseurController();

