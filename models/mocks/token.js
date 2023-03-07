'use strict'

const crypto = require('crypto');

const tokenModel = {
    async create(id, expiry, type) {
        return {
            plain: 'tokenTOKEN0123456789abcde',
            hash: crypto.createHash('sha256').update('tokenTOKEN0123456789abcde').digest()
        }
    }
}

module.exports = tokenModel;