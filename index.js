/*const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');
app.use(cookieParser());

dotenv.config();

const app = express();

app.use(cors({ origin: "http://localhost:5175" }));
app.use(bodyParser.json());

// SERVIR DES FICHIERS STATIQUES
app.use('/images', express.static('public/images/professeurs/'));
app.use('/uploads/images', express.static(path.join(__dirname, 'public', 'uploads', 'images')));

// Sequelize
const sequelize = require("./Config/sequelize");

// Modèles
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

// Associations
const initAssociations = require("./Models/Associations.js");

// Dossier upload à vérifier/créer
const uploadDir = path.join(__dirname, 'public', 'uploads', 'images');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log(`Dossier d'upload créé : ${uploadDir}`);
}

(async () => {
  try {
    await sequelize.sync({ force: false });

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
    });

    console.log('✅ Base de données synchronisée et associations initialisées.');

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
    const uploadAdminRoutes = require('./Routes/UploadAdminRoute');

    app.use("/auth", authRoutes);
    app.use("/utilisateurs", utilisateurRoutes);
    app.use("/api/professeurs", professeurRoutes);
    app.use("/api/matieres", matiereRoutes);
    app.use("/annees", anneeEtudeRoutes);
    app.use("/eleves", eleveRoutes);
    app.use("/api/maisons", maisonRoutes);
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
    app.use('/api/annees-etudes-matieres', anneeEtudeMatiereRoutes);
    app.use('/profil', eleveProfilRoutes);
    app.use('/api/professeur', professeurProfilRoutes);
    app.use('/admin', uploadAdminRoutes);

    app.get("/", (req, res) => {
      res.send("Bienvenue à Poudlard 🧙‍♂️");
    });

    // ADMINJS
    // Importer la config AdminJS (index.js dans /Admin)
    const setupAdminJS = require('./Admin/index');

    // Passage des variables d’environnement pour l’authentification
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    // On attend la configuration AdminJS asynchrone
    const { adminJs, adminRouter } = await setupAdminJS({
      adminEmail,
      adminPassword,
    });

    app.use(adminJs.options.rootPath, adminRouter);
    
    // 404 - Route non trouvée
    app.use((req, res) => {
      res.status(404).json({ message: "Route non trouvée" });
    });

    const PORT = process.env.PORT || 3033;
    app.listen(PORT, () => {
      console.log(`Serveur lancé sur http://localhost:${PORT}`);
      console.log(`AdminJS accessible sur http://localhost:${PORT}${adminJs.options.rootPath}`);
      console.log(`Pour uploader une photo : http://localhost:${PORT}/admin/upload-photo?id=VOTRE_ID`);
    });
  } catch (error) {
    console.error('Erreur critique lors du démarrage :', error);
    process.exit(1);
  }
})();
*/

















