// RoleRessource.js
const Role = require('../../Models/Role'); // Assurez-vous que le chemin est correct

const RoleResource = {
  resource: Role,
  options: {
    properties: {
      // Définissez id_role comme propriété, même si non visible
      id_role: {
        isVisible: false, // Cache la colonne dans l'interface AdminJS
        // C'est souvent une bonne idée de laisser isVisible.show: true pour le débogage
        // isVisible: { list: false, show: true, edit: false, filter: false },
      },
      name: {
        isTitle: true, // Utilisé comme titre pour les enregistrements de rôle
      },
    },
    listProperties: ['id_role','name'],
    editProperties: [ 'id_role','name'],
  },
  id: 'role', // TRÈS IMPORTANT : force l'ID de la ressource AdminJS à 'role' (minuscule)
};

module.exports = RoleResource;
