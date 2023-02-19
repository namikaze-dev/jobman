'use strict'

const { Pool } = require('pg');

const dsn = process.env.DSN;

const client = new Pool({
    host: 'localhost',
    user: 'jobman',
    password: 'jobmanpassword',
    database: 'jobman'
});

client.connect()
    .then(_ => {
        console.log('db connect success');
    })
    .catch(err => {
        console.log('db connect failed, error:', err.message);
        process.exit(1)
    })

module.exports = client;