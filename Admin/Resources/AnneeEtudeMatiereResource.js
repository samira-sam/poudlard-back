const AnneeEtudeMatiereResource = require('../../Models/AnneeEtudeMatiere');

module.exports = {
  resource: AnneeEtudeMatiereResource,
  options: {
    properties: {
      id: { isVisible: false }, // Empêche AdminJS d'afficher la colonne `id` inexistante
    },
    listProperties: ['id_annee_etude', 'id_matiere'],
    showProperties: ['id_annee_etude', 'id_matiere'],
    editProperties: ['id_annee_etude', 'id_matiere'],
    filterProperties: ['id_annee_etude', 'id_matiere'],
    actions: {
      new: { isAccessible: true },
      edit: { isAccessible: true },
      delete: { isAccessible: true },
      list: { isAccessible: true },
      show: { isAccessible: true },
    },
  },
}


