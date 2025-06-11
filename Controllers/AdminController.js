/*const adminService = require('../Services/AdminService');

class adminController {

  async getUtilisateursEnAttente(req, res) {
    try {
      const utilisateurs = await Utilisateur.findAll({
        where: { role: null },
        attributes: ['id', 'prenom', 'nom', 'email']
      });
      res.json(utilisateurs);
    } catch (err) {
      res.status(500).json({ error: "Erreur lors de la récupération des utilisateurs." });
    }}

    async attribuerRole(req, res) {
    const { id } = req.params;
    const { role } = req.body;

    if (!['admin', 'professeur', 'eleve'].includes(role)) {
      return res.status(400).json({ error: "Rôle invalide." });
    }

    try {
      const utilisateur = await Utilisateur.findByPk(id);
      if (!utilisateur) {
        return res.status(404).json({ error: "Utilisateur introuvable." });
      }

      utilisateur.role = role;
      await utilisateur.save();

      res.json({ message: "Rôle attribué avec succès." });
    } catch (err) {
      res.status(500).json({ error: "Erreur lors de l'attribution du rôle." });
    }
  }
//a voir si les methode en dessous sont necessaire ou sup a la fin
  
  async getAll(req, res) {
    try {
      const admins = await adminService.findAll();
      res.json(admins);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
  

  async getById(req, res) {
    try {
      const admin = await adminService.findById(req.params.id);
      if (!admin) return res.status(404).json({ message: 'Admin non trouvé' });
      res.json(admin);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async create(req, res) {
    try {
      const admin = await adminService.create(req.body);
      res.status(201).json(admin);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async delete(req, res) {
    try {
      const result = await adminService.delete(req.params.id);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = new adminController;*/




const adminService = require('../Services/AdminService');
const Utilisateur = require('../Models/Utilisateur');
const RoleService = require('../Services/RoleService');

class adminController {

  async getUtilisateursEnAttente(req, res) {
    try {
      const utilisateurs = await Utilisateur.findAll({
        where: { id_role: null },
        attributes: ['id_utilisateur', 'prenom', 'nom', 'email']
      });
      res.json(utilisateurs);
    } catch (err) {
      res.status(500).json({ error: "Erreur lors de la récupération des utilisateurs." });
    }
  }

  async attribuerRole(req, res) {
    const { id } = req.params;
    const { role } = req.body;

    try {
      // Récupérer tous les noms de rôles depuis la base
      const validRoles = await RoleService.getAllRoleNames();

      if (!validRoles.includes(role)) {
        return res.status(400).json({ error: "Rôle invalide." });
      }

      const utilisateur = await Utilisateur.findByPk(id);
      if (!utilisateur) {
        return res.status(404).json({ error: "Utilisateur introuvable." });
      }

      // Récupérer l'id du rôle correspondant
      const roleId = await RoleService.getRoleId(role);
      utilisateur.id_role = roleId;
      await utilisateur.save();

      res.json({ message: "Rôle attribué avec succès." });
    } catch (err) {
      res.status(500).json({ error: "Erreur lors de l'attribution du rôle." });
    }
  }

  async getAll(req, res) {
    try {
      const admins = await adminService.findAll();
      res.json(admins);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getById(req, res) {
    try {
      const admin = await adminService.findById(req.params.id);
      if (!admin) return res.status(404).json({ message: 'Admin non trouvé' });
      res.json(admin);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async create(req, res) {
    try {
      const admin = await adminService.create(req.body);
      res.status(201).json(admin);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async delete(req, res) {
    try {
      const result = await adminService.delete(req.params.id);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new adminController();
