const noteService = require("../../../service/v1/notes")
const Joi = require("joi");
const { validateRequest } = require("../../../middleware/validate-request");

function getAllNotes(req, res, next) {
    noteService.getAllNotes()
        .then(notes => res.status(200).json(notes))
        .catch(next);
}

function getNote(req, res, next) {
    const { note_id } = req.params;
    noteService.getNote(parseInt(note_id))
        .then(note => res.status(200).json(note))
        .catch(next);
}

function createNoteSchema(req, res, next) {
    const schema = Joi.object({
        title: Joi.string().required(),
        content: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function createNote(req, res, next) {
    const { title, content } = req.body;
    const { user } = req;
    noteService.createNote(user, title, content)
        .then(note => res.status(201).json(note))
        .catch(next);
}

function updateNoteSchema(req, res, next) {
    const schema = Joi.object({
        title: Joi.string(),
        content: Joi.string()
    });
    validateRequest(req, next, schema);
}

function updateNote(req, res, next) {
    const { note_id } = req.params;
    const { title, content } = req.body;
    noteService.updateNote(parseInt(note_id), title, content)
        .then(note => res.status(200).json(note))
        .catch(next);
}

function deleteNote(req, res, next) {
    const { note_id } = req.params;
    noteService.deleteNote(parseInt(note_id))
        .then(note => res.status(200).json(note))
        .catch(next);
}

module.exports = { getAllNotes, getNote, createNote, createNoteSchema, updateNote, updateNoteSchema, deleteNote }