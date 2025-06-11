const Concours = require("../Models/Concours");

class ConcoursService {

  async getConcoursByAnnee(idAnnee) {
    try {
      // On récupère les concours dont l'id_annee_etude correspond à idAnnee
      const concours = await Concours.findAll({
        where: {
          id_annee_etude: idAnnee
        },
        order: [['date_debut', 'ASC']] // optionnel : trie par date croissante
      });
      return concours;
    } catch (error) {
      console.error('Erreur dans ConcoursService.getConcoursByAnnee:', error);
      throw error;
    }
  }

  async getAllConcours() {
    return await Concours.findAll();
  }

  async getConcoursById(id) {
    return await Concours.findByPk(id);
  }

  async addConcours(data) {
    return await Concours.create(data);
  }

  async updateConcours(id, data) {
    const concours = await Concours.findByPk(id);
    if (!concours) return null;
    return await concours.update(data);
  }

  async deleteConcours(id) {
    const concours = await Concours.findByPk(id);
    if (!concours) return null;
    await concours.destroy();
    return concours;
  }
}

module.exports = new ConcoursService();
