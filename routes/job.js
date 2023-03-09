'use strict'

const Router = require('express').Router;
const { create, update, remove, get } = require('../handlers/job');
const { authenticate } = require('../lib/middlewares')

const router = Router();

module.exports = (env) => {
    router.get("/jobs/:id", get(env));
    router.post("/jobs", authenticate(env), create(env));
    router.put("/jobs/:id", authenticate(env), update(env));
    router.delete("/jobs/:id", authenticate(env), remove(env));

    return router;
};