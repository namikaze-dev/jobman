'use strict'

const { Conflict, NotFound } = require('../lib/errors/http_errors');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

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
                throw new Conflict('User with email already exists');
            } 
            throw err;
        }
    }


    async getByEmail(email) {
        const stmt = 'SELECT * FROM  users WHERE email = $1';
        const result = await this.db.query(stmt, [email]);

        if (result.rowCount == 0) {
            throw new NotFound('User with email does not exist')
        }

        return result.rows[0];
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
                throw new Conflict('Edit conflict');
            }

            user.version = result.rows[0].version;
        } catch (err) {
            // code 23505 denotes error code of unique constraint violation
            if (err.code == '23505') {
                throw new Conflict('User with email already exists');
            }
            throw err;
        }
    }

    async getForToken(token, type) {
        const tokenHash = crypto.createHash('sha256').update(token).digest()

        const result = await this.db.query(
            `SELECT id, name, email, password_hash, activated, version 
                  FROM users 
                  JOIN tokens ON id = user_id
                  WHERE hash = $1
                  AND type = $2
                  AND expiry > $3`,
            [tokenHash, type, new Date()]
        );

        if (result.rowCount == 0) {
            throw new NotFound('No user exists for given token')
        }

        return result.rows[0];
    }

    async hashPassword(password) {
        return await bcrypt.hash(password, 10);
    }

    async validatePassword(passwordHash, providedPassword) {
        return await bcrypt.compare(providedPassword, passwordHash.toString());
    }
}

module.exports = UserModel;