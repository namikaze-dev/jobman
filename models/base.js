'use strict'

const UserModel = require('./user');
const { TokenModel } = require('./token')

class Models {
    constructor(db) {
        this.users = new UserModel(db);
        this.tokens = new TokenModel(db);
    }
}

module.exports = Models;