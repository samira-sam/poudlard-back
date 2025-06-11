const Maison = require('../../Models/Maison');

const MaisonResource = {
  resource: Maison,
  options: {
    properties: {
      id_maison: { isTitle: true },
      id_prefet: { type: 'number', isVisible: false },
      id_directeur: { type: 'number', isVisible: false },

       photo: {
        components: {
          // L'alias 'MyPhotoUploadComponent' (défini dans Admin/index.js via componentLoader.add)
          // est utilisé ici pour référencer le composant.
          edit: 'MyPhotoUploadComponent', // <--- C'est la façon correcte de le référencer ici !
        },
        // Vous pouvez ajouter d'autres options si nécessaire
      },
    },//ajout eleve prefet , prof directeur
    id_prefet: {
  reference: 'eleve',
  isVisible: { list: true, edit: true, filter: true, show: true },
  label: 'Élève préfet',
},

id_directeur: {
  reference: 'professeur',
  isVisible: { list: true, edit: true, filter: true, show: true },
  label: 'Professeur directeur',
},

    listProperties: ['id_maison', 'nom', 'embleme', 'couleurs',"histoire",'photo','id_prefet', 'id_directeur'],
    editProperties: ['nom', 'histoire', 'embleme', 'couleurs','photo', 'id_prefet', 'id_directeur'],
  },
};

module.exports = MaisonResource;
/*const Maison = require('../../Models/Maison');

const MaisonResource = {
  resource: Maison,
  options: {
    properties: {
      id_maison: { isTitle: true },

      // Affichage des relations vers élève et professeur
      id_prefet: {
        reference: 'eleve',
        isVisible: { list: true, edit: true, filter: true, show: true },
        label: 'Élève préfet',
      },
      id_directeur: {
        reference: 'professeur',
        isVisible: { list: true, edit: true, filter: true, show: true },
        label: 'Professeur directeur',
      },
    },

    listProperties: [
      'id_maison',
      'nom',
      'embleme',
      'couleurs',
      'histoire',
      'photo',
      'id_prefet',
      'id_directeur'
    ],

    editProperties: [
      'nom',
      'histoire',
      'embleme',
      'couleurs',
      'photo',
      'id_prefet',
      'id_directeur'
    ],
  },
};

module.exports = MaisonResource;*/

/*const path = require('path');
const Maison = require('../../Models/Maison');

// 🔧 Import propre et compatible d'@adminjs/upload
const AdminJSUpload = require('@adminjs/upload');
const uploadFeature = AdminJSUpload.default || AdminJSUpload;

const MaisonResource = {
  resource: Maison,
  options: {
    properties: {
      id_maison: { isTitle: true },
      id_prefet: {
        reference: 'eleve',
        isVisible: { list: true, edit: true, filter: true, show: true },
        label: 'Élève préfet',
      },
      id_directeur: {
        reference: 'professeur',
        isVisible: { list: true, edit: true, filter: true, show: true },
        label: 'Professeur directeur',
      },
      photo: {
        isVisible: { list: true, edit: true, filter: false, show: true },
      },
    },
    listProperties: [
      'id_maison',
      'nom',
      'embleme',
      'couleurs',
      'histoire',
      'photo',
      'id_prefet',
      'id_directeur',
    ],
    editProperties: [
      'nom',
      'histoire',
      'embleme',
      'couleurs',
      'photo',
      'id_prefet',
      'id_directeur',
    ],
  },

  // 📁 Ajout de la fonctionnalité upload
  features: [
    uploadFeature({
      provider: {
        local: {
          bucket: path.join(__dirname, '..', '..', 'public', 'uploads', 'maisons'),
        },
      },
      properties: {
        key: 'photo', // nom de la colonne dans la BDD
        mimeType: 'mimeType',
        size: 'size',
        filename: 'filename',
        file: 'uploadFile', // utilisé par AdminJS
      },
      uploadPath: (record, filename) => `maisons/${filename}`,
    }),
  ],
};

module.exports = MaisonResource;*/
