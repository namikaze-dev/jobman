import express from 'express';
import users from './routes/user.js';
import jobs from './routes/job.js';

export default (env) => {
    const app = express();

    // register middlewares
    app.use(express.static("templates"));
    app.use(express.json());

    // register routes
    app.use(users(env));
    app.use(jobs(env));

    return app;
};