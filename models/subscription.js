'use strict'

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
}



module.exports = {
    SubscriptionModel
}