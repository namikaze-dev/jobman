'use strict'

const { Conflict } = require('../lib/errors/http_errors');

class UserModel {
    constructor(dbClient) {
        this.db = dbClient;
    }

    async insert(user) {
        try {
            const stmt = `
            INSERT INTO users (name, email, password_hash, activated)
            VALUES ($1, $2, $3, false)
            RETURNING id, created_at, version`;
            const args = [user.name, user.email, user.password_hash];

            const result = await this.db.query(stmt, args);
            
            Object.assign(user, result.rows[0]);
        } catch (err) {
            // code 23505 denotes error code of unique constraint violation
            if (err.code == '23505') {
                throw new Conflict('user email conflict');
            } 
            throw err;
        }
    }
}

module.exports = UserModel;