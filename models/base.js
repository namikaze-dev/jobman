'use strict'

const UserModel = require('./user');
const { TokenModel } = require('./token');
const JobModel = require("./job");
const { SubscriptionModel } = require("./subscription");

class Models {
    constructor(db) {
        this.users = new UserModel(db);
        this.tokens = new TokenModel(db);
        this.jobs = new JobModel(db);
        this.subscription = new SubscriptionModel(db);
    }
}

module.exports = Models;