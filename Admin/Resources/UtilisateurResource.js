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






























