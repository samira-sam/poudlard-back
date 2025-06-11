const Bdc = require("../Models/Bdc");

class BdcService {
  async getAllBdcs() {
    return await Bdc.findAll();
  }

  async getBdcById(id) {
    return await Bdc.findByPk(id);
  }

  async addBdc(data) {
    return await Bdc.create(data);
  }

  async updateBdc(id, data) {
    const Bdc = await Bdc.findByPk(id);
    if (!Bdc) return null;
    return await Bdc.update(data);
  }

  async deleteBdc(id) {
    const Bdc = await Bdc.findByPk(id);
    if (!Bdc) return null;
    return await Bdc.destroy();
  }
}

module.exports = new BdcService();
