// src/utils/customErrors.ts
export class AuthenticationError extends Error {
    statusCode;
    constructor(message = "Invalid email or password!") {
        super(message);
        this.statusCode = 401;
        Object.setPrototypeOf(this, AuthenticationError.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
}
export class BadRequestError extends Error {
    statusCode;
    constructor(message) {
        super(message);
        this.name = "BadRequestError";
        this.statusCode = 400;
        Object.setPrototypeOf(this, BadRequestError.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
}
