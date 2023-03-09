'use strict'

const errorResponse = (res, code, msg) => {
    msg = { "error": msg };
    res.status(code).send(msg);
}

const serverErrorResponse = (res, err) => {
    console.error(err);
    const msg = "the server encountered a problem and could not process your request"
    res.status(500).send(msg);
}

const failedValidationResponse = (res, errors) => {
    errorResponse(res, 422, errors);
}

const invalidCredentialsResponse = (res) => {
    const msg = "invalid credentials"
    res.status(401).send(msg);
}

const invalidAuthenticationTokenResponse = (res) => {
    res.set("WWW-Authenticate", "Bearer");
    res.status(401).send("invalid or missing authentication token");
}

const forbiddenResponse = (res, msg) => {
    msg = msg || "Forbidden";
    res.status(403).send(msg);
}

const notFoundResponse = (res, msg) => {
    msg = msg || "Not Found";
    res.status(404).send(msg);
}

module.exports = {
    serverErrorResponse,
    failedValidationResponse,
    invalidCredentialsResponse,
    invalidAuthenticationTokenResponse,
    forbiddenResponse,
    notFoundResponse
}