/*

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();

app.use(cors({ origin: "http://localhost:5175" }));
app.use(bodyParser.json());

// SERVIR DES FICHIERS STATIQUES
app.use('/images', express.static('public/images/professeurs/'));
app.use('/uploads/images', express.static(path.join(__dirname, 'public', 'uploads', 'images')));

// Sequelize
const sequelize = require("./Config/sequelize");

// Modèles
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

// Associations
const initAssociations = require("./Models/Associations.js");

// Middleware d’authentification et d’autorisation JWT
const { authenticate } = require('./Middlewares/Authenticate');
const authorizeRole = require('./Middlewares/AuthorizeRole');

// Dossier upload à vérifier/créer
const uploadDir = path.join(__dirname, 'public', 'uploads', 'images');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log(`Dossier d'upload créé : ${uploadDir}`);
}

(async () => {
  try {
    await sequelize.sync({ force: false });

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
    });

    console.log('✅ Base de données synchronisée et associations initialisées.');

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
    const uploadAdminRoutes = require('./Routes/UploadAdminRoute');

    app.use("/auth", authRoutes);
    app.use("/utilisateurs", utilisateurRoutes);
    app.use("/api/professeurs", professeurRoutes);
    app.use("/api/matieres", matiereRoutes);
    app.use("/annees", anneeEtudeRoutes);
    app.use("/eleves", eleveRoutes);
    app.use("/api/maisons", maisonRoutes);
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
    app.use('/api/annees-etudes-matieres', anneeEtudeMatiereRoutes);
    app.use('/profil', eleveProfilRoutes);
    app.use('/api/professeur', professeurProfilRoutes);
    // UploadAdminRoute séparé, ne pas mettre sous /admin (AdminJS)
    app.use('/upload-admin', uploadAdminRoutes);

    app.get("/", (req, res) => {
      res.send("Bienvenue à Poudlard 🧙‍♂️");
    });

    // ADMINJS
    // Importer la config AdminJS (index.js dans /Admin)
    const setupAdminJS = require('./Admin/index');

    // Ne plus passer adminEmail/adminPassword, authentification via JWT seulement
    const { adminJs, adminRouter } = await setupAdminJS();

    // Middleware protection AdminJS : Auth + rôle admin uniquement
    app.use(
      adminJs.options.rootPath,
      authenticate,
      authorizeRole(['admin']),
      adminRouter
    );

    // 404 - Route non trouvée
    app.use((req, res) => {
      res.status(404).json({ message: "Route non trouvée" });
    });

    const PORT = process.env.PORT || 3033;
    app.listen(PORT, () => {
      console.log(`Serveur lancé sur http://localhost:${PORT}`);
      console.log(`AdminJS accessible sur http://localhost:${PORT}${adminJs.options.rootPath}`);
      console.log(`Pour uploader une photo : http://localhost:${PORT}/upload-admin?id=VOTRE_ID`);
    });
  } catch (error) {
    console.error('Erreur critique lors du démarrage :', error);
    process.exit(1);
  }
})();
*/



/*



const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();

app.use(cors({ origin: "http://localhost:5175",  credentials: true }));
app.use(bodyParser.json());

app.use(cookieParser());

// SERVIR DES FICHIERS STATIQUES
app.use('/images', express.static('public/images/professeurs/'));
app.use('/uploads/images', express.static(path.join(__dirname, 'public', 'uploads', 'images')));

// Sequelize
const sequelize = require("./Config/sequelize");

// Modèles
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

// Associations
const initAssociations = require("./Models/Associations.js");

// Middleware d’authentification et d’autorisation JWT
const { authenticate } = require('./Middlewares/Authenticate');
const authorizeRole = require('./Middlewares/AuthorizeRole');

// Dossier upload à vérifier/créer
const uploadDir = path.join(__dirname, 'public', 'uploads', 'images');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log(`Dossier d'upload créé : ${uploadDir}`);
}

(async () => {
  try {
    await sequelize.sync({ force: false });

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
    });

    console.log('✅ Base de données synchronisée et associations initialisées.');

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
    const uploadAdminRoutes = require('./Routes/UploadAdminRoute');

    app.use("/auth", authRoutes);
    app.use("/utilisateurs", utilisateurRoutes);
    app.use("/api/professeurs", professeurRoutes);
    app.use("/api/matieres", matiereRoutes);
    app.use("/annees", anneeEtudeRoutes);
    app.use("/eleves", eleveRoutes);
    app.use("/api/maisons", maisonRoutes);
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
    app.use('/api/annees-etudes-matieres', anneeEtudeMatiereRoutes);
    app.use('/profil', eleveProfilRoutes);
    app.use('/api/professeur', professeurProfilRoutes);
    // UploadAdminRoute séparé, ne pas mettre sous /admin (AdminJS)
    app.use('/upload-admin', uploadAdminRoutes);

    app.get("/", (req, res) => {
      res.send("Bienvenue à Poudlard 🧙‍♂️");
    });

    // ADMINJS
    // Importer la config AdminJS (index.js dans /Admin)
    const setupAdminJS = require('./Admin/index');

    // Ne plus passer adminEmail/adminPassword, authentification via JWT seulement
    const { adminJs, adminRouter } = await setupAdminJS();

    // Middleware protection AdminJS : Auth + rôle admin uniquement
    app.use(
      adminJs.options.rootPath,
      authenticate,
      authorizeRole(['admin']),
      adminRouter
    );

    // 404 - Route non trouvée
    app.use((req, res) => {
      res.status(404).json({ message: "Route non trouvée" });
    });

    const PORT = process.env.PORT || 3033;
    app.listen(PORT, () => {
      console.log(`Serveur lancé sur http://localhost:${PORT}`);
      console.log(`AdminJS accessible sur http://localhost:${PORT}${adminJs.options.rootPath}`);
      console.log(`Pour uploader une photo : http://localhost:${PORT}/upload-admin?id=VOTRE_ID`);
    });
  } catch (error) {
    console.error('Erreur critique lors du démarrage :', error);
    process.exit(1);
  }
})();*/


