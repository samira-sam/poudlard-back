/*const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const path = require('path'); // <-- AJOUTÉ : Nécessaire pour gérer les chemins de fichiers
const fs = require('fs'); // <-- AJOUTÉ : Pour s'assurer que les dossiers d'upload existent

const app = express();
dotenv.config();

app.use(cors()); // public

// app.use(cors({ origin: "http://localhost:5175" })); // limitée a http://loclhost:5175
app.use(bodyParser.json());

// SERVIT DES FICHIERS STATIQUES (IMAGES, ETC.)
// Toutes les requêtes vers /images/ seront servies depuis le dossier public/images
app.use('/images', express.static('public/images/professeurs/'));
// <-- AJOUTÉ : Route pour servir les images uploadées via Multer
app.use('/uploads/images', express.static(path.join(__dirname, 'public', 'uploads', 'images')));




// Sequelize
const sequelize = require("./Config/sequelize");

// --- IMPORTANT : Importez TOUS vos modèles ici, ou au moins ceux utilisés dans vos associations ---
// C'est nécessaire pour que le fichier d'associations puisse y faire référence.
const Utilisateur = require('./Models/Utilisateur');
const Professeur = require('./Models/Professeur');
const Matiere = require('./Models/Matiere');
const Eleve = require('./Models/Eleve');
const Admin = require('./Models/Admin');
const AnneeEtude = require('./Models/AnneeEtude');
const Maison = require('./Models/Maison');
const Note = require('./Models/Note');
const EleveMatiere = require('./Models/EleveMatiere');
const AnneeEtudeMatiere = require('./Models/AnneeEtudeMatiere');
const Concours = require('./Models/Concours');
const Role = require('./Models/Role');
const Bdc = require('./Models/Bdc');
// ... continuez pour tous les autres modèles que vous avez

// --- Importez et INITIALISEZ VOS ASSOCIATIONS APRÈS AVOIR DÉFINI TOUS VOS MODÈLES ---
const initAssociations = require("./Models/Associations.js");

// Synchronisation de la base de données et initialisation des associations
(async () => {
  try {
    // Synchronise les modèles avec la base de données (crée/met à jour les tables)
    await sequelize.sync({ force: false }); // force: false est important pour ne pas écraser les données existantes en production !

    // Appelez la fonction d'associations en lui passant tous vos modèles
    // Ceci est la clé pour que Sequelize connaisse vos relations
    initAssociations({
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
      Bdc,
      // ... assurez-vous d'inclure TOUS les modèles utilisés dans Models/Associations.js
    });

    console.log('✅ Base de données synchronisée et associations initialisées avec succès.');

    // --- Les routes et le démarrage du serveur doivent être DANS ce bloc async ---
    // (pour s'assurer que les associations sont prêtes avant que les requêtes n'arrivent)

    // Routes
    const authRoutes = require("./Routes/AuthRoute");
    const utilisateurRoutes = require("./Routes/UtilisateurRoute");
    const professeurRoutes = require("./Routes/ProfesseurRoute");
    const matiereRoutes = require("./Routes/MatiereRoute");
    const anneeEtudeRoutes = require("./Routes/AnneeEtudeRoute");
    const eleveRoutes = require("./Routes/EleveRoute");
    const maisonRoutes = require("./Routes/MaisonRoute");
    const noteRoutes = require("./Routes/NoteRoute");
    const adminRoutes = require("./Routes/AdminRoute");
    const rentreeRoutes = require("./Routes/RentreeRoute");
    const infoLivraisonRoutes = require("./Routes/InfoLivraisonRoute");
    const concoursRoutes = require("./Routes/ConcoursRoute");
    const buseRoutes = require("./Routes/BuseRoute");
    const vacancesRoutes = require("./Routes/VacancesRoute");
    const bdcRoutes = require("./Routes/BdcRoute");
    const articleRoutes = require("./Routes/ArticleRoute");
    const inscriptionRoutes = require('./Routes/EleveMatiereRoute');
    const anneeEtudeMatiereRoutes = require('./Routes/AnneeEtudeMatiereRoute');
    const eleveProfilRoutes = require('./Routes/EleveProfilRoute');
    const professeurProfilRoutes = require('./Routes/ProfesseurProfilRoute');

    // <-- AJOUTÉ : Importe la nouvelle route d'upload
    const uploadAdminRoutes = require('./Routes/UploadAdminRoute');
   

    app.use("/auth", authRoutes);
    app.use("/utilisateurs", utilisateurRoutes);
    app.use("/professeurs", professeurRoutes);
    app.use("/matieres", matiereRoutes);
    app.use("/annees", anneeEtudeRoutes);
    app.use("/eleves", eleveRoutes);
    
    app.use("/maisons", maisonRoutes);
    app.use("/notes", noteRoutes);
    app.use("/admins", adminRoutes);
    app.use("/rentrees", rentreeRoutes);
    app.use("/infos-livraison", infoLivraisonRoutes);
    app.use("/concours", concoursRoutes);
    app.use("/buses", buseRoutes);
    app.use("/vacances", vacancesRoutes);
    app.use("/bdcs", bdcRoutes);
    app.use("/articles", articleRoutes);
    app.use('/inscriptions', inscriptionRoutes);
    app.use('/annees-etudes-matieres', anneeEtudeMatiereRoutes);
    app.use('/profil', eleveProfilRoutes);
    app.use('/professeur', professeurProfilRoutes); 
    // <-- AJOUTÉ : Utilise la nouvelle route d'upload sous le préfixe /admin
    app.use('/admin', uploadAdminRoutes);
   
    app.get("/", (req, res) => {
      res.send("Bienvenue à Poudlard 🧙‍♂️");
    });

    // Import adminJS et ajoute la route
    const setupAdminJS = require('./Admin/index');
    const { adminJs, adminRouter } = await setupAdminJS();

    app.use(adminJs.options.rootPath, adminRouter);

    // Gestion des erreurs 404
    app.use((req, res) => {
      res.status(404).json({ message: "Route non trouvée" });
    });

    const PORT = process.env.PORT || 3033;
    app.listen(PORT, () => {
      console.log(`Serveur lancé sur http://localhost:${PORT}`);
      console.log(`AdminJS accessible sur http://localhost:${PORT}/admin`);
      // <-- AJOUTÉ : Information pour l'accès au formulaire d'upload
      console.log(`Pour uploader une photo d'utilisateur : http://localhost:${PORT}/admin/upload-photo?id=VOTRE_ID_UTILISATEUR`);

      // <-- AJOUTÉ : Vérifie et crée le dossier d'upload au démarrage si nécessaire
      const uploadDir = path.join(__dirname, 'public', 'uploads', 'images');
      if (!require('fs').existsSync(uploadDir)) {
          require('fs').mkdirSync(uploadDir, { recursive: true });
          console.log(`Dossier d'upload créé : ${uploadDir}`);
      }
    });

  } catch (error) {
    console.error('Erreur critique lors du démarrage du serveur ou de la BDD :', error);
    process.exit(1); // Arrête l'application si la BDD ou les associations ne peuvent pas être initialisées
  }
})();
*/




