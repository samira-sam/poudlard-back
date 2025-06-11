/*const express = require('express');
const router = express.Router();

const { uploadPDF } = require('../config/pdfMulterConfig');
const { uploadPdfFile } = require('../controllers/pdfUploadController');

router.post('/upload', uploadPDF, uploadPdfFile);

module.exports = router;
*/const express = require('express');
const router = express.Router();
const { uploadPDF } = require('../Config/pdfMulterConfig');
const { uploadPdfFile } = require('../Controllers/PDFuploadController');

router.post('/upload/pdf', uploadPDF, uploadPdfFile);

module.exports = router;