const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');

dotenv.config();
console.log('FRONTEND_URL chargée :', process.env.FRONTEND_URL); // <-- Ajoute cette ligne temporairement

const app = express();

app.use(cors({ origin: "http://localhost:5175", credentials: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// SERVIR DES FICHIERS STATIQUES
app.use('/images', express.static('public/images/professeurs/'));
app.use('/uploads/images', express.static(path.join(__dirname, 'public', 'uploads', 'images')));

// Sequelize
const sequelize = require("./Config/sequelize");

// Modèles
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

// Associations
const initAssociations = require("./Models/Associations.js");

// Middleware d’authentification et d’autorisation JWT
const { authenticate } = require('./Middlewares/Authenticate');
const authorizeRole = require('./Middlewares/AuthorizeRole');

// Dossier upload à vérifier/créer
const uploadDir = path.join(__dirname, 'public', 'uploads', 'images');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log(`Dossier d'upload créé : ${uploadDir}`);
}

(async () => {
  try {
    await sequelize.sync({ force: false });

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
    });

    console.log('✅ Base de données synchronisée et associations initialisées.');

    // ROUTES
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
    const uploadAdminRoutes = require('./Routes/UploadAdminRoute');

    app.use("/auth", authRoutes);
    app.use("/utilisateurs", utilisateurRoutes);
    app.use("/api/professeurs", professeurRoutes);
    app.use("/api/matieres", matiereRoutes);
    app.use("/annees", anneeEtudeRoutes);
    app.use("/eleves", eleveRoutes);
    app.use("/api/maisons", maisonRoutes);
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
    app.use('/api/annees-etudes-matieres', anneeEtudeMatiereRoutes);
    app.use('/profil', eleveProfilRoutes);
    app.use('/api/professeur', professeurProfilRoutes);
    app.use('/upload-admin', uploadAdminRoutes); // 🔧

    app.get("/", (req, res) => {
      res.send("Bienvenue à Poudlard 🧙‍♂️");
    });

    // 🔧 ADMINJS - chargement dynamique sécurisé
    const setupAdminJS = require('./Admin/index'); // 🔧 Import de la config AdminJS
    const { adminJs, adminRouter } = await setupAdminJS(); // 🔧

    app.use(
      adminJs.options.rootPath,
      authenticate,              // 🔧 JWT obligatoire
      authorizeRole(['admin']), // 🔧 rôle admin uniquement
      adminRouter                // 🔧 routeur AdminJS
    );

    // 404 - Route non trouvée
    app.use((req, res) => {
      res.status(404).json({ message: "Route non trouvée" });
    });

    const PORT = process.env.PORT || 3033;
    app.listen(PORT, () => {
      console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
      console.log(`🔐 AdminJS accessible via http://localhost:${PORT}${adminJs.options.rootPath}`);
    });

  } catch (error) {
    console.error('❌ Erreur critique lors du démarrage :', error);
    process.exit(1);
  }
})();

