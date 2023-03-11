'use strict'

require('dotenv').config();

const db = require('./config/db');
const Models = require('../jobman/models/base.js');
const appFactory = require('./app');

// setup dependencies
const env = {
    models: new Models(db)
};

const app = appFactory(env);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log('server listening on', PORT);
})
