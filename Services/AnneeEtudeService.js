const AnneeEtude = require("../Models/AnneeEtude");

class AnneeEtudeService {
  async getAllAnneeEtudes() {
    return await AnneeEtude.findAll();
  }

  async getAnneeEtudeById(id) {
    return await AnneeEtude.findByPk(id);
  }

  async addAnneeEtude(data) {
    return await AnneeEtude.create(data);
  }

  async updateAnneeEtude(id, data) {
    const anneeEtude = await AnneeEtude.findByPk(id);
    if (!anneeEtude) return null;
    return await anneeEtude.update(data);
  }

  async deleteAnneeEtude(id) {
    const anneeEtude = await AnneeEtude.findByPk(id);
    if (!anneeEtude) return null;
    return await anneeEtude.destroy();
  }
}

module.exports = new AnneeEtudeService();
