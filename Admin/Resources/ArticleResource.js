const Article = require('../../Models/Article');

module.exports = {
  resource: Article,
  options: {
    properties: {
      id_article: { isTitle: true },
      photo: {
  components: {
    edit: 'MyPhotoUploadComponent', // <-- C'EST LA LIGNE CLÉ. C'est l'ALIAS, pas un appel de fonction.
  },
},
    },
    listProperties: ['id_article', 'nom', 'prix','photo'],
    editProperties: ['nom', 'prix', 'photo'],
  },
};
