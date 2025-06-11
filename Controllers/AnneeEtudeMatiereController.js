const AnneeEtudeMatiereService = require('../Services/AnneeEtudeMatiereService');

class AnneeEtudeMatiereController {
   async getAllAnneeEtudeMatiere(req, res) {
      try {
        const AnneeEtudeMatiere = await AnneeEtudeMatiereService.getAllAnneeEtudeMatiere();
        res.json(AnneeEtudeMatiere);
      } catch (error) {
        res.status(500).json({ error: "Erreur lors de la récupération des AnneeEtudeMatiere" });
      }
    }

  async ajouterAnneeEtudeMatiere(req, res) {
    const { id_annee_etude, id_matiere } = req.body; // Récupère les IDs depuis le corps de la requête

    try {
      const resultat = await AnneeEtudeMatiereService.ajouterAnneeEtudeMatiere(id_annee_etude, id_matiere);
      res.status(201).json(resultat); // Envoie une réponse avec le résultat
    } catch (error) {
      res.status(400).json({ message: error.message }); // Envoie une réponse d'erreur
    }
  }
}

module.exports = new AnneeEtudeMatiereController();