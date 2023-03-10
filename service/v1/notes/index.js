const fs = require("fs");
const { JSON_FILE_PATH } = require("../../../constant/path");
const { NotFoundError } = require("../../../middleware/error-handler");


/**
 * 
 * @returns the note id which is 1 larger than the current maximum
 */
function getNewNoteId() {
    let oldNotesContent;
    try {
        oldNotesContent = fs.readFileSync(JSON_FILE_PATH, "utf-8");
    } catch (err) {
        console.error(err);
    }

    let oldNotes = oldNotesContent ? JSON.parse(oldNotesContent) : [];
    if (!oldNotes.length) {
        return 0;
    }
    return oldNotes.reduce((prevValue, note) => {
        if (prevValue < note.id) {
            return note.id;
        } else {
            return prevValue;
        }
    }, 0) + 1;
}

async function getAllNotes() {
    let oldNotesContent;
    try {
        oldNotesContent = fs.readFileSync(JSON_FILE_PATH, "utf-8");
    } catch (err) {
        console.error(err);
    }

    let oldNotes = oldNotesContent ? JSON.parse(oldNotesContent) : [];
    return oldNotes;
}

async function getNote(note_id) {
    let oldNotesContent;
    try {
        oldNotesContent = fs.readFileSync(JSON_FILE_PATH, "utf-8");
    } catch (err) {
        console.error(err);
    }

    let oldNotes = oldNotesContent ? JSON.parse(oldNotesContent) : [];
    const note = oldNotes.find(note => note.id === note_id);
    if (!note) {
        throw NotFoundError(`The note ${note_id} not found`);
    }
    return note;
}

async function createNote(user, title, content) {
    let oldNotesContent;
    try {
        oldNotesContent = fs.readFileSync(JSON_FILE_PATH, "utf-8");
    } catch (err) {
        console.error(err);
    }

    let oldNotes = oldNotesContent ? JSON.parse(oldNotesContent) : [];
    const newNoteId = getNewNoteId();
    const newNote = { id: newNoteId, title, content, user_id: user.email };
    oldNotes.push(newNote);
    try {
        fs.writeFileSync(JSON_FILE_PATH, JSON.stringify(oldNotes));
    } catch (err) {
        console.error(err);
    }
    return newNote;
}

async function deleteNote(note_id) {
    let oldNotesContent;
    try {
        oldNotesContent = fs.readFileSync(JSON_FILE_PATH, "utf-8");
    } catch (err) {
        console.error(err);
    }

    let oldNotes = oldNotesContent ? JSON.parse(oldNotesContent) : [];
    const note = oldNotes.find(note => note.id === note_id);
    if (!note) {
        throw NotFoundError(`The note ${note_id} not found`);
    }
    const newNotes = oldNotes.filter(note => note.id !== note_id);
    try {
        fs.writeFileSync(JSON_FILE_PATH, JSON.stringify(newNotes));
    } catch (err) {
        console.error(err);
    }
    return note;
}

async function updateNote(note_id, title, content) {
    let oldNotesContent;
    try {
        oldNotesContent = fs.readFileSync(JSON_FILE_PATH, "utf-8");
    } catch (err) {
        console.error(err);
    }

    let oldNotes = oldNotesContent ? JSON.parse(oldNotesContent) : [];
    const note = oldNotes.find(note => note.id === note_id);
    if (!note) {
        throw NotFoundError(`The note ${note_id} not found`);
    }
    if (undefined !== title) {
        note.title = title;
    }
    if (undefined !== content) {
        note.content = content;
    }
    try {
        fs.writeFileSync(JSON_FILE_PATH, JSON.stringify(oldNotes));
    } catch (err) {
        console.error(err);
    }
    return note;
}

module.exports = { getAllNotes, getNote, createNote, updateNote, deleteNote };