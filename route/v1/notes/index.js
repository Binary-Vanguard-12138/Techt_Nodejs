const express = require("express");
const { authorize } = require("../../../middleware/authorize");

const router = express.Router();

const { getAllNotes, getNote, createNote, updateNote, deleteNote } = require("../../../controller/v1/notes");

/**
 * @method GET
 * @route /notes/
 * @description get all notes
 * @param
 */
router.get("/", authorize, getAllNotes);

/**
 * @method GET
 * @route /notes/:note_id
 * @description get a note by id
 * @param
 */
router.get("/:note_id", authorize, getNote);
/**
 * @method POST
 * @route /notes/
 * @description create a new note
 * @param
 */
router.post("/", authorize, createNote);
/**
 * @method PUT
 * @route /notes/:note_id
 * @description update a note
 * @param
 */
router.put("/:note_id", authorize, updateNote);
/**
 * @method DELETE
 * @route /notes/:note_id
 * @description delete a note
 * @param
 */
router.delete("/:note_id", authorize, deleteNote);


module.exports = router;