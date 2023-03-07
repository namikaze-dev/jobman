'use strict'

const crypto = require('crypto');
const base32 = require('base32');

const generateToken = (userId, expiry, type) => {
    const token = {
        user_id: userId,
        expiry,
        type
    };

    const randBytes = crypto.randomBytes(16);
    token.plain = base32.encode(randBytes);
    token.hash = crypto.createHash('sha256').update(token.plain).digest();

    return token;
}

class TokenModel {
    constructor(client) {
        this.db = client;
    }

    // helper to generate and insert at once
    async create(userId, expiry, type) {
        const token = generateToken(userId, expiry, type);
        await this.insert(userId, token);
        return token;
    }

    async insert(userId, token) {
        await this.db.query(
            `INSERT INTO tokens (user_id, hash, expiry, type)
              VALUES ($1, $2, $3, $4)`,
            [userId, token.hash, token.expiry, token.type]
        );
    }
}



module.exports = {
    generateToken,
    TokenModel
}