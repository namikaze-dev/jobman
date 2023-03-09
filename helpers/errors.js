'use strict'

const errorResponse = (res, code, msg) => {
    msg = { "error": msg };
    res.status(code).send(msg);
}

const serverErrorResponse = (res, err) => {
    console.error(err);
    const msg = "the server encountered a problem and could not process your request";
    errorResponse(res, 500, msg);
}

const failedValidationResponse = (res, errors) => {
    errorResponse(res, 422, errors);
}

const invalidCredentialsResponse = (res, msg) => {
    msg = msg || "invalid credentials";
    errorResponse(res, 401, msg);
}

const invalidAuthenticationTokenResponse = (res, msg) => {
    res.set("WWW-Authenticate", "Bearer");
    msg = msg || "invalid or missing authentication token";
    errorResponse(res, 401, msg);
}

const forbiddenResponse = (res, msg) => {
    msg = msg || "Forbidden";
    errorResponse(res, 403, msg);
}

const notFoundResponse = (res, msg) => {
    msg = msg || "Not Found";
    errorResponse(res, 404, msg);
}

module.exports = {
    serverErrorResponse,
    failedValidationResponse,
    invalidCredentialsResponse,
    invalidAuthenticationTokenResponse,
    forbiddenResponse,
    notFoundResponse
}