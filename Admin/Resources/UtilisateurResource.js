
///premiere version

/*const Utilisateur = require('../../Models/Utilisateur');
const Role = require('../../Models/Role');
const Eleve = require('../../Models/Eleve');
const Professeur = require('../../Models/Professeur');

const utilisateurResource = {
  resource: Utilisateur,
  options: {
    properties: {
      nom: { isTitle: true },
      mot_de_passe: {
        isVisible: {
          list: false,
          show: false,
          edit: true,
          filter: false,
        },
      },
      id_role: {
        reference: 'role',
        isVisible: { list: true, show: true, edit: true, filter: true },
        isRequired: false,
        label: 'Rôle',
      },
      photo: {
        components: {
          edit: 'MyPhotoUploadComponent',
        },
      },
    },
    listProperties: ['id_utilisateur', 'prenom', 'nom', 'email', 'id_role', 'photo'],
    editProperties: ['prenom', 'nom', 'email', 'id_role', 'mot_de_passe', 'photo'],
    filterProperties: ['id_role', 'email', 'nom'],
    // Pas de hooks before pour new ou edit, on ne touche pas au mot de passe ici
    actions: {},
    hooks: {
      after: {
        save: async (response, request, context) => {
          const { record } = context;
          if (!record || !record.isValid() || !record.id) return response;

          const userId = record.id;
          const currentRoleId = record.param('id_role');

          if (!currentRoleId) {
            await Eleve.destroy({ where: { id_utilisateur: userId } });
            await Professeur.destroy({ where: { id_utilisateur: userId } });
            return response;
          }

          try {
            const role = await Role.findByPk(currentRoleId);
            const roleName = role ? role.name : null;

            if (roleName === 'eleve') {
              await Eleve.findOrCreate({ where: { id_utilisateur: userId }, defaults: { id_utilisateur: userId } });
              await Professeur.destroy({ where: { id_utilisateur: userId } });

            } else if (roleName === 'professeur') {
              await Professeur.findOrCreate({
                where: { id_utilisateur: userId },
                defaults: {
                  id_utilisateur: userId,
                  description: 'Description par défaut',
                  id_matiere: 1,
                  fonction: 'professeur',
                },
              });
              await Eleve.destroy({ where: { id_utilisateur: userId } });

            } else {
              await Eleve.destroy({ where: { id_utilisateur: userId } });
              await Professeur.destroy({ where: { id_utilisateur: userId } });
            }
          } catch (error) {
            console.error(`Erreur synchronisation profil utilisateur ${userId}:`, error);
          }

          return response;
        },

        delete: async (response, request, context) => {
          const recordIds = context.recordIds || [];
          if (recordIds.length === 0) return response;

          try {
            await Eleve.destroy({ where: { id_utilisateur: recordIds } });
            await Professeur.destroy({ where: { id_utilisateur: recordIds } });
          } catch (error) {
            console.error(`Erreur suppression profils pour utilisateurs ${recordIds.join(', ')}:`, error);
          }

          return response;
        },
      },
    },
  },
};

module.exports = utilisateurResource;*/



