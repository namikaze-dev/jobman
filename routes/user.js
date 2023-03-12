import { Router } from 'express';
import * as hd from '../handlers/user.js';

const route = env => {
    const router = Router();

    router.post('/signup', hd.signup(env));
    router.post('/activated/:token', hd.activated(env));
    router.get('/login', hd.login(env));

    return router;
}

export default route;