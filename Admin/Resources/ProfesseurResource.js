/*const Professeur = require('../../Models/Professeur');

module.exports = {
  resource: Professeur,
  options: {
    properties: {
      id_professeur: { isTitle: true },
      id_matiere: {
        reference: 'matiere',
        isVisible: { list: true, edit: true, filter: true, show: true },
      },
      id_maison_directeur: {
        reference: 'maison',
        isVisible: { list: true, edit: true, filter: true, show: true },
      },
      fonction: {
        isVisible: { list: true, edit: true, filter: true, show: true },
      },
    },
    listProperties: [
      'id_professeur',
      'fonction',         // 👈 Ajouté ici
      'description',
      'id_matiere',
      'id_maison_directeur',
    ],
    editProperties: [
      'fonction',          // 👈 Ajouté ici
      'description',
      'id_matiere',
      'id_maison_directeur',
    ],
  },
};*/
const Professeur = require('../../Models/Professeur');

module.exports = {
  resource: Professeur,
  options: {
    properties: {
      id_professeur: { isTitle: true },
      id_matiere: {
        reference: 'matiere',
        isVisible: { list: true, edit: true, filter: true, show: true },
      },
      fonction: {
        isVisible: { list: true, edit: true, filter: true, show: true },
      },
    },
    listProperties: [
      'id_professeur',
      'fonction',
      'description',
      'id_matiere',
      
    ],
    editProperties: [
      'fonction',
      'description',
      'id_matiere',
    ],
  },
};
