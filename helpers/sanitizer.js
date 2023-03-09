'use strict'

const validationErr = errors => {
    return JSON.parse(JSON.stringify(errors, validationErrReplacer));
};

const user = user => {
    return JSON.parse(JSON.stringify(user, userReplacer));
};

const job = job => {
    return JSON.parse(JSON.stringify(job, jobReplacer));
}

const userReplacer = (key, val) => {
    if (['', 'id', 'name', 'email', 'activated', 'created_at'].includes(key)) {
        return val;
    } 
    return undefined;
};

const validationErrReplacer = (key, val) => {
    if (key == 'rule') {
        return undefined;
    } else if (['name', 'email', 'password', 'token'].includes(key)) {
        return val.message;
    }
    return val;
};

const jobReplacer = (key, val) => {
    if (val == null) {
        return undefined;
    }

    if (['user_id','version'].includes(key)) {
        return undefined;
    }

    return val;
}

module.exports = {
    user,
    validationErr,
    job
}