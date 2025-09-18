export class InvalidArgumentError extends Error {
  constructor(message: string) {
    super('invalid argument, ' + message);
  }
}

export class NotFound extends Error {
  constructor(message?: string) {
    if (message) {
      super(message);
    }
    super('not found');
  }
}
