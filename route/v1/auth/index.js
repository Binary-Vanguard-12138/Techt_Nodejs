const express = require("express");
const router = express.Router();
const { authorize } = require("../../../middleware/authorize");

const { registerUser, registerUserSchema, authenticateUser, authenticateUserSchema, logout } = require("../../../controller/v1/auth");

/**
 * @method POST
 * @route /auth/register
 * @params email, passsword
 */
router.post("/register", registerUserSchema, registerUser);

/**
 * @method POST
 * @route /auth/login
 * @params email, passsword
 */
router.post("/login", authenticateUserSchema, authenticateUser);

/**
 * @method POST
 * @route /auth/logout
 * @params email, passsword
 */
router.post("/logout", authorize, logout);

module.exports = router;