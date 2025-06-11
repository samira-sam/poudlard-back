
 const EleveMatiere = require("../Models/EleveMatiere");
 const Eleve = require("../Models/Eleve");
 const Matiere = require("../Models/Matiere");

class InscriptionService {
  async inscrireEleveMatiere(idEleve, idMatiere) {
    console.log(`  [Service] Tentative d'inscription de l'élève ID: ${idEleve} à la matière ID: ${idMatiere}`);

    // Optionnel mais bien : Vérifier si l'élève et la matière existent vraiment
    const eleveExiste = await Eleve.findByPk(idEleve);
    if (!eleveExiste) {
      console.warn(`  [Service] Échec : Élève avec ID ${idEleve} non trouvé.`);
      throw new Error(`Élève avec l'ID ${idEleve} non trouvé.`);
    }

    const matiereExiste = await Matiere.findByPk(idMatiere);
    if (!matiereExiste) {
      console.warn(`  [Service] Échec : Matière avec ID ${idMatiere} non trouvée.`);
      throw new Error(`Matière avec l'ID ${idMatiere} non trouvée.`);
    }

    // Optionnel mais bien : Vérifier si l'élève n'est pas déjà inscrit à cette matière
    const inscriptionExistante = await EleveMatiere.findOne({
      where: {
        id_eleve: idEleve,
        id_matiere: idMatiere
      }
    });

    if (inscriptionExistante) {
      console.warn(`  [Service] Attention : L'élève ID ${idEleve} est déjà inscrit à la matière ID ${idMatiere}.`);
      throw new Error(`Cet élève est déjà inscrit à cette matière.`);
    }

    // Si tout va bien, on crée l'entrée dans la table de jonction EleveMatiere
    const nouvelleInscription = await EleveMatiere.create({
      id_eleve: idEleve,
      id_matiere: idMatiere
      // Si ta table EleveMatiere a d'autres champs (ex: date_inscription), tu les ajouterais ici
    });

    console.log(`  [Service] Succès : Élève ID: ${idEleve} inscrit à la matière ID: ${idMatiere}.`);
    return nouvelleInscription;
  }
}

module.exports = new InscriptionService();