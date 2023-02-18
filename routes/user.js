'use strict'

const Router = require('express').Router;
const { signup } = require('../handlers/user');

const router = Router();

module.exports = (env) => {
    router.post('/signup', signup(env));

    return router;
};