const NoteService = require("../Services/NoteService");

class NoteController {
  async getAllNotes(req, res) {
    try {
      const notes = await NoteService.getAllNotes();
      res.json(notes);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la récupération des notes" });
    }
  }

  async getNoteById(req, res) {
    try {
      const note = await NoteService.getNoteById(req.params.id);
      if (!note) return res.status(404).json({ error: "Note non trouvée" });
      res.json(note);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la récupération de la note" });
    }
  }

  async addNote(req, res) {
    try {
      const note = await NoteService.addNote(req.body);
      res.status(201).json(note);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de l'ajout de la note" });
    }
  }

  async updateNote(req, res) {
    try {
      const note = await NoteService.updateNote(req.params.id, req.body);
      if (!note) return res.status(404).json({ error: "Note non trouvée" });
      res.json(note);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la mise à jour de la note" });
    }
  }

  async deleteNote(req, res) {
    try {
      const note = await NoteService.deleteNote(req.params.id);
      if (!note) return res.status(404).json({ error: "Note non trouvée" });
      res.json({ message: "Note supprimée avec succès" });
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la suppression de la note" });
    }
  }
}

module.exports = new NoteController();
