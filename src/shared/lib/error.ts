export class ResponseError extends Error {
  readonly response: Response;

  constructor(message: string, response: Response) {
    super(message);
    this.name = 'ResponseError';
    this.response = response;
  }
}

export function getUnknownErrorMessage(value: unknown): string | undefined {
  if (value && typeof value === 'object' && 'message' in value && typeof value.message === 'string') {
    return value.message;
  }
  return undefined;
}
