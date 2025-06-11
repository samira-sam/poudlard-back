const Rentree = require('../../Models/Rentree');

module.exports = {
  resource: Rentree,
  options: {
    properties: {
      id_rentree: { isTitle: true },
    },
    listProperties: ['id_rentree','date','info'],
    editProperties: [ 'date','info'],
  },
};
