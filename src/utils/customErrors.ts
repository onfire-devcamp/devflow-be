export class AuthenticationError extends Error {
  public readonly statusCode: number;
  constructor(message: string = "Invalid email or password!") {
    super(message);
    this.statusCode = 401;
    Object.setPrototypeOf(this, AuthenticationError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends Error {
  public readonly statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = "BadRequestError";
    this.statusCode = 400;

    Object.setPrototypeOf(this, BadRequestError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends Error {
  public readonly statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = 404;

    Object.setPrototypeOf(this, NotFoundError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ForbiddenError extends Error {
  public readonly statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = "ForbiddenError";
    this.statusCode = 403;

    Object.setPrototypeOf(this, ForbiddenError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class DataIntegrityError extends Error {
  public readonly statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = "DataIntegrityError";
    this.statusCode = 500;

    Object.setPrototypeOf(this, DataIntegrityError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}
