'use strict'

const Router = require('express').Router;
const { create } = require('../handlers/job');
const { authenticate } = require('../lib/middlewares')

const router = Router();

module.exports = (env) => {
    router.post("/jobs", authenticate(env), create(env));

    return router;
};