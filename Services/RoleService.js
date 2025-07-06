const Role = require('../Models/Role');
const Professeur = require('../Models/Professeur');
const Eleve = require('../Models/Eleve');
const Admin = require('../Models/Admin');

class RoleService {
  constructor() {
    this.rolesCache = null;
  }

  async loadRoles() {
    try {
      console.log("[RoleService] Chargement des rôles depuis la base de données...");
      const roles = await Role.findAll();
      this.rolesCache = {};
      roles.forEach(role => {
        console.log(`[RoleService] Rôle trouvé : ${role.name} => ID ${role.id_role}`);
        this.rolesCache[role.name.toLowerCase()] = role.id_role;
      });
      console.log("[RoleService] Cache des rôles chargé :", this.rolesCache);
    } catch (error) {
      console.error("[RoleService] Erreur lors du chargement des rôles :", error);
      throw error;
    }
  }

  async getRoleId(roleName) {
    if (!this.rolesCache) {
      console.log("[RoleService] Cache vide, chargement...");
      await this.loadRoles();
    }
    const roleId = this.rolesCache[roleName.toLowerCase()] || null;
    console.log(`[RoleService] ID du rôle "${roleName}" : ${roleId}`);
    return roleId;
  }

  async getAllRoles() {
    if (!this.rolesCache) {
      console.log("[RoleService] getAllRoles : Cache vide, chargement...");
      await this.loadRoles();
    }
    return this.rolesCache;
  }

  async getAllRoleNames() {
    if (!this.rolesCache) {
      console.log("[RoleService] getAllRoleNames : Cache vide, chargement...");
      await this.loadRoles();
    }
    return Object.keys(this.rolesCache);
  }

  async refreshCache() {
    console.log("[RoleService] Rafraîchissement du cache...");
    await this.loadRoles();
  }

  async syncUserRole(userId, roleId) {
    console.log(`[RoleService] ➤ Synchronisation du rôle pour l'utilisateur ${userId} avec rôle ID ${roleId}`);

    if (!this.rolesCache) {
      console.log("[RoleService] syncUserRole : Cache vide, chargement...");
      await this.loadRoles();
    }

    const allRoles = this.rolesCache;
    console.log("[RoleService] Cache actuel :", allRoles);

    const isEleve = roleId === allRoles['eleve'];
    const isProfesseur = roleId === allRoles['professeur'];
    const isAdmin = roleId === allRoles['admin'];

    console.log(`[RoleService] isEleve: ${isEleve}, isProfesseur: ${isProfesseur}, isAdmin: ${isAdmin}`);

    try {
      console.log("[RoleService] Suppression des anciennes entrées si nécessaires...");
      await Promise.all([
        
        !isEleve && Eleve.destroy({ where: { id_eleve: userId } }),
        !isProfesseur && Professeur.destroy({ where: { id_professeur: userId } }),
        !isAdmin && Admin.destroy({ where: { id_admin: userId } }),
      ]);

      if (isEleve) {
        console.log(`[RoleService] Création/validation de l'entrée Eleve pour l'utilisateur ${userId}`);
     
        await Eleve.findOrCreate({ where: { id_eleve: userId }, defaults: { id_eleve: userId } });
      } else if (isProfesseur) {
        console.log(`[RoleService] Création/validation de l'entrée Professeur pour l'utilisateur ${userId}`);
        
        await Professeur.findOrCreate({
          where: { id_professeur: userId },
          defaults: {
            id_professeur: userId, // Assurez-vous que le champ defaults est aussi corrigé
            description: 'Description par défaut',
            id_matiere: null,
            fonction: 'professeur',
          },
        });
      } else if (isAdmin) {
        console.log(`[RoleService] Création/validation de l'entrée Admin pour l'utilisateur ${userId}`);
        // CORRECTION ICI : Utilisation de la clé primaire de la table admin
        await Admin.findOrCreate({ where: { id_admin: userId }, defaults: { id_admin: userId } });
      } else {
        console.warn(`[RoleService] Aucun rôle reconnu pour l’ID ${roleId}. Rien créé.`);
      }
    } catch (error) {
      console.error(`[RoleService] Erreur lors de la synchronisation de l'utilisateur ${userId} :`, error);
      // Re-jeter l'erreur pour qu'elle soit capturée plus haut si nécessaire
      throw error;
    }
  }

  async removeUserRoles(userIds) {
    console.log(`[RoleService] ➤ Suppression des rôles pour utilisateurs : ${userIds}`);
    try {
      await Promise.all([
        // CORRECTION ICI : Utilisation de la clé primaire de chaque table
        Eleve.destroy({ where: { id_eleve: userIds } }),
        Professeur.destroy({ where: { id_professeur: userIds } }),
        Admin.destroy({ where: { id_admin: userIds } }),
      ]);
      console.log(`[RoleService] Suppression terminée pour utilisateurs : ${userIds}`);
    } catch (error) {
      console.error("[RoleService] Erreur lors de la suppression des rôles :", error);
      throw error; // Re-jeter l'erreur pour qu'elle soit capturée plus haut si nécessaire
    }
  }
}

module.exports = new RoleService();

