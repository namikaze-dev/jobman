'use strict'

const sanitizer = require("../helpers/sanitizer");
const sendMail = require('../helpers/email');
const { Validator } = require('node-input-validator');
const { failedValidationResponse, serverErrorResponse } = require("../helpers/errors");
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

            setImmediate(async () => {
                try {
                    await sendMail(user.email, "Welcome to Jobman", "user_welcome", { token: null })
                } catch (err) {
                    console.error(err);
                }
            })

            res.status(201).send(sanitizer.user(user));
        } catch (err) {
            if (err instanceof Conflict) {
                failedValidationResponse(res, { "email": "a user with this email already exists" });
                return
            }
            serverErrorResponse(res, err);
        }
    }
}

const activated = env => {
    return async (req, res) => {
        const token = req.params.token;
        res.send(token)
    }
}

module.exports = {
    signup,
    activated
}