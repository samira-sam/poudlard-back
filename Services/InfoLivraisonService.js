const InfoLivraison = require("../Models/InfoLivraison");

class InfoLivraisonService {
  async getAllInfoLivraisons() {
    return await InfoLivraison.findAll();
  }

  async getInfoLivraisonById(id) {
    return await InfoLivraison.findByPk(id);
  }

  async addInfoLivraison(data) {
    return await InfoLivraison.create(data);
  }

  async updateInfoLivraison(id, data) {
    const info = await InfoLivraison.findByPk(id);
    if (!info) return null;
    return await info.update(data);
  }

  async deleteInfoLivraison(id) {
    const info = await InfoLivraison.findByPk(id);
    if (!info) return null;
    await info.destroy();
    return info;
  }
}

module.exports = new InfoLivraisonService();
