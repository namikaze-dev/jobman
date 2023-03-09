'use strict'

const { Validator } = require('node-input-validator');
const { failedValidationResponse, serverErrorResponse, forbiddenResponse, notFoundResponse } = require("../helpers/errors");
const sanitizer = require("../helpers/sanitizer");
const { NotFound } = require("../lib/errors/http_errors");

const create = env => {
    return async (req, res) => {
        try {
            const input = {
                title: req.body.title,
                description: req.body.description,
                company_name: req.body.company_name,
                apply_url: req.body.apply_url,
                type: req.body.type,
                company_market: req.body.company_market,
                skills: req.body.skills,
                location: req.body.location,
                remote: req.body.remote,
            };

            const v = new Validator(input, {
                title: 'required|maxLength:500',
                description: 'required|maxLength:5000',
                company_name: 'required|maxLength:100',
                apply_url: 'required|url',
                type: 'in:fulltime,remote,hybrid',
                company_market: 'maxLength:100',
                skills: 'array',
                'skills.*': 'string',
                location: 'string',
                remote: 'boolean'
            });

            if (!await v.check()) {
                failedValidationResponse(res, sanitizer.validationErr(v.errors));
                return;
            }

            const job = await env.models.jobs.insert(req.user.id, input);

            res.send(sanitizer.job(job));
        } catch (err) {
            serverErrorResponse(res, err);
        }
    }
}

const update = env => {
    return async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            if (!id) {
                failedValidationResponse(res, { id: "id must be an integer number" });
                return;
            }

            const input = {
                title: req.body.title,
                description: req.body.description,
                company_name: req.body.company_name,
                apply_url: req.body.apply_url,
                type: req.body.type,
                company_market: req.body.company_market,
                skills: req.body.skills,
                location: req.body.location,
                remote: req.body.remote,
            };

            const v = new Validator(input, {
                title: 'maxLength:500',
                description: 'maxLength:5000',
                company_name: 'maxLength:100',
                apply_url: 'url',
                type: 'in:fulltime,remote,hybrid',
                company_market: 'maxLength:100',
                skills: 'array',
                'skills.*': 'string',
                location: 'string',
                remote: 'boolean'
            });

            if (!await v.check()) {
                failedValidationResponse(res, sanitizer.validationErr(v.errors));
                return;
            }

            let job = await env.models.jobs.getById(id);

            if (req.user.id != job.user_id) {
                forbiddenResponse(res);
                return;
            }

            for (const [k, v] of Object.entries(input)) {
                if (v) {
                    job[k] = v;
                }
            }

            job = await env.models.jobs.update(job);

            res.send(sanitizer.job(job));
        } catch (err) {
            if (err instanceof NotFound) {
                notFoundResponse(res, err.message);
                return
            }

            serverErrorResponse(res, err);
        }
    }
}

const remove = env => {
    return async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            if (!id) {
                failedValidationResponse(res, { id: "id must be an integer number" });
                return;
            }

            let job = await env.models.jobs.getById(id);

            if (req.user.id != job.user_id) {
                forbiddenResponse(res);
                return;
            }

            await env.models.jobs.delete(id);

            res.status(200).send({ message: "Delete Ok" })
        } catch (err) {
            if (err instanceof NotFound) {
                notFoundResponse(res, err.message);
                return;
            }

            serverErrorResponse(res, err);
        }
    }
}

const get = env => {
    return async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            if (!id) {
                failedValidationResponse(res, { id: "id must be an integer number" });
                return;
            }

            const job = await env.models.jobs.getById(id);

            res.status(200).send(sanitizer.job(job))
        } catch (err) {
            if (err instanceof NotFound) {
                notFoundResponse(res, err.message);
                return;
            }

            serverErrorResponse(res, err);
        }
    }
}

const getAll = env => {
    return async (req, res) => {
        try {
            const jobs = await env.models.jobs.getAll();

            res.status(200).send(sanitizer.job({ jobs: jobs }))
        } catch (err) {
            serverErrorResponse(res, err);
        }
    }
}

module.exports = {
    create,
    update,
    remove,
    get,
    getAll
}