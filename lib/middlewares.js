'use strict'

const { Validator } = require('node-input-validator');
const { invalidAuthenticationTokenResponse, serverErrorResponse, inactiveAccountResponse } = require("../helpers/errors");
const { NotFound } = require("./errors/http_errors");

const authenticate = env => {
    return async (req, res, next) => {
        const authHeader = req.get('Authorization');

        if (!authHeader) {
            invalidAuthenticationTokenResponse(res);
            return
        }

        const [bearer, token] = authHeader.split(" ");
        if (bearer != "Bearer" || authHeader.split(" ").length != 2) {
            invalidAuthenticationTokenResponse(res);
            return
        }

        const v = new Validator({ token }, {
            token: 'required|minLength:26|maxLength:26',
        });

        if (!await v.check()) {
            invalidAuthenticationTokenResponse(res);
            return;
        }

        try {
            const user = await env.models.users.getForToken(token, 'authentication');
            req.user = user;

            await next();
        } catch (err) {
            if (err instanceof NotFound) {
                invalidAuthenticationTokenResponse(res);
                return;
            }
            serverErrorResponse(res, err);
        }
    }
}

const activate = env => {
    return async (req, res, next) => {
        const user = req.user;

        if (!user.activated) {
            inactiveAccountResponse(res);
            return;
        }

        await next();
    }
}

module.exports = {
    authenticate,
    activate
}