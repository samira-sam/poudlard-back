const Matiere = require('../../Models/Matiere');

module.exports = {
  resource: Matiere,
  options: {
    properties: {
      id_matiere: { isTitle: true },
     photo: {
  components: {
    edit: 'MyPhotoUploadComponent', // <-- C'EST LA LIGNE CLÉ. C'est l'ALIAS, pas un appel de fonction.
  },
},
      
    },
    listProperties: ['id_matiere', 'nom', 'description','photo'],
    editProperties: ['nom', 'description','photo'],
  },
};
