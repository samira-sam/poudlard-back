/*const multer = require('multer')
const path = require('path')
const fs = require('fs')

// ✅ Dossier de destination
const uploadPath = path.join(__dirname, '..', 'public', 'uploads', 'pdfs')

// ✅ Création du dossier s'il n'existe pas
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true })
}

// ✅ Configuration de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath)
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    const filename = `${Date.now()}${ext}`
    cb(null, filename)
  },
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true)
  } else {
    cb(new Error('Seuls les fichiers PDF sont autorisés.'), false)
  }
}

const upload = multer({ storage, fileFilter })

// ✅ Middleware d'upload : un seul fichier, champ "fichier"
const uploadPDF = upload.single('fichier')

module.exports = {
  uploadPDF,
}
*/


const path = require('path')
const fs = require('fs')
const multer = require('multer')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../public/uploads/pdfs')
    fs.mkdirSync(uploadPath, { recursive: true })
    cb(null, uploadPath)
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname
    cb(null, uniqueName)
  },
})

const upload = multer({ storage }).single('pdf') // 'pdf' = nom du champ

const uploadPdf = (req, res) => {
  upload(req, res, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    if (!req.file) {
      return res.status(400).json({ message: 'Aucun fichier reçu.' })
    }

    res.status(200).json({ filename: req.file.filename })
  })
}

module.exports = uploadPdf
