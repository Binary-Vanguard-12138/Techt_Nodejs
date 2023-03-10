const { NotFoundError, DuplicatedError } = require("../../../middleware/error-handler");
const config = require("config");
const jwt = require("jsonwebtoken");

// In-Memory User table
const g_mapUser = new Map();

async function registerUser(email, password) {
    if (g_mapUser.has(email)) {
        throw DuplicatedError(`The user ${email} already exists!`);
    }
    // Simply saves password without hash :)
    // this is just a proof of concept project
    g_mapUser.set(email, password);
    return { email };
}

function isUserExist(email) {
    return g_mapUser.has(email);
}

async function authenticateUser(email, password) {
    if (!g_mapUser.has(email)) {
        throw NotFoundError(`The user ${email} not found`);
    }
    if (g_mapUser.get(email) !== password) {
        throw `The password is invalid for the user ${email}`;
    }
    // generate jwt and return
    const token = jwt.sign({ email }, config.get("jwtSecret"), { expiresIn: '1800s' });
    return { email, token };
}

module.exports = { registerUser, authenticateUser, isUserExist }