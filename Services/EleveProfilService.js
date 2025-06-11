/*

const Utilisateur = require('../Models/Utilisateur');
const Eleve = require('../Models/Eleve');
const AnneeEtude = require('../Models/AnneeEtude');
const Maison = require('../Models/Maison');
const Matiere = require('../Models/Matiere');
const Note = require('../Models/Note');
const Professeur = require('../Models/Professeur');
const { Op } = require('sequelize'); // Importez Op si vous l'utilisez pour des requêtes complexes, sinon vous pouvez l'enlever

class EleveProfilService {
  async getProfilByUtilisateurId(id_utilisateur) {
    // 1. Récupération de l'élève avec toutes ses relations directes
    const eleve = await Eleve.findOne({
      where: { id_eleve: id_utilisateur },
      include: [
        {
          model: Utilisateur,
          as: 'utilisateur',
          attributes: ['nom', 'prenom', 'photo', 'email', 'id_role'],
        },
        {
          model: AnneeEtude,
          as: 'anneeEtude',
          attributes: ['nom'],
        },
        {
          model: Maison,
          as: 'maison',
          attributes: ['nom'],
        },
        {
          model: Matiere,
          as: 'matieresSuivies', // Alias pour la relation Eleve.belongsToMany(Matiere)
          attributes: ['id_matiere', 'nom', 'description'],
          through: { attributes: [] }
        },
      ],
    });

    if (!eleve) {
      console.log(`Aucun élève trouvé pour l'ID utilisateur ${id_utilisateur}.`);
      return null;
    }

    // 2. Récupération des notes spécifiques à cet élève
    const notes = await Note.findAll({
      where: { id_eleve: eleve.id_eleve },
      include: [
        {
          model: Professeur,
          as: 'professeurEvaluateur',
          attributes: ['id_professeur', 'fonction'],
          include: [
            {
              model: Matiere,
              as: 'matiereEnseignee',
              attributes: ['id_matiere', 'nom'],
            },
            {
              model: Utilisateur,
              as: 'utilisateur',
              attributes: ['nom', 'prenom'],
            },
          ],
        },
      ],
    });

    // 3. Traitement et regroupement des données
    const matieresDetails = {};

    // Initialise les matières avec celles que l'élève est censé suivre (même sans note)
    for (const matiereSuivie of eleve.matieresSuivies) {
      matieresDetails[matiereSuivie.id_matiere] = {
        id_matiere: matiereSuivie.id_matiere,
        libelle: matiereSuivie.nom,
        professeur: 'Non assigné', // Valeur par défaut
        notes_individuelles: [], // Stockera les objets { valeur, date, commentaire }
        commentaires_globaux: [], // Stockera les commentaires s'ils ne sont pas liés à une note spécifique
      };
    }

    // Ajoute les notes et commentaires aux matières existantes
    for (const note of notes) {
      const professeur = note.professeurEvaluateur;
      const matiereEnseigneeParProf = professeur?.matiereEnseignee;

      if (!professeur || !matiereEnseigneeParProf) {
        console.warn(`Note #${note.id_note} sans professeur ou matière enseignée associée.`);
        continue;
      }

      const idMatiere = matiereEnseigneeParProf.id_matiere;

      // Si la matière n'était pas dans les 'matieresSuivies', l'ajouter (cas rare si les données sont cohérentes)
      if (!matieresDetails[idMatiere]) {
        matieresDetails[idMatiere] = {
          id_matiere: idMatiere,
          libelle: matiereEnseigneeParProf.nom,
          professeur: 'Non assigné',
          notes_individuelles: [],
          commentaires_globaux: [],
        };
      }

      // Met à jour le nom du professeur (le dernier prof qui a mis une note sera retenu, ou le premier)
      matieresDetails[idMatiere].professeur = `${professeur.utilisateur.prenom} ${professeur.utilisateur.nom}`;

      // Ajoute la note individuelle complète (valeur, date, commentaire)
      matieresDetails[idMatiere].notes_individuelles.push({
        valeur: parseFloat(note.valeur),
        date: note.date_note,
        commentaire: note.commentaire,
      });
    }

    // 4. Calcul de la moyenne et formatage final
    const resumeMatieres = Object.values(matieresDetails).map((m) => {
      const sumNotes = m.notes_individuelles.reduce((sum, currentNote) => sum + currentNote.valeur, 0);
      const moyenne = m.notes_individuelles.length > 0 ? (sumNotes / m.notes_individuelles.length).toFixed(2) : 'N/A';

      return {
        id_matiere: m.id_matiere,
        libelle: m.libelle,
        professeur: m.professeur,
        moyenne: moyenne,
        notes_individuelles: m.notes_individuelles,
        commentaires: m.commentaires_globaux,
      };
    });

    // 5. Retourne le profil complet
    return {
      nom: eleve.utilisateur.nom,
      prenom: eleve.utilisateur.prenom,
      photo: eleve.utilisateur.photo,
      contact_parent: eleve.contact_parent,
      annee: eleve.anneeEtude?.nom,
      maison: eleve.maison?.nom,
      matieres: resumeMatieres,
    };
  }

  // --- NOUVELLE MÉTHODE POUR LA MISE À JOUR DU PROFIL ---
  async updateProfil(id_utilisateur, profilData) {
    // Commence une transaction pour assurer la cohérence si les mises à jour échouent
    // (Requires sequelize.transaction, if you set it up. For simplicity, omitting for now,
    // but recommended for production.)

    try {
      // 1. Récupérer l'élève et son utilisateur associé
      const eleve = await Eleve.findOne({
        where: { id_eleve: id_utilisateur },
        include: [{
          model: Utilisateur,
          as: 'utilisateur',
          attributes: ['id_utilisateur', 'nom', 'prenom', 'photo']
        }]
      });

      if (!eleve) {
        throw new Error("Profil de l'élève introuvable.");
      }
      if (!eleve.utilisateur) {
        throw new Error("Utilisateur associé à l'élève introuvable.");
      }

      // 2. Mettre à jour les champs de l'utilisateur (nom, prenom, photo)
      const updatedUtilisateurData = {};
      if (profilData.nom !== undefined) {
        updatedUtilisateurData.nom = profilData.nom;
      }
      if (profilData.prenom !== undefined) {
        updatedUtilisateurData.prenom = profilData.prenom;
      }
      // Note: Pour la photo, cela dépend si vous gérez des uploads de fichiers.
      // Si c'est juste un chemin d'URL, vous pouvez le passer directement.
      if (profilData.photo !== undefined) {
        updatedUtilisateurData.photo = profilData.photo;
      }

      if (Object.keys(updatedUtilisateurData).length > 0) {
        await eleve.utilisateur.update(updatedUtilisateurData);
      }

      // 3. Mettre à jour les champs de l'élève (contact_parent)
      const updatedEleveData = {};
      if (profilData.contact_parent !== undefined) {
        updatedEleveData.contact_parent = profilData.contact_parent;
      }

      if (Object.keys(updatedEleveData).length > 0) {
        await eleve.update(updatedEleveData);
      }

      // 4. Récupérer et retourner le profil mis à jour
      // Nous réutilisons la logique existante pour récupérer le profil complet
      const updatedProfil = await this.getProfilByUtilisateurId(id_utilisateur);
      return updatedProfil;

    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil de l'élève:", error);
      throw error; // Rejeter l'erreur pour qu'elle soit gérée par le contrôleur
    }
  }
}

module.exports = new EleveProfilService();*/

