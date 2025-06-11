const Buse = require("../Models/Buse");
const { Op } = require("sequelize");

class BuseService {
  async getAllBuse() {
    return await Buse.findAll();
  }
  async getLatestBuse() {
    const today = new Date();

    return await Buse.findOne({
      where: {
        date: {
          [Op.gte]: today, // date >= aujourd’hui
        },
      },
      order: [['date', 'ASC']], // la date la plus proche dans le futur (ordre croissant)
    });
  }
  async getBuseById(id) {
    return await Buse.findByPk(id);
  }

  async addBuse(data) {
    return await Buse.create(data);
  }

  async updateBuse(id, data) {
    const buse = await Buse.findByPk(id);
    if (!buse) return null;
    return await buse.update(data);
  }

  async deleteBuse(id) {
    const buse = await Buse.findByPk(id);
    if (!buse) return null;
    await buse.destroy();
    return buse;
  }
}

module.exports = new BuseService();
