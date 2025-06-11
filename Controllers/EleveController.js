/*const EleveService = require("../Services/EleveService");

class EleveController {
  async getAllEleves(req, res) {
    try {
      const eleves = await EleveService.getAllEleves();
      res.json(eleves);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Erreur lors de la récupération des élèves" });
    }
  }

  async getEleveById(req, res) {
    try {
      const eleve = await EleveService.getEleveById(req.params.id);
      if (!eleve) {
        return res.status(404).json({ error: "Élève non trouvé" });
      }
      res.json(eleve);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la récupération de l'élève" });
    }
  }

  async addEleve(req, res) {
    try {
      const eleve = await EleveService.addEleve(req.body);
      res.status(201).json(eleve);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de l'ajout de l'élève" });
    }
  }

  async updateEleve(req, res) {
    try {
      const eleve = await EleveService.updateEleve(req.params.id, req.body);
      if (!eleve) {
        return res.status(404).json({ error: "Élève non trouvé" });
      }
      res.json(eleve);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la mise à jour de l'élève" });
    }
  }

  async deleteEleve(req, res) {
    try {
      const eleve = await EleveService.deleteEleve(req.params.id);
      if (!eleve) {
        return res.status(404).json({ error: "Élève non trouvé" });
      }
      res.json({ message: "Élève supprimé avec succès" });
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la suppression de l'élève" });
    }
  }
}

module.exports = new EleveController();
*/

// backend/controllers/EleveController.js


//fichier du jour bon



//
const EleveService = require("../Services/EleveService");

// Import des modèles Sequelize nécessaires pour l'intranet
const Utilisateur = require('../Models/Utilisateur');
const Eleve = require('../Models/Eleve');
const Maison = require('../Models/Maison');
const AnneeEtude = require('../Models/AnneeEtude');
const Matiere = require('../Models/Matiere');
const Note = require('../Models/Note');
const Role = require('../Models/Role');
const Professeur = require('../Models/Professeur');

class EleveController {
  // Fonctions CRUD standards (déjà présentes dans ton service)
  async getAllEleves(req, res) {
    try {
      const eleves = await EleveService.getAllEleves();
      res.json(eleves);
    } catch (error) {
      console.error("Erreur lors de la récupération de tous les élèves:", error);
      res.status(500).json({ error: "Erreur lors de la récupération des élèves" });
    }
  }

  async getEleveById(req, res) {
    try {
      const eleve = await EleveService.getEleveById(req.params.id);
      if (!eleve) return res.status(404).json({ error: "Élève non trouvé" });
      res.json(eleve);
    } catch (error) {
      console.error("Erreur lors de la récupération de l'élève par ID:", error);
      res.status(500).json({ error: "Erreur lors de la récupération de l'élève" });
    }
  }

  async addEleve(req, res) { console.log('addEleve bien appelé');
    try {
      const eleve = await EleveService.addEleve(req.body);
      res.status(201).json(eleve);
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'élève:", error);
      res.status(500).json({ error: "Erreur lors de l'ajout de l'élève" });
    }
  }

  async updateEleve(req, res) {
    try {
      const eleve = await EleveService.updateEleve(req.params.id, req.body);
      if (!eleve) return res.status(404).json({ error: "Élève non trouvé" });
      res.json(eleve);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'élève:", error);
      res.status(500).json({ error: "Erreur lors de la mise à jour de l'élève" });
    }
  }

  async deleteEleve(req, res) {
    try {
      const eleve = await EleveService.deleteEleve(req.params.id);
      if (!eleve) return res.status(404).json({ error: "Élève non trouvé" });
      res.json({ message: "Élève supprimé avec succès" });
    } catch (error) {
      console.error("Erreur lors de la suppression de l'élève:", error);
      res.status(500).json({ error: "Erreur lors de la suppression de l'élève" });
    }
  }

  // --- Nouvelles fonctions intranet ---

