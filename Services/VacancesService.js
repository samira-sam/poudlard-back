const Vacances = require("../Models/Vacances");

class VacancesService {
  async getAllVacances() {
    return await Vacances.findAll();
  }

  async getVacanceById(id) {
    return await Vacances.findByPk(id);
  }

  async addVacance(data) {
    return await Vacances.create(data);
  }

  async updateVacance(id, data) {
    const Vacances = await Vacances.findByPk(id);
    if (!Vacances) return null;
    return await Vacances.update(data);
  }

  async deleteVacance(id) {
    const Vacances = await Vacances.findByPk(id);
    if (!Vacances) return null;
    return await Vacances.destroy();
  }
}

module.exports = new VacancesService();
