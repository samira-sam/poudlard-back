const Bdc = require('../../Models/Bdc');

const BdcResource = {
  resource: Bdc,
  options: {
    properties: {
      id_bdc: {
        isVisible: { list: true, show: true, edit: false, filter: true },
      },
      nom: {
        isVisible: { list: true, show: true, edit: true, filter: true },
        isTitle: true,
      },
      pdf: {
        isVisible: { list: true, show: true, edit: true, filter: false },
        components: {
          // Utiliser uniquement les alias des composants déclarés dans admin/index.js
          edit: 'PDFUploadComponent',       // alias pour le composant d'upload PDF
          list: 'PDFLinkListComponent',     // alias pour afficher lien dans la liste
          show: 'PDFLinkShowComponent',     // alias pour afficher lien dans le détail
        },
      },
    },
    listProperties: ['id_bdc', 'nom', 'pdf'],
    editProperties: ['nom', 'pdf'],
    filterProperties: ['id_bdc', 'nom'],
  },
  id: 'bdc',
};

module.exports = BdcResource;
