

module.exports = (db) => {
  const {
    Utilisateur,
    Professeur,
    Eleve,
    Admin,
    AnneeEtude,
    Matiere,
    Maison,
    Note,
    EleveMatiere,
    AnneeEtudeMatiere,
    Concours,
    Role,
  } = db;

  // DEBUG : Affiche tous les modèles chargés
  console.log('DEBUG MODELS :', {
    Utilisateur,
    Professeur,
    Eleve,
    Admin,
    AnneeEtude,
    Matiere,
    Maison,
    Note,
    EleveMatiere,
    AnneeEtudeMatiere,
    Concours,
    Role,
  });

  // RELATION UTILISATEUR <-> ROLE (1 Role a plusieurs Utilisateurs)
  Role.hasMany(Utilisateur, {
    foreignKey: 'id_role',
    as: 'utilisateurs',
  });
  Utilisateur.belongsTo(Role, {
    foreignKey: 'id_role',
    as: 'role',
  });

  // UTILISATEUR <-> ADMIN (1 Utilisateur a 1 Admin)
  Utilisateur.hasOne(Admin, {
    foreignKey: 'id_admin',
    sourceKey: 'id_utilisateur',
    as: 'admin',
    onDelete: 'CASCADE',
  });
  Admin.belongsTo(Utilisateur, {
    foreignKey: 'id_admin',
    targetKey: 'id_utilisateur',
    as: 'utilisateur',
  });

  // UTILISATEUR <-> PROFESSEUR (1 Utilisateur a 1 Professeur)
  Utilisateur.hasOne(Professeur, {
    foreignKey: 'id_professeur',
    sourceKey: 'id_utilisateur',
    as: 'professeur',
    onDelete: 'CASCADE',
  });
  Professeur.belongsTo(Utilisateur, {
    foreignKey: 'id_professeur',
    targetKey: 'id_utilisateur',
    as: 'utilisateur',
  });

  // UTILISATEUR <-> ELEVE (1 Utilisateur a 1 Eleve)
  Utilisateur.hasOne(Eleve, {
    foreignKey: 'id_eleve',
    sourceKey: 'id_utilisateur',
    as: 'eleve',
    onDelete: 'CASCADE',
  });
  Eleve.belongsTo(Utilisateur, {
    foreignKey: 'id_eleve',
    targetKey: 'id_utilisateur',
    as: 'utilisateur',
  });

  // PROFESSEUR <-> MATIERE (Un professeur enseigne une seule matière)
  Professeur.belongsTo(Matiere, {
    foreignKey: 'id_matiere',
    as: 'matiereEnseignee',
  });

  // PROFESSEUR <-> NOTE (1 Professeur donne plusieurs Notes)
  Professeur.hasMany(Note, {
    foreignKey: 'id_professeur',
    as: 'notesDonnees',
  });
  Note.belongsTo(Professeur, {
    foreignKey: 'id_professeur',
    as: 'professeurEvaluateur',
  });

  // ELEVE <-> NOTE (1 Eleve reçoit plusieurs Notes)
  Eleve.hasMany(Note, {
    foreignKey: 'id_eleve',
    as: 'notesRecues',
    onDelete: 'CASCADE', // <-- AJOUTE CETTE LIGNE
    hooks: true // IMPORTANT: Pour que Sequelize gère la cascade au niveau de l'application si non configuré dans la DB
  });
  Note.belongsTo(Eleve, {
    foreignKey: 'id_eleve',
    onDelete: 'CASCADE', // supprime les notes si l'élève est supprimé
    as: 'eleveEvalue',
  });

  // ELEVE <-> MATIERE (Many-to-Many via EleveMatiere)
  Eleve.belongsToMany(Matiere, {
    through: EleveMatiere,
    foreignKey: 'id_eleve',
    otherKey: 'id_matiere',
    as: 'matieresSuivies',
  });
  Matiere.belongsToMany(Eleve, {
    through: EleveMatiere,
    foreignKey: 'id_matiere',
    otherKey: 'id_eleve',
    as: 'elevesInscrits',
  });

  // ELEVE <-> ANNEE_ETUDE (Un élève est dans une année d'étude)
  Eleve.belongsTo(AnneeEtude, {
    foreignKey: 'id_annee_etude',
    as: 'anneeEtude',
  });
  AnneeEtude.hasMany(Eleve, {
    foreignKey: 'id_annee_etude',
    as: 'eleves',
  });



  // **CHANGEMENTS POUR MAISON <-> DIRECTEUR/PREFET**

  // MAISON <-> UTILISATEUR (Directeur de Maison)
  // La colonne id_directeur de Maison référence directement l'ID d'un Utilisateur.
  // Cela permet de récupérer les infos complètes de l'Utilisateur (nom, prénom, photo) en une seule inclusion.
  Maison.belongsTo(Utilisateur, {
    foreignKey: 'id_directeur',
    as: 'directeur', // L'alias 'directeur' pointe maintenant vers le modèle Utilisateur
  });
  // Relation inverse (optionnelle, mais bonne pratique)
  Utilisateur.hasOne(Maison, {
    foreignKey: 'id_directeur',
    as: 'maisonDirigee',
  });

  // MAISON <-> UTILISATEUR (Préfet de Maison)
  // La colonne id_prefet de Maison référence directement l'ID d'un Utilisateur.
  // Cela permet de récupérer les infos complètes de l'Utilisateur (nom, prénom, photo) en une seule inclusion.
  Maison.belongsTo(Utilisateur, {
    foreignKey: 'id_prefet',
    as: 'prefet', // L'alias 'prefet' pointe maintenant vers le modèle Utilisateur
  });
  // Relation inverse (optionnelle, mais bonne pratique)
  Utilisateur.hasOne(Maison, {
    foreignKey: 'id_prefet',
    as: 'maisonPrefet',
  });



  // MAISON <-> ELEVE (Résidents) - Cette association est correcte et n'a pas été modifiée
  Maison.hasMany(Eleve, {
    foreignKey: 'id_maison',
    as: 'eleves',
  });
  Eleve.belongsTo(Maison, {
    foreignKey: 'id_maison',
    as: 'maison',
  });

  // ANNEE_ETUDE <-> MATIERE (Many-to-Many via AnneeEtudeMatiere)
  AnneeEtude.belongsToMany(Matiere, {
    through: 'AnneeEtudeMatiere',
    foreignKey: 'id_annee_etude',
    otherKey: 'id_matiere',
    as: 'matieresEnseignees',

  });
  Matiere.belongsToMany(AnneeEtude, {
    through: 'AnneeEtudeMatiere',
    foreignKey: 'id_matiere',
    otherKey: 'id_annee_etude',
    as: 'anneesEtude',

  });

  // CONCOURS <-> ANNEE_ETUDE
  Concours.belongsTo(AnneeEtude, {
    foreignKey: 'id_annee_etude',
    as: 'anneeEtude',
  });
  AnneeEtude.hasMany(Concours, {
    foreignKey: 'id_annee_etude',
    as: 'concours',
  });
};
/*// backend/Models/Associations.js
// backend/Models/Associations.js

module.exports = (db) => {
  const {
    Utilisateur,
    Professeur,
    Eleve,
    Admin,
    AnneeEtude,
    Matiere,
    Maison,
    Note,
    EleveMatiere,
    AnneeEtudeMatiere,
    Concours,
    Role,
    // Assurez-vous d'ajouter Bdc ici si vous l'utilisez dans des associations
    Bdc,
  } = db;

  // DEBUG : Affiche tous les modèles chargés TELS QUE REÇUS PAR CE FICHIER
  console.log('DEBUG MODELS received by Associations.js:', {
    Utilisateur,
    Professeur,
    Eleve,
    Admin,
    AnneeEtude,
    Matiere,
    Maison,
    Note,
    EleveMatiere,
    AnneeEtudeMatiere,
    Concours,
    Role,
    Bdc, // Incluez Bdc ici si pertinent
  });

  // RELATION UTILISATEUR <-> ROLE (1 Role a plusieurs Utilisateurs)
  // L'alias 'utilisateurs' a été changé pour 'utilisateursDuRole' pour éviter les doublons.
  Role.hasMany(Utilisateur, {
    foreignKey: 'id_role',
    as: 'utilisateursDuRole',
  });
  Utilisateur.belongsTo(Role, {
    foreignKey: 'id_role',
    as: 'role',
  });

  // UTILISATEUR <-> ADMIN (1 Utilisateur a 1 Admin)
  Utilisateur.hasOne(Admin, {
    foreignKey: 'id_admin',
    sourceKey: 'id_utilisateur',
    as: 'admin',
    onDelete: 'CASCADE',
  });
  Admin.belongsTo(Utilisateur, {
    foreignKey: 'id_admin',
    targetKey: 'id_utilisateur',
    as: 'utilisateurAdmin', // <-- CORRECTION : Alias unique
  });

  // UTILISATEUR <-> PROFESSEUR (1 Utilisateur a 1 Professeur)
  Utilisateur.hasOne(Professeur, {
    foreignKey: 'id_professeur',
    sourceKey: 'id_utilisateur',
    as: 'professeur',
    onDelete: 'CASCADE',
  });
  Professeur.belongsTo(Utilisateur, {
    foreignKey: 'id_professeur',
    targetKey: 'id_utilisateur',
    as: 'utilisateurProfesseur', // <-- CORRECTION : Alias unique
  });

  // UTILISATEUR <-> ELEVE (1 Utilisateur a 1 Eleve)
  Utilisateur.hasOne(Eleve, {
    foreignKey: 'id_eleve',
    sourceKey: 'id_utilisateur',
    as: 'eleve',
    onDelete: 'CASCADE',
  });
  Eleve.belongsTo(Utilisateur, {
    foreignKey: 'id_eleve',
    targetKey: 'id_utilisateur',
    as: 'utilisateurEleve', // <-- CORRECTION : Alias unique
  });

  // PROFESSEUR <-> MATIERE (Un professeur enseigne une seule matière)
  Professeur.belongsTo(Matiere, {
    foreignKey: 'id_matiere',
    as: 'matiereEnseignee',
  });

  // PROFESSEUR <-> NOTE (1 Professeur donne plusieurs Notes)
  Professeur.hasMany(Note, {
    foreignKey: 'id_professeur',
    as: 'notesDonnees',
  });
  Note.belongsTo(Professeur, {
    foreignKey: 'id_professeur',
    as: 'professeurEvaluateur',
  });

  // ELEVE <-> NOTE (1 Eleve reçoit plusieurs Notes)
  Eleve.hasMany(Note, {
    foreignKey: 'id_eleve',
    as: 'notesRecues',
    onDelete: 'CASCADE',
    hooks: true
  });
  Note.belongsTo(Eleve, {
    foreignKey: 'id_eleve',
    onDelete: 'CASCADE',
    as: 'eleveEvalue',
  });

  // ELEVE <-> MATIERE (Many-to-Many via EleveMatiere)
  Eleve.belongsToMany(Matiere, {
    through: EleveMatiere,
    foreignKey: 'id_eleve',
    otherKey: 'id_matiere',
    as: 'matieresSuivies',
  });
  Matiere.belongsToMany(Eleve, {
    through: EleveMatiere,
    foreignKey: 'id_matiere',
    otherKey: 'id_eleve',
    as: 'elevesInscrits',
  });

  // ELEVE <-> ANNEE_ETUDE (Un élève est dans une année d'étude)
  Eleve.belongsTo(AnneeEtude, {
    foreignKey: 'id_annee_etude',
    as: 'anneeEtude',
  });
  AnneeEtude.hasMany(Eleve, {
    foreignKey: 'id_annee_etude',
    as: 'eleves',
  });

  // MAISON <-> UTILISATEUR (Directeur de Maison)
  Maison.belongsTo(Utilisateur, {
    foreignKey: 'id_directeur',
    as: 'directeur',
  });
  Utilisateur.hasOne(Maison, {
    foreignKey: 'id_directeur',
    as: 'maisonDirigee',
  });

  // MAISON <-> UTILISATEUR (Préfet de Maison)
  Maison.belongsTo(Utilisateur, {
    foreignKey: 'id_prefet',
    as: 'prefet',
  });
  Utilisateur.hasOne(Maison, {
    foreignKey: 'id_prefet',
    as: 'maisonPrefet',
  });

  // MAISON <-> ELEVE (Résidents)
  Maison.hasMany(Eleve, {
    foreignKey: 'id_maison',
    as: 'eleves',
  });
  Eleve.belongsTo(Maison, {
    foreignKey: 'id_maison',
    as: 'maison',
  });

  // ANNEE_ETUDE <-> MATIERE (Many-to-Many via AnneeEtudeMatiere)
  AnneeEtude.belongsToMany(Matiere, {
    through: AnneeEtudeMatiere,
    foreignKey: 'id_annee_etude',
    otherKey: 'id_matiere',
    as: 'matieresEnseignees',
  });
  Matiere.belongsToMany(AnneeEtude, {
    through: AnneeEtudeMatiere,
    foreignKey: 'id_matiere',
    otherKey: 'id_annee_etude',
    as: 'anneesEtude',
  });

  // CONCOURS <-> ANNEE_ETUDE
  Concours.belongsTo(AnneeEtude, {
    foreignKey: 'id_annee_etude',
    as: 'anneeEtude',
  });
  AnneeEtude.hasMany(Concours, {
    foreignKey: 'id_annee_etude',
    as: 'concours',
  });
};*/