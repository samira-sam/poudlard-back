const Buse = require('../../Models/Buse');

module.exports = {
  resource: Buse,
  options: {
    properties: {
       
      id_buse: { isTitle: true },
    },
    listProperties: ['id_buse', 'info', 'date'],
    editProperties: ['info', 'date'],
  },
};
