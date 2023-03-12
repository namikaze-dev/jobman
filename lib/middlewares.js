import { Validator } from 'node-input-validator';
import * as errors from '../helpers/errors.js';
import { NotFound } from './errors/http_errors.js';

const authenticate = env => {
    return async (req, res, next) => {
        const authHeader = req.get('Authorization');

        if (!authHeader) {
            errors.invalidAuthenticationTokenResponse(res);
            return
        }

        const [bearer, token] = authHeader.split(" ");
        if (bearer != "Bearer" || authHeader.split(" ").length != 2) {
            errors.invalidAuthenticationTokenResponse(res);
            return
        }

        const v = new Validator({ token }, {
            token: 'required|minLength:26|maxLength:26',
        });

        if (!(await v.check())) {
            errors.invalidAuthenticationTokenResponse(res);
            return;
        }

        try {
            const user = await env.models.users.getForToken(token, 'authentication');
            req.user = user;

            await next();
        } catch (err) {
            if (err instanceof NotFound) {
                errors.invalidAuthenticationTokenResponse(res);
                return;
            }
            errors.serverErrorResponse(res, err);
        }
    };
}

const activate = env => {
    return async (req, res, next) => {
        const user = req.user;

        if (!user.activated) {
            errors.inactiveAccountResponse(res);
            return;
        }

        await next();
    }
}

export {
    authenticate,
    activate
};