/*// models/index.js
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize'); // N'oubliez pas d'importer Sequelize
const sequelize = require('../Config/sequelize'); // Votre instance Sequelize

const db = {};

// Lecture de tous les fichiers dans le dossier Models (sauf index.js et Associations.js)
fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file !== 'index.js' &&
      file !== 'Associations.js' &&
      file.endsWith('.js')
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file));
    // Assurez-vous d'utiliser le nom du modèle défini dans Sequelize (model.name)
    // C'est généralement le nom de la classe, ex: AnneeEtude, Matiere
    db[model.name] = model;
  });

// Charger les associations définies dans le fichier Associations.js
// C'est cette ligne qui va définir toutes les associations (belongsTo, hasMany, belongsToMany, etc.)
// en appelant la fonction exportée par Associations.js et en lui passant l'objet 'db' complet.
require('./Associations')(db); // Assurez-vous que le chemin est correct

db.sequelize = sequelize; // Exporter l'instance Sequelize elle-même
db.Sequelize = Sequelize; // Exporter la classe Sequelize (peut être utile)

module.exports = db; // Exporter l'objet db contenant tous les modèles avec leurs associations*/
// backend/Models/index.js
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize'); // N'oubliez pas d'importer Sequelize
const sequelize = require('../Config/sequelize'); // Votre instance Sequelize

const db = {};

// --- MODIFICATION ICI : Importez et assignez explicitement chaque modèle ---
// C'est la méthode la plus robuste pour s'assurer que les modèles sont correctement chargés
// et nommés dans l'objet 'db' avant de passer aux associations.
db.Utilisateur = require('./Utilisateur');
db.Professeur = require('./Professeur');
db.Matiere = require('./Matiere');
db.Eleve = require('./Eleve');
db.Admin = require('./Admin');
db.AnneeEtude = require('./AnneeEtude');
db.Maison = require('./Maison');
db.Note = require('./Note');
db.EleveMatiere = require('./EleveMatiere'); // <-- S'assure que EleveMatiere est correctement assigné
db.AnneeEtudeMatiere = require('./AnneeEtudeMatiere');
db.Concours = require('./Concours');
db.Role = require('./Role'); // <-- S'assure que Role est correctement assigné
db.Bdc = require('./Bdc'); // N'oubliez pas Bdc si vous l'utilisez dans Associations.js

// --- Les modèles sont maintenant dans l'objet 'db' avec leurs noms de classe PascalCase ---
// Par exemple: db.Role contient le modèle Role, db.EleveMatiere contient le modèle EleveMatiere

// Charger les associations définies dans le fichier Associations.js
// C'est cette ligne qui va définir toutes les associations (belongsTo, hasMany, belongsToMany, etc.)
// en appelant la fonction exportée par Associations.js et en lui passant l'objet 'db' complet.
require('./Associations')(db); // Assurez-vous que le chemin est correct

db.sequelize = sequelize; // Exporter l'instance Sequelize elle-même
db.Sequelize = Sequelize; // Exporter la classe Sequelize (peut être utile)

module.exports = db; // Exporter l'objet db contenant tous les modèles avec leurs associations