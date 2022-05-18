export default class ValidationError extends Error {
  constructor(message: string, statusCode: number) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = statusCode;
  }

  statusCode!:number;
}
