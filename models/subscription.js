'use strict'

const { NotFound } = require("../lib/errors/http_errors");

class SubscriptionModel {
    constructor(client) {
        this.db = client;
    }

    async create(userId) {
        const result = await this.db.query(
            `INSERT INTO 
              subscriptions (user_id, tags, created_at)
              VALUES ($1, $2, now())
              RETURNING *
              `,
            [userId, []]
        );

        return result.rows[0];
    }

    async get(userId) {
        const result = await this.db.query(
            `SELECT subscriptions.id, tags, active, subscriptions.created_at, subscriptions.version
              FROM subscriptions
              JOIN users on users.id = user_id
              WHERE user_id = $1`,
            [userId]
        );

        if (result.rowCount == 0) {
            throw new NotFound('No subscription exists for current user ')
        }

        return result.rows[0];
    }
}



module.exports = {
    SubscriptionModel
}