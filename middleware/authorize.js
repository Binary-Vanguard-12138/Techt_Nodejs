const config = require("config");
const jwt = require("jsonwebtoken");
const { isUserExist } = require("../service/v1/auth");


function authorize(req, res, next) {
    const authHeader = req.headers['authorization']
    if (!authHeader) {
        return res.sendStatus(401);
    }
    const auth_blocks = authHeader.split(' ');
    if (2 > auth_blocks.length) {
        return res.sendStatus(401);
    }

    const token = authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, config.get("jwtSecret"), (err, user) => {
        if (err) return res.sendStatus(403);
        if (!isUserExist(user.email)) {
            return res.sendStatus(403);
        }

        req.user = user;
        next();
    });
}

module.exports = { authorize };