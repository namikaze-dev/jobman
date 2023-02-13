'use strict'

const UserModel = require('./user');

class Models {
    constructor(db) {
        this.users = new UserModel(db);
    }
}

module.exports = Models;