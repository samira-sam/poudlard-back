/*const Eleve = require("../Models/Eleve");
const Utilisateur = require('../Models/Utilisateur');

class EleveService {
  // Récupérer tous les élèves avec leurs informations liées à Utilisateur
  async getAllEleves() {
    return await Eleve.findAll({
      include: [
        { model: Utilisateur, as: "utilisateur" }
      ]
    });
  }

  // Récupérer un élève par son ID avec ses informations liées à Utilisateur
  async getEleveById(id) {
    return await Eleve.findByPk(id, {
      include: [
        { model: Utilisateur, as: "utilisateur" }
      ]
    });
  }

  // Ajouter un nouvel élève
  async addEleve(data) {
    return await Eleve.create(data);
  }

  // Mettre à jour un élève existant
  async updateEleve(id, data) {
    const eleve = await Eleve.findByPk(id);
    if (!eleve) return null;
    return await eleve.update(data);
  }

  // Supprimer un élève
  async deleteEleve(id) {
    const eleve = await Eleve.findByPk(id);
    if (!eleve) return null;
    await eleve.destroy();
    return eleve;
  }
}

module.exports = new EleveService();*/












const Eleve = require("../Models/Eleve");
const Utilisateur = require('../Models/Utilisateur');

class EleveService {
  // Récupérer tous les élèves avec leurs informations liées à Utilisateur
  async getAllEleves() {
    return await Eleve.findAll({
      include: [
        { model: Utilisateur, as: "utilisateur" }
      ]
    });
  }

  // Récupérer un élève par son ID avec ses informations liées à Utilisateur
  async getEleveById(id) {
    return await Eleve.findByPk(id, {
      include: [
        { model: Utilisateur, as: "utilisateur" }
      ]
    });
  }

  // Ajouter un nouvel élève
  async addEleve(data) {
    return await Eleve.create(data);
  }

  // Mettre à jour un élève existant
  async updateEleve(id, data) {
    const eleve = await Eleve.findByPk(id);
    if (!eleve) return null;
    return await eleve.update(data);
  }

  // Supprimer un élève
  async deleteEleve(id) {
    const eleve = await Eleve.findByPk(id);
    if (!eleve) return null;
    await eleve.destroy();
    return eleve;
  }
}

module.exports = new EleveService();
