'use strict'

const Router = require('express').Router;
const { signup, activated } = require('../handlers/user');

const router = Router();

module.exports = (env) => {
    router.post('/signup', signup(env));
    router.post('/activated/:token', activated(env));

    return router;
};