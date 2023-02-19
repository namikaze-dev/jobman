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



module.exports = {
    generateToken
}