//V.2
/*
const Utilisateur = require('../../Models/Utilisateur');
const Role = require('../../Models/Role');
const Eleve = require('../../Models/Eleve');
const Professeur = require('../../Models/Professeur');
const Admin = require('../../Models/Admin'); // à créer si pas encore

const utilisateurResource = {
  resource: Utilisateur,
  options: {
    properties: {
      nom: { isTitle: true },
      mot_de_passe: {
        isVisible: { list: false, show: false, edit: true, filter: false },
      },
      id_role: {
        reference: 'role',
        isVisible: { list: true, show: true, edit: true, filter: true },
        isRequired: false,
        label: 'Rôle',
      },
      photo: {
        components: {
          edit: 'MyPhotoUploadComponent',
        },
      },
    },
    listProperties: ['id_utilisateur', 'prenom', 'nom', 'email', 'id_role', 'photo'],
    editProperties: ['prenom', 'nom', 'email', 'id_role', 'mot_de_passe', 'photo'],
    filterProperties: ['id_role', 'email', 'nom'],
    actions: {},
    hooks: {
      after: {
        save: async (response, request, context) => {
          const { record } = context;
          if (!record || !record.isValid() || !record.id) return response;

          const userId = record.id;
          const currentRoleId = record.get('id_role') || record.params.id_role;

          if (!currentRoleId) {
            await Promise.all([
              Eleve.destroy({ where: { id_utilisateur: userId } }),
              Professeur.destroy({ where: { id_utilisateur: userId } }),
              Admin.destroy({ where: { id_utilisateur: userId } }),
            ]);
            return response;
          }

          try {
            const role = await Role.findByPk(currentRoleId);
            const roleName = role ? role.name.toLowerCase() : null;

            // Nettoyage complet avant création
            await Promise.all([
              Eleve.destroy({ where: { id_utilisateur: userId } }),
              Professeur.destroy({ where: { id_utilisateur: userId } }),
              Admin.destroy({ where: { id_utilisateur: userId } }),
            ]);

            if (roleName === 'eleve') {
              await Eleve.findOrCreate({ where: { id_utilisateur: userId }, defaults: { id_utilisateur: userId } });
            } else if (roleName === 'professeur') {
              await Professeur.findOrCreate({
                where: { id_utilisateur: userId },
                defaults: {
                  id_utilisateur: userId,
                  description: 'Description par défaut',
                  id_matiere: 1,
                  fonction: 'professeur',
                },
              });
            } else if (roleName === 'admin') {
              await Admin.findOrCreate({ where: { id_utilisateur: userId }, defaults: { id_utilisateur: userId } });
            }
          } catch (error) {
            console.error(`Erreur synchronisation profil utilisateur ${userId}:`, error);
          }

          return response;
        },

        delete: async (response, request, context) => {
          const recordIds = context.recordIds || [];
          if (recordIds.length === 0) return response;

          try {
            await Promise.all([
              Eleve.destroy({ where: { id_utilisateur: recordIds } }),
              Professeur.destroy({ where: { id_utilisateur: recordIds } }),
              Admin.destroy({ where: { id_utilisateur: recordIds } }),
            ]);
          } catch (error) {
            console.error(`Erreur suppression profils pour utilisateurs ${recordIds.join(', ')}:`, error);
          }

          return response;
        },
      },
    },
  },
};

module.exports = utilisateurResource;
*/
///dernier fichier e hier soir, pas d'erreur mais non fonctionnel
/*const Utilisateur = require('../../Models/Utilisateur');
const RoleService = require('../../Services/RoleService');

const utilisateurResource = {
  resource: Utilisateur,
  options: {
    properties: {
      nom: { isTitle: true },
      mot_de_passe: {
        isVisible: { list: false, show: false, edit: true, filter: false },
      },
      id_role: {
        reference: 'role',
        isVisible: { list: true, show: true, edit: true, filter: true },
        isRequired: false,
        label: 'Rôle',
      },
      photo: {
        components: {
          edit: 'MyPhotoUploadComponent',
        },
      },
    },
    listProperties: ['id_utilisateur', 'prenom', 'nom', 'email', 'id_role', 'photo'],
    editProperties: ['prenom', 'nom', 'email', 'id_role', 'mot_de_passe', 'photo'],
    filterProperties: ['id_role', 'email', 'nom'],
    actions: {},
    hooks: {
      after: {
        save: async (response, request, context) => {
          const { record } = context;
          if (!record || !record.isValid() || !record.id) return response;

          const userId = record.id;
          const currentRoleId = record.get('id_role') ?? record.params.id_role;

          try {
            // Synchronisation du rôle avec logique future (ex: relation personnalisée)
            await RoleService.syncUserRole?.(userId, currentRoleId);
          } catch (error) {
            console.error(`Erreur lors de la synchronisation du rôle de l’utilisateur ${userId} :`, error);
          }

          return response;
        },

        delete: async (response, request, context) => {
          const recordIds = context.recordIds || (context.record ? [context.record.id] : []);
          if (recordIds.length === 0) return response;

          try {
            await RoleService.removeUserRoles?.(recordIds);
          } catch (error) {
            console.error(`Erreur lors de la suppression des profils utilisateurs ${recordIds.join(', ')} :`, error);
          }

          return response;
        },
      },
    },
  },
};

module.exports = utilisateurResource;*/

const Utilisateur = require('../../Models/Utilisateur');
const RoleService = require('../../Services/RoleService');

const utilisateurResource = {
  resource: Utilisateur,
  options: {
    properties: {
      nom: { isTitle: true },
      mot_de_passe: {
        isVisible: { list: false, show: false, edit: true, filter: false },
      },
      id_role: {
        reference: 'role',
        isVisible: { list: true, show: true, edit: true, filter: true },
        isRequired: false,
        label: 'Rôle',
      },
      photo: {
        components: {
          edit: 'MyPhotoUploadComponent',
        },
      },
    },
    listProperties: ['id_utilisateur', 'prenom', 'nom', 'email', 'id_role', 'photo'],
    editProperties: ['prenom', 'nom', 'email', 'id_role', 'mot_de_passe', 'photo'],
    filterProperties: ['id_role', 'email', 'nom'],
    actions: {
      edit: {
        after: async (response, request, context) => {
          const { record } = context;
          if (!record || !record.isValid() || !record.id()) return response;

          const userId = record.id();
          const currentRoleId = record.get('id_role') ?? record.params.id_role;

          try {
            console.log(`→ syncUserRole appelé : userId = ${userId}, roleId = ${currentRoleId}`);
            await RoleService.syncUserRole?.(userId, currentRoleId);
          } catch (error) {
            console.error(`Erreur lors de la synchronisation du rôle de l’utilisateur ${userId} :`, error);
          }

          return response;
        },
      },
      delete: {
        after: async (response, request, context) => {
          const recordIds = context.recordIds || (context.record ? [context.record.id()] : []);
          if (recordIds.length === 0) return response;

          try {
            await RoleService.removeUserRoles?.(recordIds);
          } catch (error) {
            console.error(`Erreur lors de la suppression des profils utilisateurs ${recordIds.join(', ')} :`, error);
          }

          return response;
        },
      },
    },
  },
};

module.exports = utilisateurResource;






























