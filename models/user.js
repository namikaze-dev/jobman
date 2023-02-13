'use strict'

const { Conflict, NotFound } = require('../lib/errors/http_errors');
const bcrypt = require('bcrypt');

class UserModel {
    constructor(dbClient) {
        this.db = dbClient;
    }

    async insert(user) {
        try {
            const stmt = `
            INSERT INTO users (name, email, password_hash, activated)
            VALUES ($1, $2, $3, false)
            RETURNING *`;
            const args = [user.name, user.email, user.password_hash];

            const result = await this.db.query(stmt, args);
            
            return result.rows[0];
        } catch (err) {
            // code 23505 denotes error code of unique constraint violation
            if (err.code == '23505') {
                throw new Conflict('user email conflict');
            } 
            throw err;
        }
    }


    async getByEmail(email) {
        try {
            const stmt = 'SELECT * FROM  users WHERE email = $1';
            const result = await this.db.query(stmt, [email]);
            
            if (result.rowCount == 0) {
                throw new NotFound()
            }

            return result.rows[0];
        } catch (err) {
            throw err;
        }
    }

    async update(user) {
        try {
            const stmt = `
            UPDATE users 
            SET name = $1, email = $2, password_hash = $3, activated = $4, version = version + 1
            WHERE id = $5 AND version = $6        
            RETURNING version`;
            const args = [user.name, user.email, user.password_hash, user.activated, user.id, user.version];

            const result = await this.db.query(stmt, args);

            // race condition check
            if (result.rowCount == 0) {
                throw new Conflict();
            }

            user.version = result.rows[0].version;
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