const Utilisateur = require('../Models/Utilisateur');
const Eleve = require('../Models/Eleve');
const AnneeEtude = require('../Models/AnneeEtude');
const Maison = require('../Models/Maison');
const Matiere = require('../Models/Matiere');
const Note = require('../Models/Note');
const Professeur = require('../Models/Professeur');
const { Op } = require('sequelize'); // Importez Op si vous l'utilisez pour des requêtes complexes, sinon vous pouvez l'enlever

class EleveProfilService {
  async getProfilByUtilisateurId(id_utilisateur) {
    // 1. Récupération de l'élève avec toutes ses relations directes
    const eleve = await Eleve.findOne({
      where: { id_eleve: id_utilisateur },
      include: [
        {
          model: Utilisateur,
          as: 'utilisateur',
          attributes: ['nom', 'prenom', 'photo', 'email', 'id_role'],
        },
        {
          model: AnneeEtude,
          as: 'anneeEtude',
          attributes: ['nom'],
        },
        {
          model: Maison,
          as: 'maison',
          attributes: ['nom'],
        },
        {
          model: Matiere,
          as: 'matieresSuivies', // Alias pour la relation Eleve.belongsToMany(Matiere)
          attributes: ['id_matiere', 'nom', 'description'],
          through: { attributes: [] }
        },
      ],
    });

    if (!eleve) {
      console.log(`Aucun élève trouvé pour l'ID utilisateur ${id_utilisateur}.`);
      return null;
    }

    // 2. Récupération des notes spécifiques à cet élève
    const notes = await Note.findAll({
      where: { id_eleve: eleve.id_eleve },
      include: [
        {
          model: Professeur,
          as: 'professeurEvaluateur',
          attributes: ['id_professeur', 'fonction'],
          include: [
            {
              model: Matiere,
              as: 'matiereEnseignee',
              attributes: ['id_matiere', 'nom'],
            },
            {
              model: Utilisateur,
              as: 'utilisateur',
              attributes: ['nom', 'prenom'],
            },
          ],
        },
      ],
    });

    // 3. Traitement et regroupement des données
    const matieresDetails = {};

    // Initialise les matières avec celles que l'élève est censé suivre (même sans note)
    for (const matiereSuivie of eleve.matieresSuivies) {
      matieresDetails[matiereSuivie.id_matiere] = {
        id_matiere: matiereSuivie.id_matiere,
        libelle: matiereSuivie.nom,
        professeur: 'Non assigné', // Valeur par défaut
        notes_individuelles: [], // Stockera les objets { valeur, date, commentaire }
        commentaires_globaux: [], // Stockera les commentaires s'ils ne sont pas liés à une note spécifique
      };
    }

    // Ajoute les notes et commentaires aux matières existantes
    for (const note of notes) {
      const professeur = note.professeurEvaluateur;
      const matiereEnseigneeParProf = professeur?.matiereEnseignee;

      if (!professeur || !matiereEnseigneeParProf) {
        console.warn(`Note #${note.id_note} sans professeur ou matière enseignée associée.`);
        continue;
      }

      const idMatiere = matiereEnseigneeParProf.id_matiere;

      // Si la matière n'était pas dans les 'matieresSuivies', l'ajouter (cas rare si les données sont cohérentes)
      if (!matieresDetails[idMatiere]) {
        matieresDetails[idMatiere] = {
          id_matiere: idMatiere,
          libelle: matiereEnseigneeParProf.nom,
          professeur: 'Non assigné',
          notes_individuelles: [],
          commentaires_globaux: [],
        };
      }

      // Met à jour le nom du professeur (le dernier prof qui a mis une note sera retenu, ou le premier)
      matieresDetails[idMatiere].professeur = `${professeur.utilisateur.prenom} ${professeur.utilisateur.nom}`;

      // Ajoute la note individuelle complète (valeur, date, commentaire)
      matieresDetails[idMatiere].notes_individuelles.push({
        valeur: parseFloat(note.valeur),
        date: note.date_note,
        commentaire: note.commentaire,
      });
    }

    // 4. Calcul des moyennes par matière et formatage
    let totalMoyennesValides = 0;
    let nombreMatieresAvecMoyenne = 0;

    const resumeMatieres = Object.values(matieresDetails).map((m) => {
      const sumNotes = m.notes_individuelles.reduce((sum, currentNote) => sum + currentNote.valeur, 0);
      const moyenne = m.notes_individuelles.length > 0 ? (sumNotes / m.notes_individuelles.length) : null; // Garder en nombre ou null

      if (moyenne !== null) {
        totalMoyennesValides += moyenne;
        nombreMatieresAvecMoyenne++;
      }

      return {
        id_matiere: m.id_matiere,
        libelle: m.libelle,
        professeur: m.professeur,
        moyenne: moyenne !== null ? moyenne.toFixed(2) : 'N/A', // Formatage pour l'affichage
        notes_individuelles: m.notes_individuelles,
        commentaires: m.commentaires_globaux,
      };
    });

    // ⭐ Calcul de la moyenne générale ⭐
    const moyenneGenerale = nombreMatieresAvecMoyenne > 0
      ? (totalMoyennesValides / nombreMatieresAvecMoyenne).toFixed(2)
      : 'N/A';


    // 5. Retourne le profil complet avec la moyenne générale
    return {
      nom: eleve.utilisateur.nom,
      prenom: eleve.utilisateur.prenom,
      photo: eleve.utilisateur.photo,
      contact_parent: eleve.contact_parent,
      annee: eleve.anneeEtude?.nom,
      maison: eleve.maison?.nom,
      matieres: resumeMatieres,
      moyenne_generale: moyenneGenerale, // Ajout de la moyenne générale
    };
  }

