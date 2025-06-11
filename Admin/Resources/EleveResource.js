/*const Eleve = require('../../Models/Eleve');

module.exports = {
  resource: Eleve,
  options: {
    
    properties: {
      id_eleve: { isTitle: true },
      id_utilisateur: { reference: 'utilisateur' },
      id_maison: { reference: 'maison' },
      id_annee: { reference: 'annee_etude' },
      /*id_maison_prefet: {
        reference: 'maison',
        isVisible: { list: true, edit: true, filter: true, show: true },
      },*/
  /*  },
     
    listProperties: ['id_eleve', 'id_utilisateur', 'id_maison', 'id_annee','id_maison_prefet'],
    editProperties: ['id_utilisateur', 'id_maison', 'id_annee','id_maison_prefet'],
  },
};*/


///fichier valable avant les modif
/*
const Eleve = require('../../Models/Eleve');

module.exports = {
  resource: Eleve,
  options: {
    properties: {
      id_eleve: { isTitle: true },
      id_utilisateur: { reference: 'utilisateur' },
      id_maison: { reference: 'maison' },
      id_annee_etude: { reference: 'annee_etude' },
    },
    listProperties: ['id_eleve', 'id_maison', 'id_annee_etude'],
    editProperties: [ 'id_maison', 'id_annee_etude'],
  },
};*/
const Eleve = require('../../Models/Eleve');

module.exports = {
  resource: Eleve,
  options: {
    properties: {
      id_eleve: { isTitle: true },
      id_maison: { reference: 'maison' },
      id_annee_etude: { reference: 'annee_etude' },

      // Champs virtuels pour afficher nom et prénom depuis utilisateur lié
      'utilisateur.nom': {
        isVisible: { list: true, filter: true, show: true, edit: false },
      },
      'utilisateur.prenom': {
        isVisible: { list: true, filter: true, show: true, edit: false },
      },
    },
    listProperties: ['id_eleve', 'utilisateur.nom', 'utilisateur.prenom', 'id_maison', 'id_annee_etude'],
    editProperties: ['id_maison', 'id_annee_etude', 'contact_parent'],
  },
};
