
const sequelize = require('../Config/sequelize');

// Import des ressources depuis le dossier resources
const ProfesseurResource = require('./Resources/ProfesseurResource');
const MaisonResource = require('./Resources/MaisonResource');
const MatiereResource = require('./Resources/MatiereResource');
const UtilisateurResource = require('./Resources/UtilisateurResource');
const EleveResource = require('./Resources/EleveResource');
const ArticleResource = require('./Resources/ArticleResource');
const VacancesResource = require('./Resources/VacancesResource');
const RentreeResource = require('./Resources/RentreeResource');
const ConcoursResource = require('./Resources/ConcoursResource');
const BuseResource = require('./Resources/BuseResource');
const InfoLivraisonResource = require('./Resources/InfoLivraisonResource');
const NoteResource = require('./Resources/NoteResource');
const AnneeEtudeResource = require('./Resources/AnneeEtudeResource');
const AnneeEtudeMatiereResource = require('./Resources/AnneeEtudeMatiereResource');
const RoleResource = require('./Resources/RoleResource');

// Import du hook
const { updateAnneeEtudeMatieres } = require('./hooks/UpdateAnneeEtudeMatieres');

// --- SUPPRIMÉ/COMMENTÉ : Cette ligne est la cause de l'erreur ! ---
// const { ComponentLoader } = require('adminjs');

async function setupAdminJS() {
  const AdminJS = (await import('adminjs')).default;
  const AdminJSExpress = (await import('@adminjs/express')).default;
  const AdminJSSequelize = (await import('@adminjs/sequelize')).default;

  // --- AJOUTÉ : Importe ComponentLoader dynamiquement ici ---
  const { ComponentLoader } = await import('adminjs'); // <-- C'EST LA CORRECTION

  AdminJS.registerAdapter(AdminJSSequelize);

  // --- Initialise le ComponentLoader ---
  const componentLoader = new ComponentLoader();

  // On modifie ici la ressource AnneeEtudeResource pour y ajouter le hook dans les actions
  const AnneeEtudeResourceWithHook = {
    ...AnneeEtudeResource,
    options: {
      ...AnneeEtudeResource.options,
      actions: {
        ...AnneeEtudeResource.options?.actions,
        edit: {
          ...AnneeEtudeResource.options?.actions?.edit,
          after: updateAnneeEtudeMatieres,
        },
        new: {
          ...AnneeEtudeResource.options?.actions?.new,
          after: updateAnneeEtudeMatieres,
        },
      },
    },
  };

  const adminJs = new AdminJS({
    databases: [sequelize],
    rootPath: '/admin',
    componentLoader,
    resources: [
      {
        resource: UtilisateurResource.resource,
        options: {
          ...UtilisateurResource.options,
          properties: {
            ...UtilisateurResource.options?.properties,
            photo: {
              components: {
                edit: componentLoader.add('MyPhotoUploadComponent', './components/PhotoUploadComponent.jsx'),
              },
            },
          },
        },
      },
      RoleResource,
      ProfesseurResource,
      MaisonResource,
      MatiereResource,
      EleveResource,
      ArticleResource,
      VacancesResource,
      RentreeResource,
      ConcoursResource,
      BuseResource,
      InfoLivraisonResource,
      NoteResource,
      AnneeEtudeResourceWithHook,
      AnneeEtudeMatiereResource,
    ],
  });

  const adminRouter = AdminJSExpress.buildRouter(adminJs);
  return { adminJs, adminRouter };
}

module.exports = setupAdminJS;

