const InfoLivraison = require('../../Models/InfoLivraison');

module.exports = {
  resource: InfoLivraison,
  options: {
    properties: {
      id_info_livraison: { isTitle: true },
      id_utilisateur: { reference: 'utilisateur' },
    },
    listProperties: ['id_livraison', 'info'],
    editProperties: ['info'],
  },
};
