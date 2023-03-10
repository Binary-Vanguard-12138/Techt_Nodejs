
function UnauthorizedError(message) {
    var e = new Error(message);
    e.name = "UnauthorizedError";
    return e;
}

function NotFoundError(message) {
    var e = new Error(message);
    e.name = "NotFoundError";
    return e;
}

function DuplicatedError(message) {
    var e = new Error(message);
    e.name = "DuplicatedError";
    return e;
}


function errorHandler(err, req, res, next) {
    let statusCode = 400;
    switch (true) {
        case typeof err === "string":
            // custom application error
            return res.status(statusCode).json({ message: err });
        case err.name === "UnauthorizedError":
            // jwt authentication error
            console.error(`${err.name}, ${err.message}`);
            return res
                .status(401)
                .json({ message: "Unauthorized\n" + err.message });
        case err.name === "NotFoundError":
            statusCode = 404;
            console.error(`${err.name}, ${err.message}`);
            return res.status(statusCode).json({ message: err.message });
        case err.name === "DuplicatedError":
            statusCode = 409;
            console.error(`${err.name}, ${err.message}`);
            return res.status(statusCode).json({ message: err.message });
        default:
            //console.error(`${err.name} ${err.message}`);
            return res.status(500).json({
                message: err.message || err.tostring(),
            });
    }
}


module.exports = { UnauthorizedError, NotFoundError, DuplicatedError, errorHandler };