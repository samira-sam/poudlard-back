const InscriptionService = require('../Services/EleveMatiereService'); // On va créer ce service

class InscriptionController {
  async inscrireEleveMatiere(req, res) {
    try {
      const { id_eleve, id_matiere } = req.body; // On récupère les IDs envoyés par l'admin

      // Petite vérification simple : est-ce que les IDs sont bien là ?
      if (!id_eleve || !id_matiere) {
        return res.status(400).json({ error: "L'ID de l'élève et l'ID de la matière sont obligatoires." });
      }

      // On appelle le service pour faire le travail
      const nouvelleInscription = await InscriptionService.inscrireEleveMatiere(id_eleve, id_matiere);

      res.status(201).json({ message: "Élève inscrit à la matière avec succès !", inscription: nouvelleInscription });
    } catch (error) {
      console.error("### ERREUR dans InscriptionController (inscrireEleveMatiere):", error);
      // Gérer les erreurs spécifiques si besoin (ex: élève ou matière non trouvé, inscription déjà existante)
      if (error.message.includes("déjà inscrit")) { // Exemple de gestion d'erreur personnalisée
         return res.status(409).json({ error: error.message }); // 409 Conflict
      }
      res.status(500).json({ error: "Oops ! Erreur lors de l'inscription de l'élève à la matière." });
    }
  }
}

module.exports = new InscriptionController();