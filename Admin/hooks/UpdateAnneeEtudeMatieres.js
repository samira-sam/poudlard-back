
const AnneeEtude = require('../../Models/AnneeEtude');

const updateAnneeEtudeMatieres = async (response, request, context) => {
  console.log('Hook updateAnneeEtudeMatieres appelé');
  console.log('Payload complet:', request.payload);

  const { record } = context;
  const payload = request.payload || {};

  if (record.isValid()) {
    let selectedMatiereIds = [];

    // Cas normal où matieresEnseignees est un tableau ou une seule valeur
    if (payload.matieresEnseignees) {
      if (Array.isArray(payload.matieresEnseignees)) {
        selectedMatiereIds = payload.matieresEnseignees;
      } else {
        selectedMatiereIds = [payload.matieresEnseignees];
      }
    }
    // Cas où c'est sous forme 'matieresEnseignees[]'
    else if (payload['matieresEnseignees[]']) {
      if (Array.isArray(payload['matieresEnseignees[]'])) {
        selectedMatiereIds = payload['matieresEnseignees[]'];
      } else {
        selectedMatiereIds = [payload['matieresEnseignees[]']];
      }
    }
    // Cas où la clé est mal formatée comme 'matieresEnseignees.0', 'matieresEnseignees.1' etc.
    else {
      selectedMatiereIds = Object.keys(payload)
        .filter(key => key.startsWith('matieresEnseignees.'))
        .map(key => payload[key]);
    }

    console.log('Matières sélectionnées :', selectedMatiereIds);

    try {
      const annee = await AnneeEtude.findByPk(record.param('id_annee_etude'));
      if (annee && typeof annee.setMatieresEnseignees === 'function') {
        await annee.setMatieresEnseignees(selectedMatiereIds);
        console.log('Matières associées mises à jour');
      } else {
        console.log('Erreur : instance année ou méthode setMatieresEnseignees non trouvée');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour des matières associées :', error);
    }
  }
  return response;
};

module.exports = { updateAnneeEtudeMatieres };

