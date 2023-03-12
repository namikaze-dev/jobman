import { Validator } from 'node-input-validator';
import sanitizer from '../helpers/sanitizer.js';
import sendMail from '../helpers/email.js';
import * as errors from '../helpers/errors.js';
import { Conflict, NotFound } from '../lib/errors/http_errors.js';

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

            if (!(await v.check())) {
                errors.failedValidationResponse(res, sanitizer.validationErr(v.errors));
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

            res.status(201).send(sanitizer.user({ user: user }));
        } catch (err) {
            if (err instanceof Conflict) {
                errors.failedValidationResponse(res, "a user with this email already exists");
                return
            }
            errors.serverErrorResponse(res, err);
        }
    };
}

const activated = env => {
    return async (req, res) => {
        try {
            const v = new Validator(req.params, {
                token: 'required|minLength:26|maxLength:26',
            });

            if (!(await v.check())) {
                errors.failedValidationResponse(res, sanitizer.validationErr(v.errors));
                return;
            }

            const token = req.params.token;

            const owner = await env.models.users.getForToken(token, 'activation');
            owner.activated = true;
            await env.models.users.update(owner);

            await env.models.tokens.deleteAllForUser(owner.id, "activation");

            res.status(201).send(sanitizer.user({ user: owner }));
        } catch (err) {
            if (err instanceof NotFound) {
                errors.failedValidationResponse(res, { "token": "invalid/expired token" });
                return;
            }

            errors.serverErrorResponse(res, err);
        }
    };
}

const login = env => {
    return async (req, res) => {
        try {
            const input = {
                email: req.body.email,
                password: req.body.password,
            };

            const v = new Validator(input, {
                email: 'required|email',
                password: 'required|minLength:8|maxLength:100'
            });

            if (!(await v.check())) {
                errors.failedValidationResponse(res, sanitizer.validationErr(v.errors));
                return;
            }

            const user = await env.models.users.getByEmail(input.email);

            if (!(await env.models.users.validatePassword(user.password_hash, input.password))) {
                errors.invalidCredentialsResponse(res);
                return
            }

            // invalidate other tokens
            await env.models.tokens.deleteAllForUser(user.id, "authentication");

            const ttl = new Date();
            ttl.setHours(ttl.getHours() + 24);
            const token = await env.models.tokens.create(user.id, ttl, "authentication");

            res.status(201).send({authentication_token: token.plain})
        } catch (err) {
            if (err instanceof NotFound) {
                errors.invalidCredentialsResponse(res);
                return
            }
            errors.serverErrorResponse(res, err);
        }
    };
}

export {
    signup,
    activated,
    login
};