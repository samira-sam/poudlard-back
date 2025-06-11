const AnneeEtudeMatiere = require("../Models/AnneeEtudeMatiere");
const AnneeEtude = require("../Models/AnneeEtude");
const Matiere = require("../Models/Matiere");

class AnneeEtudeMatiereService {
  
  
    async getAllAnneeEtudeMatiere() {
      return await AnneeEtudeMatiere.findAll();
    }
  
  async ajouterAnneeEtudeMatiere(id_annee_etude, id_matiere) {
    console.log(`[Service] Tentative d'association de l'année d'étude ID ${id_annee_etude} à la matière ID ${id_matiere}`);

    // 1. Vérifier si l'année d'étude et la matière existent
    const anneeEtudeExiste = await AnneeEtude.findByPk(id_annee_etude);
    if (!anneeEtudeExiste) {
      const message = `[Service] Erreur : Année d'étude avec l'ID ${id_annee_etude} non trouvée.`;
      console.error(message);
      throw new Error(message);
    }

    const matiereExiste = await Matiere.findByPk(id_matiere);
    if (!matiereExiste) {
      const message = `[Service] Erreur : Matière avec l'ID ${id_matiere} non trouvée.`;
      console.error(message);
      throw new Error(message);
    }

    // 2. Vérifier si l'association n'existe pas déjà (optionnel, mais recommandé)
    const associationExistante = await AnneeEtudeMatiere.findOne({
      where: {
        id_annee_etude,
        id_matiere,
      },
    });

    if (associationExistante) {
      const message = `[Service] Erreur : L'association entre l'année d'étude ID ${id_annee_etude} et la matière ID ${id_matiere} existe déjà.`;
      console.warn(message);
      throw new Error(message);
    }

    // 3. Créer l'association dans la table AnneeEtudeMatiere
    try {
      const nouvelleAssociation = await AnneeEtudeMatiere.create({
        id_annee_etude: id_annee_etude,
        id_matiere: id_matiere,
        // ajouter champs en fonction de la  table AnneeEtudeMatiere ex: un champ "professeur_principal_id"
      });
       console.log(`[Service] Année d'étude ID ${id_annee_etude} associée à la matière ID ${id_matiere} avec succès.`);
      return nouvelleAssociation;
    } catch (error) {
        const message = `[Service] Erreur lors de la création de l'association : ${error.message}`;
        console.error(message);
        throw new Error(message)
    }
  }
}

module.exports = new AnneeEtudeMatiereService();
