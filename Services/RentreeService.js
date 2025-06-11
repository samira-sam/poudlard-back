const Rentree = require("../Models/Rentree");
const { Op } = require("sequelize");

class RentreeService {
  async getAllRentrees() {
    return await Rentree.findAll();
  }
 async getLatestRentree() {
  const today = new Date();
  return await Rentree.findOne({
    where: {
      date: {
        [Op.gte]: today // date >= aujourd'hui
      }
    },
    order: [['date', 'ASC']], // la plus proche dans le futur
  });
}

  async getRentreeById(id) {
    return await Rentree.findByPk(id);
  }

  async addRentree(data) {
    return await Rentree.create(data);
  }

  async updateRentree(id, data) {
    const rentree = await Rentree.findByPk(id);
    if (!rentree) return null;
    return await rentree.update(data);
  }

  async deleteRentree(id) {
    const rentree = await Rentree.findByPk(id);
    if (!rentree) return null;
    await rentree.destroy();
    return rentree;
  }
}

module.exports = new RentreeService();

