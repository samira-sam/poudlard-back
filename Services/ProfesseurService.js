/*const Professeur = require("../Models/Professeur");
const Utilisateur = require('../Models/Utilisateur');
const Matiere = require('../Models/Matiere');

class ProfesseurService {
  // Récupérer tous les professeurs avec leurs informations liées à Utilisateur
 async getAllProfesseurs() {
    return await Professeur.findAll({
      include: [
        { model: Utilisateur, as: "utilisateur" },
        { model: Matiere, as: "matiereEnseignee" } // <-- UTILISE LE NOUVEL ALIAS ICI
      ]
    });
  }

  async getProfesseurById(id) {
    return await Professeur.findByPk(id, {
      include: [
        { model: Utilisateur, as: "utilisateur" },
        { model: Matiere, as: "matiereEnseignee" } // <-- ET ICI
      ]
    });
  }
async addProfesseur(data) {
  return await Professeur.create({
    ...data,
    fonction: data.fonction || 'professeur',
  });
}
  // Ajouter un nouveau professeur
  async addProfesseur(data) {
    return await Professeur.create(data);
  }

  // Mettre à jour un professeur existant
  async updateProfesseur(id, data) {
    const professeur = await Professeur.findByPk(id);
    if (!professeur) return null;
    return await professeur.update(data);
  }

  // Supprimer un professeur
  async deleteProfesseur(id) {
    const professeur = await Professeur.findByPk(id);
    if (!professeur) return null;
    await professeur.destroy();
    return professeur;
  }
}

module.exports = new ProfesseurService();*/
// Services/ProfesseurService.js

// IMPORTANT : Assure-toi que le chemin est correct vers ton dossier models/
/*const Professeur = require("../Models/Professeur");
const Utilisateur = require('../Models/Utilisateur');
const Matiere = require('../Models/Matiere'); // Exemple si tes modèles sont dans ../models/index.js et exportés

const ProfesseurService = {
    // --- Fonction pour récupérer TOUS les professeurs ---
    getAllProfesseurs: async () => {
        try {
            const professeurs = await Professeur.findAll({
                include: [
                    {
                        model: Utilisateur,
                        as: 'utilisateur', // Assure-toi que ce nom correspond à ton association Sequelize
                        attributes: ['id_utilisateur', 'nom', 'prenom', 'email', 'photo'] // Les champs que tu veux de la table Utilisateur
                    },
                    {
                        model: Matiere,
                        as: 'matiereEnseignee', // Assure-toi que ce nom correspond à ton association Sequelize
                        attributes: ['id_matiere', 'nom', 'description'] // Les champs que tu veux de la table Matiere
                    }
                ]
            });
            return professeurs; // Le service retourne les données
        } catch (error) {
            console.error('Erreur dans ProfesseurService.getAllProfesseurs:', error);
            throw error; // Propage l'erreur au contrôleur
        }
    },

    // --- Fonction pour récupérer UN professeur par ID ---
    getProfesseurById: async (id) => {
        try {
            const professeur = await Professeur.findByPk(id, {
                include: [
                    {
                        model: Utilisateur,
                        as: 'utilisateur',
                        attributes: ['id_utilisateur', 'nom', 'prenom', 'email', 'photo']
                    },
                    {
                        model: Matiere,
                        as: 'matiereEnseignee',
                        attributes: ['id_matiere', 'nom', 'description']
                    }
                ]
            });
            return professeur; // Le service retourne les données
        } catch (error) {
            console.error('Erreur dans ProfesseurService.getProfesseurById:', error);
            throw error; // Propage l'erreur au contrôleur
        }
    },

    // --- Tes autres fonctions de service (addProfesseur, updateProfesseur, deleteProfesseur) ---
    addProfesseur: async (data) => {
        // Logique pour ajouter un professeur
        // Exemple: return await Professeur.create(data);
        console.log("Logique addProfesseur à implémenter dans le service");
        return { message: 'Add Professeur - Service Not Implemented' };
    },
    updateProfesseur: async (id, data) => {
        // Logique pour mettre à jour un professeur
        // Exemple: await Professeur.update(data, { where: { id_professeur: id } }); return await Professeur.findByPk(id);
        console.log("Logique updateProfesseur à implémenter dans le service");
        return { message: 'Update Professeur - Service Not Implemented' };
    },
    deleteProfesseur: async (id) => {
        // Logique pour supprimer un professeur
        // Exemple: return await Professeur.destroy({ where: { id_professeur: id } });
        console.log("Logique deleteProfesseur à implémenter dans le service");
        return { message: 'Delete Professeur - Service Not Implemented' };
    },
};

module.exports = ProfesseurService;*/







const Professeur = require("../Models/Professeur");
const Utilisateur = require("../Models/Utilisateur");
const Matiere = require("../Models/Matiere");
const UtilisateurService = require("./UtilisateurService");

const ProfesseurService = {
  // Récupérer tous les professeurs
  getAllProfesseurs: async () => {
    try {
      return await Professeur.findAll({
        include: [
          {
            model: Utilisateur,
            as: 'utilisateur',
            attributes: ['id_utilisateur', 'nom', 'prenom', 'email', 'photo'],
          },
          {
            model: Matiere,
            as: 'matiereEnseignee',
            attributes: ['id_matiere', 'nom', 'description'],
          },
        ],
      });
    } catch (error) {
      console.error('Erreur dans getAllProfesseurs:', error);
      throw error;
    }
  },

  // Récupérer un professeur par ID
  getProfesseurById: async (id) => {
    try {
      return await Professeur.findByPk(id, {
        include: [
          {
            model: Utilisateur,
            as: 'utilisateur',
            attributes: ['id_utilisateur', 'nom', 'prenom', 'email', 'photo'],
          },
          {
            model: Matiere,
            as: 'matiereEnseignee',
            attributes: ['id_matiere', 'nom', 'description'],
          },
        ],
      });
    } catch (error) {
      console.error('Erreur dans getProfesseurById:', error);
      throw error;
    }
  },

  // Ajouter un professeur + son utilisateur avec rôle
  addProfesseur: async (data) => {
    try {
      const { utilisateur, id_matiere, id_maison_directeur, fonction } = data;

      // 1. Créer l'utilisateur avec le rôle 'professeur'
      const nouvelUtilisateur = await UtilisateurService.createUserWithRole(utilisateur, 'professeur');

      // 2. Créer le professeur
      const professeurCree = await Professeur.create({
        id_utilisateur: nouvelUtilisateur.id_utilisateur,
        id_matiere,
        id_maison_directeur: id_maison_directeur || null,
        fonction: fonction || null,
      });

      return professeurCree;

    } catch (error) {
      console.error('Erreur dans addProfesseur:', error);
      throw error;
    }
  },

  // Mettre à jour un professeur
  updateProfesseur: async (id, data) => {
    try {
      const professeur = await Professeur.findByPk(id);
      if (!professeur) return null;

      await professeur.update(data);
      return professeur;
    } catch (error) {
      console.error('Erreur dans updateProfesseur:', error);
      throw error;
    }
  },

  // Supprimer un professeur
  deleteProfesseur: async (id) => {
    try {
      const professeur = await Professeur.findByPk(id);
      if (!professeur) return null;

      await professeur.destroy();
      return professeur;
    } catch (error) {
      console.error('Erreur dans deleteProfesseur:', error);
      throw error;
    }
  },
};

module.exports = ProfesseurService;
