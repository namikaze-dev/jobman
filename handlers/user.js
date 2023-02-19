'use strict'

const { Validator } = require('node-input-validator');
const { failedValidationResponse, serverErrorResponse } = require("../helpers/errors");
const sanitizer = require("../helpers/sanitizer");
const { Conflict } = require('../lib/errors/http_errors');

const signup = env => {
    return async (req, res) => {
        try {
            const input = {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
            };

            const v = new Validator(input, {
                name: 'required|maxLength:100',
                email: 'required|email',
                password: 'required|minLength:8|maxLength:100'
            });

            if (!await v.check()) {
                failedValidationResponse(res, sanitizer.validationErr(v.errors));
                return;
            }

            input.password_hash = await env.models.users.hashPassword(input.password);

            const user = await env.models.users.insert(input);
            res.status(201).send(sanitizer.user(user));
        } catch (err) {
            if (err instanceof Conflict) {
                failedValidationResponse(res, {"email": "a user with this email already exists"});
                return
            }
            serverErrorResponse(res, err);
        }
    }
}

module.exports = {
    signup
}