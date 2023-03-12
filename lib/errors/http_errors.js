import CustomError from './base.js';

class BadRequest extends CustomError {
    constructor(msg) {
        if (arguments.length == 0) {
            super('bad request');
        } else {
            super(msg);
        }
    }
}

class NotFound extends CustomError {
    constructor(msg) {
        if (arguments.length == 0) {
            super('not found');
        } else {
            super(msg);
        }
    }
}

class Conflict extends CustomError {
    constructor(msg) {
        if (arguments.length == 0) {
            super('conflict');
        } else {
            super(msg);
        }
    }
}

class Unauthorized extends CustomError {
    constructor(msg) {
        if (arguments.length == 0) {
            super('unauthorized');
        } else {
            super(msg);
        }
    }
}

export {
    Conflict,
    NotFound,
    Unauthorized,
    BadRequest
};