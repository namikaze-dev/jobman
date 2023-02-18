'use strict'

const validationErr = errors => {
    return JSON.parse(JSON.stringify(errors, validationErrReplacer));
};

const user = user => {
    return JSON.parse(JSON.stringify(user, userReplacer));
};

const userReplacer = (key, val) => {
    if (['', 'id', 'name', 'email', 'activated', 'created_at'].includes(key)) {
        return val;
    } 
    return undefined;
};

const validationErrReplacer = (key, val) => {
    if (key == 'rule') {
        return undefined;
    } else if (['name', 'email', 'password'].includes(key)) {
        return val.message;
    }
    return val;
};

module.exports = {
    user,
    validationErr
}