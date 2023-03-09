'use strict'

const { Validator } = require('node-input-validator');
const { failedValidationResponse, serverErrorResponse } = require("../helpers/errors");
const sanitizer = require("../helpers/sanitizer");

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

module.exports = {
    create
}