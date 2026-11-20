export type ApplicationErrorCode = 'CUSTOMER_NOT_FOUND' | 'TAX_ID_ALREADY_EXISTS';

export class ApplicationError extends Error {
  constructor(
    public readonly code: ApplicationErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'ApplicationError';
  }
}
