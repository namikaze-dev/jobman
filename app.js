'use strict'

const express = require('express');
const users = require('./routes/user');
const jobs = require("./routes/job");

module.exports = (env) => {
    const app = express();

    // register middlewares
    app.use(express.json());

    // register routes
    app.use(users(env));
    app.use(jobs(env));

    return app;
}