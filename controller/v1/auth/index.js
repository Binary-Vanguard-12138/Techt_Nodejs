const Joi = require("joi");
const { validateRequest } = require("../../../middleware/validate-request");

const authService = require("../../../service/v1/auth");

// sign up a new user
function registerUser(req, res, next) {
    const { email, password } = req.body;
    authService.registerUser(email, password)
        .then(user => res.status(201).json(user))
        .catch(next);
}


function registerUserSchema(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().min(6).required()
    });
    validateRequest(req, next, schema);
}

// authenticate a user 
function authenticateUser(req, res, next) {
    const { email, password } = req.body;
    authService.authenticateUser(email, password)
        .then(user => res.status(200).json(user))
        .catch(next);
}

function authenticateUserSchema(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().min(6).required()
    });
    validateRequest(req, next, schema);
}

// logout a user
function logout(req, res, next) {
    next();
}

module.exports = { registerUser, registerUserSchema, authenticateUser, authenticateUserSchema, logout }