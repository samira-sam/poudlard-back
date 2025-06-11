const express = require("express");
const NoteController = require("../Controllers/NoteController");
const router = express.Router();

router.get("/", (req, res) => {
  NoteController.getAllNotes(req, res);
});

router.get("/:id", (req, res) => {
  NoteController.getNoteById(req, res);
});

router.post("/", (req, res) => {
  NoteController.addNote(req, res);
});

router.put("/:id", (req, res) => {
  NoteController.updateNote(req, res);
});

router.delete("/:id", (req, res) => {
  NoteController.deleteNote(req, res);
});

module.exports = router;


