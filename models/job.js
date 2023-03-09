'use strict'

const { Conflict, BadRequest, NotFound } = require("../lib/errors/http_errors");

class JobModel {
    constructor(dbClient) {
        this.db = dbClient;
    }

    async insert(userId, job) {
        try {
            const result = await this.db.query(
                `INSERT INTO jobs 
                  (user_id, title, description, company_name, type, skills, location, remote, apply_url)
                  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                  RETURNING *`,
                [userId, job.title, job.description, job.company_name, job.type || 'fulltime',
                  job.skills || null, job.location || null, job.remote || false, job.apply_url]
            );

            return result.rows[0];
        } catch (err) {
            if (err.code == '23502') {
                throw new BadRequest('job missing required values')
            }

            throw err;
        }
    }

    async getById(id) {
        try {
            const result = await this.db.query(
                `SELECT * FROM jobs
                  WHERE id = $1`,
                [id]
            );

            if (result.rowCount == 0) {
                throw new NotFound('job with id does not exist')
            }

            return result.rows[0];
        } catch (err) {
            throw err;
        }
    }

    async update(job) {
        try {
            // user_id, title, description, company_name, type, skills, location, remote, apply_url
            const result = await this.db.query(
                `UPDATE jobs
                  SET title = $1, description = $2, company_name = $3, type = $4, skills = $5, 
                    location = $6, remote = $7, apply_url = $8, version = version + 1
                  WHERE id = $9 AND version = $10
                  RETURNING *`,
                [job.title, job.description, job.company_name, job.type, job.skills,
                job.location, job.remote, job.apply_url, job.id, job.version]
            )

            return result.rows[0];
        } catch (err) {
            throw err;
        }
    }
}

module.exports = JobModel;