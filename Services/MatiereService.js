const Matiere = require("../Models/Matiere");

class MatiereService {
  async getAllMatiere() {
    return await Matiere.findAll();
  }

  async getMatiereById(id) {
    return await Matiere.findByPk(id);
  }

  async addMatiere(data) {
    return await Matiere.create(data);
  }

  async updateMatiere(id, data) {
    const matiere = await Matiere.findByPk(id);
    if (!matiere) return null;
    return await matiere.update(data);
  }

  async deleteMatiere(id) {
    const matiere = await Matiere.findByPk(id);
    if (!matiere) return null;
    await matiere.destroy();
    return matiere;
  }
}

module.exports = new MatiereService();
