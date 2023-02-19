'use strict'

const express = require('express');

const db = require('./config/db');
const Models = new require('../jobman/models/base.js');

const app = express();

// setup dependencies
const env = {
    models: new Models(db)
};

// register middlewares
app.use(express.json());

// register routes
app.use(require('./routes/user')(env));

module.exports = app;