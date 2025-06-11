const AnneeEtude = require('../../Models/AnneeEtude');
const Matiere = require('../../Models/Matiere');
const { updateAnneeEtudeMatieres } = require('../hooks/UpdateAnneeEtudeMatieres');

module.exports = {
  resource: AnneeEtude,
  options: {
    properties: {
      id_annee_etude: { isTitle: true },
      matieresEnseignees: {
        type: 'reference',
        isArray: true,
        reference: 'matiere', // doit correspondre au nom du resource Matiere dans AdminJS (en minuscules)
        isVisible: { list: true, filter: true, show: true, edit: true },
      },
    },
    listProperties: ['id_annee_etude', 'nom', 'description', 'matieresEnseignees'],
    editProperties: ['nom', 'description', 'matieresEnseignees'],
    actions: {
      edit: {
        after: updateAnneeEtudeMatieres,
      },
      new: {
        after: updateAnneeEtudeMatieres,
      },
    },
  },
}; 