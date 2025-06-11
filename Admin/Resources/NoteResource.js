const Note = require('../../Models/Note');

module.exports = {
  resource: Note,
  options: {
    properties: {
      id_note: { isTitle: true },
      id_eleve: { reference: 'eleve' },
      id_professeur: { reference: 'professeur' },
      id_matiere: { reference: 'matiere' },
    },
    listProperties: ['id_note', 'valeur','commentaire', 'id_eleve', 'id_professeur', 'id_matiere','date_note'],
    editProperties: ['valeur','commentaire', 'id_eleve', 'id_professeur', 'id_matiere','date_note'],
  },
};