  async obtenirProfilEleveConnecte(req, res) {
    try {
      const idUtilisateur = req.user.id;

      const utilisateurAvecEleve = await Utilisateur.findByPk(idUtilisateur, {
        attributes: ['id_utilisateur', 'nom', 'prenom', 'email', 'photo'],
        include: [
          { model: Role, as: 'role', attributes: ['name'] },
          {
            model: Eleve,
            as: 'eleve',
            attributes: ['id_eleve', 'contact_parent'],
            include: [
              { model: Maison, as: 'maison', attributes: ['id_maison', 'nom', 'histoire', 'embleme', 'couleurs', 'photo'] },
              { model: AnneeEtude, as: 'anneeEtude', attributes: ['id_annee_etude', 'nom_annee', 'description'] },
              { model: Matiere, as: 'matieresSuivies', attributes: ['id_matiere', 'nom', 'description', 'photo'], through: { attributes: [] } }
            ]
          }
        ]
      });

      if (!utilisateurAvecEleve || !utilisateurAvecEleve.eleve) {
        return res.status(404).json({ message: "Profil élève non trouvé pour cet utilisateur." });
      }

      const profilFormate = {
        idUtilisateur: utilisateurAvecEleve.id_utilisateur,
        nom: utilisateurAvecEleve.nom,
        prenom: utilisateurAvecEleve.prenom,
        email: utilisateurAvecEleve.email,
        photo: utilisateurAvecEleve.photo,
        role: utilisateurAvecEleve.role ? utilisateurAvecEleve.role.name : null,
        idEleve: utilisateurAvecEleve.eleve.id_eleve,
        contactParent: utilisateurAvecEleve.eleve.contact_parent,
        anneeEtude: utilisateurAvecEleve.eleve.anneeEtude ? {
          id: utilisateurAvecEleve.eleve.anneeEtude.id_annee_etude,
          nom: utilisateurAvecEleve.eleve.anneeEtude.nom_annee,
          description: utilisateurAvecEleve.eleve.anneeEtude.description
        } : null,
        maison: utilisateurAvecEleve.eleve.maison ? {
          id: utilisateurAvecEleve.eleve.maison.id_maison,
          nom: utilisateurAvecEleve.eleve.maison.nom,
          histoire: utilisateurAvecEleve.eleve.maison.histoire,
          embleme: utilisateurAvecEleve.eleve.maison.embleme,
          couleurs: utilisateurAvecEleve.eleve.maison.couleurs,
          photo: utilisateurAvecEleve.eleve.maison.photo,
        } : null,
        matieresSuivies: utilisateurAvecEleve.eleve.matieresSuivies ? utilisateurAvecEleve.eleve.matieresSuivies.map(matiere => ({
          id: matiere.id_matiere,
          nom: matiere.nom,
          description: matiere.description,
          photo: matiere.photo
        })) : []
      };

      res.status(200).json(profilFormate);
    } catch (error) {
      console.error("Erreur lors de la récupération du profil élève connecté:", error);
      res.status(500).json({ message: "Erreur serveur lors de la récupération du profil élève.", error: error.message });
    }
  }

  async obtenirNotesEtMoyennesEleveConnecte(req, res) {
    try {
      const idUtilisateur = req.user.id;

      // Trouver l'élève lié à cet utilisateur
      const eleveAssocie = await Eleve.findOne({ where: { id_eleve: idUtilisateur }, attributes: ['id_eleve'] });
      if (!eleveAssocie) {
        return res.status(404).json({ message: "Informations d'élève introuvables pour l'utilisateur connecté." });
      }
      const idEleve = eleveAssocie.id_eleve;

      // Récupérer les notes avec matières et professeurs
      const notes = await Note.findAll({
        where: { id_eleve: idEleve },
        include: [
          { model: Matiere, as: 'laMatiere', attributes: ['id_matiere', 'nom', 'description'] },
          {
            model: Professeur,
            as: 'professeurEvaluateur',
            attributes: ['id_professeur'],
            include: { model: Utilisateur, as: 'utilisateur', attributes: ['nom', 'prenom'] }
          }
        ],
        attributes: ['id_note', 'valeur', 'date_note', 'commentaire']
      });

      // Organiser les notes par matière et calculer les moyennes
      const notesParMatiere = {};

      notes.forEach(note => {
        const nomMatiere = note.laMatiere.nom;
        if (!notesParMatiere[nomMatiere]) {
          notesParMatiere[nomMatiere] = {
            idMatiere: note.laMatiere.id_matiere,
            description: note.laMatiere.description,
            notes: [],
            moyenne: 0
          };
        }

        notesParMatiere[nomMatiere].notes.push({
          idNote: note.id_note,
          valeur: note.valeur,
          date: note.date_note,
          commentaire: note.commentaire,
          professeur: note.professeurEvaluateur ? {
            idProfesseur: note.professeurEvaluateur.id_professeur,
            nom: note.professeurEvaluateur.utilisateur.nom,
            prenom: note.professeurEvaluateur.utilisateur.prenom
          } : null
        });
      });

      // Calcul de la moyenne par matière
      for (const matiere in notesParMatiere) {
        const notesArray = notesParMatiere[matiere].notes;
        const total = notesArray.reduce((acc, curr) => acc + curr.valeur, 0);
        notesParMatiere[matiere].moyenne = notesArray.length ? (total / notesArray.length).toFixed(2) : null;
      }

      // Moyenne générale
      const moyennes = Object.values(notesParMatiere).map(m => parseFloat(m.moyenne) || 0);
      const moyenneGenerale = moyennes.length ? (moyennes.reduce((acc, val) => acc + val, 0) / moyennes.length).toFixed(2) : null;

      res.status(200).json({ notesParMatiere, moyenneGenerale });
    } catch (error) {
      console.error("Erreur lors de la récupération des notes et moyennes de l'élève connecté:", error);
      res.status(500).json({ message: "Erreur serveur lors de la récupération des notes.", error: error.message });
    }
  }
}

module.exports = new EleveController();
