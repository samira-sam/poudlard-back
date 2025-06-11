const Note = require("../Models/Note");

class NoteService {
  async getAllNotes() {
    return await Note.findAll();
  }

  async getNoteById(id) {
    return await Note.findByPk(id);
  }

  async addNote(data) {
    return await Note.create(data);
  }

  async updateNote(id, data) {
    const note = await Note.findByPk(id);
    if (!note) return null;
    return await note.update(data);
  }

  async deleteNote(id) {
    const note = await Note.findByPk(id);
    if (!note) return null;
    return await note.destroy();
  }
}

module.exports = new NoteService();
