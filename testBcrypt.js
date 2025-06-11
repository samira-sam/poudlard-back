const bcrypt = require('bcrypt');

const hash = '$2b$10$ylTuiPk0Si94/TmLitLZgOLLvwSjyHD7DPa4ElqaYPfRxxiGPxmhK'; // hash récupéré de la DB
const motDePasse = 'samira';

bcrypt.compare(motDePasse, hash).then(result => {
  console.log('Correspondance mot de passe/hash:', result);
}).catch(err => {
  console.error('Erreur bcrypt.compare:', err);
});