/*const path = require('path');
const sequelize = require('../Config/sequelize');

// Import des ressources (sans AdminJS dedans)
const ProfesseurResource = require('./Resources/ProfesseurResource');
const MaisonResource = require('./Resources/MaisonResource');
const MatiereResource = require('./Resources/MatiereResource');
const UtilisateurResource = require('./Resources/UtilisateurResource');
const EleveResource = require('./Resources/EleveResource');
const ArticleResource = require('./Resources/ArticleResource');
const VacancesResource = require('./Resources/VacancesResource');
const RentreeResource = require('./Resources/RentreeResource');
const ConcoursResource = require('./Resources/ConcoursResource');
const BuseResource = require('./Resources/BuseResource');
const InfoLivraisonResource = require('./Resources/InfoLivraisonResource');
const NoteResource = require('./Resources/NoteResource');
const AnneeEtudeResource = require('./Resources/AnneeEtudeResource');
const AnneeEtudeMatiereResource = require('./Resources/AnneeEtudeMatiereResource');
const RoleResource = require('./Resources/RoleResource');
const BdcResource = require('./Resources/BdcResource');

// Import du hook
const { updateAnneeEtudeMatieres } = require('./hooks/UpdateAnneeEtudeMatieres');

async function setupAdminJS() {
  // Import dynamique des modules ESM
  const AdminJS = (await import('adminjs')).default;
  const AdminJSExpress = (await import('@adminjs/express')).default;
  const AdminJSSequelize = (await import('@adminjs/sequelize')).default;

  const { ComponentLoader } = await import('adminjs');

  AdminJS.registerAdapter(AdminJSSequelize);

  const componentLoader = new ComponentLoader();

  // Ressource AnneeEtude avec hook d'update
  const AnneeEtude = {
    resource: AnneeEtudeResource.resource,
    options: {
      ...AnneeEtudeResource.options,
      actions: {
        ...AnneeEtudeResource.options?.actions,
        edit: {
          ...AnneeEtudeResource.options?.actions?.edit,
          after: updateAnneeEtudeMatieres,
        },
        new: {
          ...AnneeEtudeResource.options?.actions?.new,
          after: updateAnneeEtudeMatieres,
        },
      },
    },
  };

 /* // Ressource Utilisateur avec composant photo upload changer 4juin 13h52
  const Utilisateur = {
    resource: UtilisateurResource.resource,
    options: {
      ...UtilisateurResource.options,
      properties: {
        ...UtilisateurResource.options?.properties,
        photo: {
          components: {
            edit: componentLoader.add(
              'MyPhotoUploadComponent',
              path.resolve(__dirname, './components/PhotoUploadComponent.jsx')
            ),
          },
        },
      },
    },
  };//meme code suite*/
/*const Utilisateur = {
  resource: UtilisateurResource.resource,
  options: {
    ...UtilisateurResource.options, // <-- Cette ligne copie déjà la plupart des options
    // MAINTENANT, assure-toi que les hooks sont fusionnés correctement
    // Nous allons réappliquer les hooks qui sont dans UtilisateurResource.options.hooks
    hooks: { // <-- Ajoute cette section 'hooks'
      ...UtilisateurResource.options.hooks, // <-- PROPAGE LES HOOKS ICI
      // Si tu avais des hooks spécifiques définis ICI pour Utilisateur,
      // tu les mettrais après pour qu'ils aient la priorité
    },
    properties: {
      ...UtilisateurResource.options?.properties,
      photo: {
        components: {
          edit: componentLoader.add(
            'MyPhotoUploadComponent',
            path.resolve(__dirname, './components/PhotoUploadComponent.jsx')
          ),
        },
      },
    },
  },
};



  // Ressource Bdc avec composant pdf upload
  const Bdc = {
    resource: BdcResource.resource,
    options: {
      ...BdcResource.options,
      properties: {
        ...BdcResource.options?.properties,
        pdf: {
          components: {
            edit: componentLoader.add(
              'PDFUploadComponent',
              path.resolve(__dirname, './components/PDFUploadComponent.jsx')
            ),
          },
        },
      },
    },
  };

  // Création de l’instance AdminJS
  const adminJs = new AdminJS({
    databases: [sequelize],
    rootPath: '/admin',
    componentLoader,
    resources: [
      Utilisateur,
      RoleResource,
      ProfesseurResource,
      MaisonResource,
      MatiereResource,
      EleveResource,
      ArticleResource,
      VacancesResource,
      RentreeResource,
      ConcoursResource,
      BuseResource,
      InfoLivraisonResource,
      NoteResource,
      AnneeEtude,
      AnneeEtudeMatiereResource,
      Bdc,
    ],
  });

  // Création du router Express AdminJS
  const adminRouter = AdminJSExpress.buildRouter(adminJs);

  return { adminJs, adminRouter };
}

module.exports = setupAdminJS;
*/


