export class ApiError extends Error {
  status: number
  constructor(message: string, status: number = 502) {
    super(message);
    this.status = status;
  }
}

export const badRequest = (message = 'Bad request') => new ApiError(message, 400);