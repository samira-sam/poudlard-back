const Vacances = require('../../Models/Vacances');

module.exports = {
  resource: Vacances,
  options: {
    properties: {
      id_vacances: { isTitle: true },
    },
    listProperties: ['id_vacances', 'info', 'date_debut', 'date_fin'],
    editProperties: ['info', 'date_debut', 'date_fin'],
  },
};

