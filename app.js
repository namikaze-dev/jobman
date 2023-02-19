'use strict'

const express = require('express');

module.exports = (env) => {
    const app = express();

    // register middlewares
    app.use(express.json());

    // register routes
    app.use(require('./routes/user')(env));

    return app;
}