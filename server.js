const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");

const { errorHandler } = require("./middleware/error-handler");

const app = express();

const authRouter = require("./route/v1/auth");
const noteRouter = require("./route/v1/notes");

app.use(helmet());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/auth", authRouter);
app.use("/notes", noteRouter);

app.use(errorHandler);


const server = app.listen(3000, () => {
    console.log("Started listening on server 3000 port");
})


module.exports = { app, server };