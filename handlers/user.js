'use strict'

const sanitizer = require("../helpers/sanitizer");
const sendMail = require('../helpers/email');
const { Validator } = require('node-input-validator');
const { failedValidationResponse, serverErrorResponse } = require("../helpers/errors");
const { Conflict, NotFound } = require('../lib/errors/http_errors');

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
                const ttl = new Date();
                ttl.setHours(ttl.getHours() + 72);
                const token = await env.models.tokens.create(user.id, ttl, "activation");

                try {
                    await sendMail(user.email, "Welcome to Jobman", "user_welcome", { token: token.plain })
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
        try {
            const v = new Validator(req.params, {
                token: 'required|minLength:26|maxLength:26',
            });

            if (!await v.check()) {
                failedValidationResponse(res, sanitizer.validationErr(v.errors));
                return;
            }

            const token = req.params.token;

            const owner = await env.models.users.getForToken(token, 'activation');
            owner.activated = true;
            await env.models.users.update(owner);

            await env.models.tokens.deleteAllForUser(owner.id, "activation");

            res.status(201).send(sanitizer.user(owner));
        } catch (err) {
            if (err instanceof NotFound) {
                failedValidationResponse(res, { "token": "invalid/expired token" });
                return;
            }

            serverErrorResponse(res, err);
        }
    }
}

module.exports = {
    signup,
    activated
}