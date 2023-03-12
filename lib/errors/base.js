class CustomError extends Error {
    constructor(msg) {
        if (new.target == CustomError) {
            throw new TypeError('Abstract class "CustomError" cannot be instantiated directly');
        }
        super(msg);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor)
    }
}

export default CustomError;