/*const Admin = require('../Models/Admin');
const Utilisateur = require('../Models/Utilisateur');


class AdminService {
  async findAll() {
    return await Admin.findAll({
      include: [{ model: Utilisateur, as: "utilisateur" }]
    });
  }

  async findById(id) {
    return await Admin.findByPk(id, {
      include: [{ model: Utilisateur, as: "utilisateur" }]
    });
  }

  async addAdmin(data) {
    return await Admin.create(data);
  }

  async updateAdmin(id, data) {
    const admin = await Admin.findByPk(id);
    if (!admin) return null;
    return await admin.update(data);
  }

  async deleteAdmin(id) {
    const admin = await Admin.findByPk(id);
    if (!admin) return null;
    await admin.destroy();
    return true;
  }
}

module.exports = new AdminService();
*/

const Admin = require('../Models/Admin');
const Utilisateur = require('../Models/Utilisateur');
const RoleService = require('./RoleService');

class AdminService {
  async findAll() {
    return await Admin.findAll({
      include: [{ model: Utilisateur, as: "utilisateur" }]
    });
  }

  async findById(id) {
    return await Admin.findByPk(id, {
      include: [{ model: Utilisateur, as: "utilisateur" }]
    });
  }

  async addAdmin(utilisateurId) {
    try {
      const adminRoleId = await RoleService.getRoleId('admin');

      // Mise à jour du rôle dans Utilisateur
      await Utilisateur.update({ id_role: adminRoleId }, { where: { id_utilisateur: utilisateurId } });

      // Créer l'entrée Admin dans la table Admin si elle n'existe pas
      const [admin, created] = await Admin.findOrCreate({
        where: { id_utilisateur: utilisateurId }
      });

      return admin;
    } catch (error) {
      console.error('Erreur dans AdminService.addAdmin:', error);
      throw error;
    }
  }

  async updateAdmin(id, data) {
    const admin = await Admin.findByPk(id);
    if (!admin) return null;
    return await admin.update(data);
  }

  async deleteAdmin(id) {
    const admin = await Admin.findByPk(id);
    if (!admin) return null;
    await admin.destroy();
    return true;
  }
}

module.exports = new AdminService();