/*const path = require('path');
const sequelize = require('../Config/sequelize');

// Import des ressources (sans AdminJS dedans)
const ProfesseurResource = require('./Resources/ProfesseurResource');
const MaisonResource = require('./Resources/MaisonResource');
const MatiereResource = require('./Resources/MatiereResource');
const UtilisateurResource = require('./Resources/UtilisateurResource');
const EleveResource = require('./Resources/EleveResource');
const ArticleResource = require('./Resources/ArticleResource');
const VacancesResource = require('./Resources/VacancesResource');
const RentreeResource = require('./Resources/RentreeResource');
const ConcoursResource = require('./Resources/ConcoursResource');
const BuseResource = require('./Resources/BuseResource');
const InfoLivraisonResource = require('./Resources/InfoLivraisonResource');
const NoteResource = require('./Resources/NoteResource');
const AnneeEtudeResource = require('./Resources/AnneeEtudeResource');
const AnneeEtudeMatiereResource = require('./Resources/AnneeEtudeMatiereResource');
const RoleResource = require('./Resources/RoleResource');
const BdcResource = require('./Resources/BdcResource');

// Import du hook
const { updateAnneeEtudeMatieres } = require('./hooks/UpdateAnneeEtudeMatieres');

async function setupAdminJS() {
  // Import dynamique des modules ESM
  const AdminJS = (await import('adminjs')).default;
  const AdminJSExpress = (await import('@adminjs/express')).default;
  const AdminJSSequelize = (await import('@adminjs/sequelize')).default;

  const { ComponentLoader } = await import('adminjs');

  AdminJS.registerAdapter(AdminJSSequelize);

  const componentLoader = new ComponentLoader();

  // Ressource AnneeEtude avec hook d'update (ce bloc est correct et reste inchangé)
  const AnneeEtude = {
    resource: AnneeEtudeResource.resource,
    options: {
      ...AnneeEtudeResource.options,
      actions: {
        ...AnneeEtudeResource.options?.actions,
        edit: {
          ...AnneeEtudeResource.options?.actions?.edit,
          after: updateAnneeEtudeMatieres,
        },
        new: {
          ...AnneeEtudeResource.options?.actions?.new,
          after: updateAnneeEtudeMatieres,
        },
      },
    },
  };

  // --- DÉBUT DE LA SECTION CORRIGÉE POUR LA RESSOURCE UTILISATEUR ---
  // Nous allons construire l'objet 'options' de la ressource Utilisateur
  // en nous assurant que les hooks et les propriétés sont correctement fusionnés.

  // 1. Initialise l'objet options avec toutes les options par défaut de UtilisateurResource
  const UtilisateurOptions = { ...UtilisateurResource.options };

  // 2. S'assurer que la propriété 'hooks' existe dans UtilisateurOptions
  // et y fusionner les hooks définis dans UtilisateurResource.options.hooks.
  // Cela garantit que les hooks globaux (after:save, after:delete) sont présents.
  UtilisateurOptions.hooks = {
    ...(UtilisateurOptions.hooks || {}), // Copie les hooks existants ou initialise un objet vide
    // Si tu avais des hooks spécifiques à ajouter ICI (et non dans UtilisateurResource),
    // tu les mettrais après le '...' ici.
  };

  // 3. S'assurer que la propriété 'properties' existe dans UtilisateurOptions
  // et y fusionner les propriétés existantes, puis ajouter/modifier 'photo'.
  UtilisateurOptions.properties = {
    ...(UtilisateurOptions.properties || {}), // Copie les propriétés existantes ou initialise un objet vide
    photo: {
      components: {
        edit: componentLoader.add(
          'MyPhotoUploadComponent',
          path.resolve(__dirname, './components/PhotoUploadComponent.jsx')
        ),
      },
    },
  };

  // La ressource Utilisateur finale utilise cet objet d'options construit.
  const Utilisateur = {
    resource: UtilisateurResource.resource,
    options: UtilisateurOptions,
  };
  // --- FIN DE LA SECTION CORRIGÉE POUR LA RESSOURCE UTILISATEUR ---


  // Ressource Bdc avec composant pdf upload (ce bloc est correct et reste inchangé)
  const Bdc = {
    resource: BdcResource.resource,
    options: {
      ...BdcResource.options,
      properties: {
        ...BdcResource.options?.properties,
        pdf: {
          components: {
            edit: componentLoader.add(
              'PDFUploadComponent',
              path.resolve(__dirname, './components/PDFUploadComponent.jsx')
            ),
          },
        },
      },
    },
  };

  // Création de l’instance AdminJS
  const adminJs = new AdminJS({
    databases: [sequelize],
    rootPath: '/admin',
    componentLoader,
    resources: [
      Utilisateur, // Utilise la définition de Utilisateur que nous venons de construire
      RoleResource,
      ProfesseurResource,
      MaisonResource,
      MatiereResource,
      EleveResource,
      ArticleResource,
      VacancesResource,
      RentreeResource,
      ConcoursResource,
      BuseResource,
      InfoLivraisonResource,
      NoteResource,
      AnneeEtude,
      AnneeEtudeMatiereResource,
      Bdc,
    ],
  });

  // Création du router Express AdminJS
  const adminRouter = AdminJSExpress.buildRouter(adminJs);

  return { adminJs, adminRouter };
}

module.exports = setupAdminJS;*/