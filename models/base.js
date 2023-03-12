import UserModel from './user.js';
import TokenModel  from './token.js';
import JobModel from './job.js';
import SubscriptionModel from './subscription.js';

class Models {
    constructor(db) {
        this.users = new UserModel(db);
        this.tokens = new TokenModel(db);
        this.jobs = new JobModel(db);
        this.subscription = new SubscriptionModel(db);
    }
}

export default Models;