  // --- NOUVELLE MÉTHODE POUR LA MISE À JOUR DU PROFIL ---
  async updateProfil(id_utilisateur, profilData) {
    try {
      const eleve = await Eleve.findOne({
        where: { id_eleve: id_utilisateur },
        include: [{
          model: Utilisateur,
          as: 'utilisateur',
          attributes: ['id_utilisateur', 'nom', 'prenom', 'photo']
        }]
      });

      if (!eleve) {
        throw new Error("Profil de l'élève introuvable.");
      }
      if (!eleve.utilisateur) {
        throw new Error("Utilisateur associé à l'élève introuvable.");
      }

      const updatedUtilisateurData = {};
      if (profilData.nom !== undefined) {
        updatedUtilisateurData.nom = profilData.nom;
      }
      if (profilData.prenom !== undefined) {
        updatedUtilisateurData.prenom = profilData.prenom;
      }
      if (profilData.photo !== undefined) {
        updatedUtilisateurData.photo = profilData.photo;
      }

      if (Object.keys(updatedUtilisateurData).length > 0) {
        await eleve.utilisateur.update(updatedUtilisateurData);
      }

      const updatedEleveData = {};
      if (profilData.contact_parent !== undefined) {
        updatedEleveData.contact_parent = profilData.contact_parent;
      }

      if (Object.keys(updatedEleveData).length > 0) {
        await eleve.update(updatedEleveData);
      }

      const updatedProfil = await this.getProfilByUtilisateurId(id_utilisateur);
      return updatedProfil;

    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil de l'élève:", error);
      throw error;
    }
  }
}

module.exports = new EleveProfilService();