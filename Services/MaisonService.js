/*const Maison = require("../Models/Maison");

class MaisonService {
  async getAllMaisons() {
    return await Maison.findAll();
  }

  async getMaisonById(id) {
    return await Maison.findByPk(id);
  }

  async addMaison(data) {
    return await Maison.create(data);
  }

  async updateMaison(id, data) {
    const maison = await Maison.findByPk(id);
    if (!maison) return null;
    return await maison.update(data);
  }

  async deleteMaison(id) {
    const maison = await Maison.findByPk(id);
    if (!maison) return null;
    await maison.destroy();
    return maison;
  }
}

module.exports = new MaisonService();*/
// Services/MaisonService.js

// Importe les modèles Maison et Utilisateur
// Assure-toi que ce chemin est correct en fonction de l'emplacement de ton dossier Models.
const Maison = require("../Models/Maison");
const Utilisateur = require("../Models/Utilisateur");

class MaisonService {
  /**
   * Récupère toutes les maisons avec leurs directeurs et préfets associés.
   * @returns {Promise<Array>} Une promesse qui résout en un tableau d'objets Maison.
   */
  async getAllMaisons() {
    try {
      const maisons = await Maison.findAll({
        // Inclut les associations pour le directeur et le préfet
        // Les alias 'directeur' et 'prefet' DOIVENT correspondre à ceux définis dans Models/Associations.js
        include: [
          {
            model: Utilisateur,
            as: 'directeur',
            // Spécifie les attributs (colonnes) que tu veux récupérer pour le directeur
            attributes: ['id_utilisateur', 'nom', 'prenom', 'photo'],
          },
          {
            model: Utilisateur,
            as: 'prefet',
            // Spécifie les attributs (colonnes) que tu veux récupérer pour le préfet
            attributes: ['id_utilisateur', 'nom', 'prenom', 'photo'],
          },
        ],
      });

      // Traite les données pour s'assurer que les chemins des photos sont complets
      // C'est une étape de sécurité pour garantir l'URL complète pour le frontend.
      const processedMaisons = maisons.map((maison) => {
        const maisonData = maison.toJSON(); // Convertit l'instance Sequelize en objet JavaScript simple

        // Vérifie et ajuste le chemin de la photo du directeur si nécessaire
        if (maisonData.directeur && maisonData.directeur.photo && !maisonData.directeur.photo.startsWith('/uploads/images/')) {
          maisonData.directeur.photo = `/uploads/images/${maisonData.directeur.photo}`;
        }
        // Vérifie et ajuste le chemin de la photo du préfet si nécessaire
        if (maisonData.prefet && maisonData.prefet.photo && !maisonData.prefet.photo.startsWith('/uploads/images/')) {
          maisonData.prefet.photo = `/uploads/images/${maisonData.prefet.photo}`;
        }

        // La photo de la maison elle-même est supposée être déjà au bon format après l'upload via AdminJS
        // donc nous n'avons plus besoin de la modifier ici.

        return maisonData;
      });

      return processedMaisons; // Retourne les maisons avec les objets directeur et préfet imbriqués
    } catch (error) {
      console.error('Erreur dans MaisonService.getAllMaisons:', error);
      throw error; // Relance l'erreur pour que le contrôleur puisse la gérer
    }
  }

  /**
   * Récupère une maison spécifique par son ID, incluant son directeur et son préfet.
   * @param {number} id - L'ID de la maison à récupérer.
   * @returns {Promise<Object|null>} Une promesse qui résout en un objet Maison ou null si non trouvée.
   */
  async getMaisonById(id) {
    try {
      const maison = await Maison.findByPk(id, {
        // Applique la même logique d'inclusion pour la récupération par ID
        include: [
          {
            model: Utilisateur,
            as: 'directeur',
            attributes: ['id_utilisateur', 'nom', 'prenom', 'photo'],
          },
          {
            model: Utilisateur,
            as: 'prefet',
            attributes: ['id_utilisateur', 'nom', 'prenom', 'photo'],
          },
        ],
      });

      if (!maison) return null; // Si aucune maison n'est trouvée

      // Traite les chemins des photos pour la maison unique
      const maisonData = maison.toJSON();
      if (maisonData.directeur && maisonData.directeur.photo && !maisonData.directeur.photo.startsWith('/uploads/images/')) {
        maisonData.directeur.photo = `/uploads/images/${maisonData.directeur.photo}`;
      }
      if (maisonData.prefet && maisonData.prefet.photo && !maisonData.prefet.photo.startsWith('/uploads/images/')) {
        maisonData.prefet.photo = `/uploads/images/${maisonData.prefet.photo}`;
      }

      return maisonData; // Retourne la maison unique avec les objets imbriqués
    } catch (error) {
      console.error('Erreur dans MaisonService.getMaisonById:', error);
      throw error; // Relance l'erreur
    }
  }

  /**
   * Ajoute une nouvelle maison.
   * @param {Object} data - Les données de la maison à ajouter.
   * @returns {Promise<Object>} La promesse qui résout en l'objet Maison créé.
   */
  async addMaison(data) {
    return await Maison.create(data);
  }

  /**
   * Met à jour une maison existante.
   * @param {number} id - L'ID de la maison à mettre à jour.
   * @param {Object} data - Les nouvelles données de la maison.
   * @returns {Promise<Object|null>} La promesse qui résout en l'objet Maison mis à jour ou null.
   */
  async updateMaison(id, data) {
    const maison = await Maison.findByPk(id);
    if (!maison) return null;
    return await maison.update(data);
  }

  /**
   * Supprime une maison par son ID.
   * @param {number} id - L'ID de la maison à supprimer.
   * @returns {Promise<Object|null>} La promesse qui résout en l'objet Maison supprimé ou null.
   */
  async deleteMaison(id) {
    const maison = await Maison.findByPk(id);
    if (!maison) return null;
    await maison.destroy();
    return maison; // Retourne l'instance supprimée
  }
}

module.exports = new MaisonService();