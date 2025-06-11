// Config/pdfMulterConfig.js

const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Pour s'assurer que le dossier d'upload existe

// Configuration du stockage des fichiers PDF
const pdfStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '..', 'public', 'uploads', 'pdfs'); // Remonte d'un niveau pour être à la racine du backend
    
    // Vérifie si le dossier d'upload existe, sinon le crée
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Génère un nom de fichier unique en utilisant le timestamp et une extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
  }
});

// Filtre pour n'accepter que les fichiers PDF
const pdfFileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf' || file.mimetype === 'application/x-pdf') {
    cb(null, true);
  } else {
    cb(new Error('Seuls les fichiers PDF sont autorisés !'), false);
  }
};

// Initialisation de Multer pour les PDF
const uploadPdf = multer({
  storage: pdfStorage,
  fileFilter: pdfFileFilter,
  limits: {
    fileSize: 1024 * 1024 * 10 // Limite la taille des PDF à 10 Mo (tu peux ajuster)
  }
});

// Exporte l'instance de Multer configurée pour les PDF
module.exports = uploadPdf;