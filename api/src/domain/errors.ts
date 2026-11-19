export type DomainErrorCode = 'VALIDATION_ERROR' | 'COUNTRY_NOT_SUPPORTED';

export class DomainError extends Error {
  constructor(
    public readonly code: DomainErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'DomainError';
  }
}
