'use strict'

const { Validator } = require('node-input-validator');
const stripe = require("stripe")(process.env.STRIPE_KEY);
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
                type: 'in:fulltime,part-time,contract,internship,freelance',
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

            res.send(sanitizer.job({ job: job }));
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
                type: 'in:fulltime,part-time,contract,internship,freelance',
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

            res.send(sanitizer.job({ job: job }));
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

            res.status(200).send(sanitizer.job({ job: job }))
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
            const input = {
                title: req.query.title || "",
                company_name: req.query.company_name || "",
                company_market: req.query.market || "",
                location: req.query.location || "",
                skills: typeof req.query.skills == 'string' ? req.query.skills.split(",") : [],
                type: req.query.type || "",
                remote: req.query.remote || false,
                // pagination & sort params
                page: parseInt(req.query.page) || 1,
                page_size: parseInt(req.query.page_size) || 10,
                sort: req.query.sort || "id",
            }

            const v = new Validator(input, {
                title: 'maxLength:500',
                company_name: 'maxLength:100',
                type: 'in:fulltime,part-time,contract,internship,freelance',
                company_market: 'maxLength:100',
                skills: 'array',
                'skills.*': 'string',
                location: 'string',
                remote: 'boolean',

                page: 'integer|min:1|max:10000000',
                page_size: 'integer|min:1|max:1000',
                sort: 'string|in:id,title,company_name,-id,-title,-company_name'
            });

            if (!await v.check()) {
                failedValidationResponse(res, sanitizer.validationErr(v.errors));
                return;
            }

            input.sort_direction = 'ASC';
            if (input.sort) {
                [input.sort, input.sort_direction] = setupSortParam(input.sort);
            }

            const jobs = await env.models.jobs.getAll(input);

            res.status(200).send(sanitizer.job({ jobs: jobs }))
        } catch (err) {
            serverErrorResponse(res, err);
        }
    }
}

const createPaymentIntent = env => {
    return async (req, res) => {
        try {
            const amount = process.env.SUBSCRIPTION_COST;

            const paymentIntent = await stripe.paymentIntents.create({
                amount: parseInt(amount),
                currency: "usd",
                automatic_payment_methods: {
                    enabled: true,
                },
            });

            res.send({ clientSecret: paymentIntent.client_secret });
        } catch (err) {
            serverErrorResponse(res, err);
        }
    }
}

const subscribe = env => {
    return async (req, res) => {
        try {
            const paymentIntent = await stripe.paymentIntents.retrieve(req.query.payment_intent);

            if (paymentIntent.status != 'succeeded') {
                console.log(`payment-intent: ${paymentIntent}`);
                forbiddenResponse(res, "Invalid payment");
                return;
            }

            const user = await env.models.users.getByEmail(paymentIntent.receipt_email);
            const result = await env.models.subscription.create(user.id);

            res.send(result);
        } catch (err) {
            if (err.code == '23505') {
                res.send({ "message": "user is already subscribed" })
            }

            serverErrorResponse(res, err);
        }
    }
}

const setupSortParam = param => {
    return param.startsWith('-') ? [param.slice(1), 'DESC'] : [param, 'ASC']
}

module.exports = {
    create,
    update,
    remove,
    get,
    getAll,
    createPaymentIntent,
    subscribe
}