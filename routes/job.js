'use strict'

const Router = require('express').Router;
const { create, update } = require('../handlers/job');
const { authenticate } = require('../lib/middlewares')

const router = Router();

module.exports = (env) => {
    router.post("/jobs", authenticate(env), create(env));
    router.put("/jobs/:id", authenticate(env), update(env));

    return router;
};