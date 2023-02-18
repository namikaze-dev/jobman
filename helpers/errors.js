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

module.exports = {
    serverErrorResponse,
    failedValidationResponse
}