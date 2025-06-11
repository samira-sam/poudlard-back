const multer = require('multer');
const path = require('path'); // Module intégré à Node.js pour gérer les chemins de fichiers

// Configuration du stockage des fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // 'cb' est la callback de Multer
    // Le premier argument est null pour indiquer qu'il n'y a pas d'erreur
    // Le deuxième argument est le chemin de destination de ton dossier d'upload
    cb(null, 'public/uploads/images/');
  },
  filename: (req, file, cb) => {
    // Création d'un nom de fichier unique pour éviter les conflits
    // file.fieldname : le nom du champ dans le formulaire (ici 'photo')
    // Date.now() : un timestamp unique
    // path.extname(file.originalname) : l'extension originale du fichier (.jpg, .png, etc.)
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Filtre pour n'accepter que les images
const fileFilter = (req, file, cb) => {
  // Vérifie si le type de fichier (mimetype) commence par 'image/'
  if (file.mimetype.startsWith('image/')) {
    cb(null, true); // Accepte le fichier
  } else {
    // Rejette le fichier et renvoie une erreur
    cb(new Error('Seules les images sont autorisées !'), false);
  }
};

// Initialisation de Multer avec la configuration définie
const upload = multer({
  storage: storage, // Utilise la configuration de stockage
  fileFilter: fileFilter, // Applique le filtre de fichiers
  limits: {
    fileSize: 1024 * 1024 * 5 // Limite la taille des fichiers à 5 Mo (en octets)
  }
});

// Exporte l'instance de Multer configurée pour être utilisée ailleurs
module.exports = upload;