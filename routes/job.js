'use strict'

const Router = require('express').Router;
const { create, update, remove, get, getAll } = require('../handlers/job');
const { authenticate, activate } = require('../lib/middlewares')

const route = env => {
    const router = Router();

    router.get("/jobs/:id", get(env));
    router.get("/jobs", getAll(env));
    router.post("/jobs", authenticate(env), activate(env), create(env));
    router.put("/jobs/:id", authenticate(env), activate(env), update(env));
    router.delete("/jobs/:id", authenticate(env), activate(env), remove(env));

    return router;
}

module.exports = route;