const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const path = require('path'); // <-- AJOUTÉ : Nécessaire pour gérer les chemins de fichiers
const fs = require('fs'); // <-- AJOUTÉ : Pour s'assurer que les dossiers d'upload existent

const app = express();
dotenv.config();

app.use(cors()); // public

 app.use(cors({ origin: "http://localhost:5175" })); // limitée a http://loclhost:5175
app.use(bodyParser.json());

// SERVIT DES FICHIERS STATIQUES (IMAGES, ETC.)
// Toutes les requêtes vers /images/ seront servies depuis le dossier public/images
app.use('/images', express.static('public/images/professeurs/'));
// <-- AJOUTÉ : Route pour servir les images uploadées via Multer
app.use('/uploads/images', express.static(path.join(__dirname, 'public', 'uploads', 'images')));




// Sequelize
const sequelize = require("./Config/sequelize");

// --- IMPORTANT : Importez TOUS vos modèles ici, ou au moins ceux utilisés dans vos associations ---
// C'est nécessaire pour que le fichier d'associations puisse y faire référence.
const Utilisateur = require('./Models/Utilisateur');
const Professeur = require('./Models/Professeur');
const Matiere = require('./Models/Matiere');
const Eleve = require('./Models/Eleve');
const Admin = require('./Models/Admin');
const AnneeEtude = require('./Models/AnneeEtude');
const Maison = require('./Models/Maison');
const Note = require('./Models/Note');
const EleveMatiere = require('./Models/EleveMatiere');
const AnneeEtudeMatiere = require('./Models/AnneeEtudeMatiere');
const Concours = require('./Models/Concours');
const Role = require('./Models/Role');
const Bdc = require('./Models/Bdc');
// ... continuez pour tous les autres modèles que vous avez

// --- Importez et INITIALISEZ VOS ASSOCIATIONS APRÈS AVOIR DÉFINI TOUS VOS MODÈLES ---
const initAssociations = require("./Models/Associations.js");

