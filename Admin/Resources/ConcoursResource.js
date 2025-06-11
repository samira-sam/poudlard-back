const Concours = require('../../Models/Concours');

module.exports = {
  resource: Concours,
  options: {
    properties: {
      id_concours: { isTitle: true },
    },
    listProperties: ['id_concours', 'nom', 'info',"id_annee_etude",'date_debut', 'date_fin'],
    editProperties: ['nom',"id_annee_etude",'date_debut', 'date_fin'],
  },
};