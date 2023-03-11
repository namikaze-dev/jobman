'use strict'

const Router = require('express').Router;
const { signup, activated, login } = require('../handlers/user');

const route = env => {
    const router = Router();

    router.post('/signup', signup(env));
    router.post('/activated/:token', activated(env));
    router.get('/login', login(env));

    return router;
}

module.exports = route;