// Synchronisation de la base de données et initialisation des associations
(async () => {
  try {
    // Synchronise les modèles avec la base de données (crée/met à jour les tables)
    await sequelize.sync({ force: false }); // force: false est important pour ne pas écraser les données existantes en production !

    // Appelez la fonction d'associations en lui passant tous vos modèles
    // Ceci est la clé pour que Sequelize connaisse vos relations
    initAssociations({
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
      Bdc,
      // ... TOUS les modèles utilisés dans Models/Associations.js
    });

    console.log('✅ Base de données synchronisée et associations initialisées avec succès.');

    // --- Les routes et le démarrage du serveur doivent être DANS ce bloc async ---
    // (pour s'assurer que les associations sont prêtes avant que les requêtes n'arrivent)

    // Routes
    const authRoutes = require("./Routes/AuthRoute");
    const utilisateurRoutes = require("./Routes/UtilisateurRoute");
    const professeurRoutes = require("./Routes/ProfesseurRoute");
    const matiereRoutes = require("./Routes/MatiereRoute");
    const anneeEtudeRoutes = require("./Routes/AnneeEtudeRoute");
    const eleveRoutes = require("./Routes/EleveRoute");
    const maisonRoutes = require("./Routes/MaisonRoute");
    const noteRoutes = require("./Routes/NoteRoute");
    const adminRoutes = require("./Routes/AdminRoute");
    const rentreeRoutes = require("./Routes/RentreeRoute");
    const infoLivraisonRoutes = require("./Routes/InfoLivraisonRoute");
    const concoursRoutes = require("./Routes/ConcoursRoute");
    const buseRoutes = require("./Routes/BuseRoute");
    const vacancesRoutes = require("./Routes/VacancesRoute");
    const bdcRoutes = require("./Routes/BdcRoute");
    const articleRoutes = require("./Routes/ArticleRoute");
    const inscriptionRoutes = require('./Routes/EleveMatiereRoute');
    const anneeEtudeMatiereRoutes = require('./Routes/AnneeEtudeMatiereRoute');
    const eleveProfilRoutes = require('./Routes/EleveProfilRoute');
    const professeurProfilRoutes = require('./Routes/ProfesseurProfilRoute');

    // <-- AJOUTÉ : Importe la nouvelle route d'upload
    const uploadAdminRoutes = require('./Routes/UploadAdminRoute');
   

    app.use("/auth", authRoutes);
    app.use("/utilisateurs", utilisateurRoutes);
    app.use("/api/professeurs", professeurRoutes);
    app.use("/matieres", matiereRoutes);
    app.use("/annees", anneeEtudeRoutes);
    app.use("/eleves", eleveRoutes);
    
    app.use("/maisons", maisonRoutes);
    app.use("/notes", noteRoutes);
    app.use("/admins", adminRoutes);
    app.use("/rentrees", rentreeRoutes);
    app.use("/infos-livraison", infoLivraisonRoutes);
    app.use("/concours", concoursRoutes);
    app.use("/buses", buseRoutes);
    app.use("/vacances", vacancesRoutes);
    app.use("/bdcs", bdcRoutes);
    app.use("/articles", articleRoutes);
    app.use('/inscriptions', inscriptionRoutes);
    app.use('/annees-etudes-matieres', anneeEtudeMatiereRoutes);
    app.use('/profil', eleveProfilRoutes);
    app.use('/api/professeur', professeurProfilRoutes); 
    // <-- AJOUTÉ : Utilise la nouvelle route d'upload sous le préfixe /admin
    app.use('/admin', uploadAdminRoutes);
   
    app.get("/", (req, res) => {
      res.send("Bienvenue à Poudlard 🧙‍♂️");
    });

    // Import adminJS et ajoute la route
    const setupAdminJS = require('./Admin/index');
    const { adminJs, adminRouter } = await setupAdminJS();

    app.use(adminJs.options.rootPath, adminRouter);

    // Gestion des erreurs 404
    app.use((req, res) => {
      res.status(404).json({ message: "Route non trouvée" });
    });

    const PORT = process.env.PORT || 3033;
    app.listen(PORT, () => {
      console.log(`Serveur lancé sur http://localhost:${PORT}`);
      console.log(`AdminJS accessible sur http://localhost:${PORT}/admin`);
      // <-- AJOUTÉ : Information pour l'accès au formulaire d'upload
      console.log(`Pour uploader une photo d'utilisateur : http://localhost:${PORT}/admin/upload-photo?id=VOTRE_ID_UTILISATEUR`);

      // <-- AJOUTÉ : Vérifie et crée le dossier d'upload au démarrage si nécessaire
      const uploadDir = path.join(__dirname, 'public', 'uploads', 'images');
      if (!require('fs').existsSync(uploadDir)) {
          require('fs').mkdirSync(uploadDir, { recursive: true });
          console.log(`Dossier d'upload créé : ${uploadDir}`);
      }
    });

  } catch (error) {
    console.error('Erreur critique lors du démarrage du serveur ou de la BDD :', error);
    process.exit(1); // Arrête l'application si la BDD ou les associations ne peuvent pas être initialisées
  }
})();








