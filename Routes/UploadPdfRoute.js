const express = require("express");
const router = express.Router();
const upload = require("../Config/pdfMulterConfig"); // C'est OK
const uploadPdfController = require("../Controllers/PdfUploadController"); // C'est OK

// Cette route s'appelle /upload-bdc-pdf et utilise multer AVANT ton contrôleur
router.post("/upload-bdc-pdf", upload.single("pdf"), uploadPdfController.uploadPdf); // <-- CORRECTION ICI

module.exports = router;
