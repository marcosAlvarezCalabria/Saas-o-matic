export type CountryCode =
  | 'AT'
  | 'BE'
  | 'BG'
  | 'CY'
  | 'CZ'
  | 'DE'
  | 'DK'
  | 'EE'
  | 'ES'
  | 'FI'
  | 'FR'
  | 'GB'
  | 'GR'
  | 'HR'
  | 'HU'
  | 'IE'
  | 'IT'
  | 'LT'
  | 'LU'
  | 'LV'
  | 'MT'
  | 'NL'
  | 'PL'
  | 'PT'
  | 'RO'
  | 'SE'
  | 'SI'
  | 'SK';

export type Plan = 'basic' | 'pro' | 'enterprise';

export interface Customer {
  id: number;
  companyName: string;
  taxId: string;
  email: string;
  country: CountryCode;
  plan: Plan;
  createdAt: string;
}

export interface CreateCustomerInput {
  companyName: string;
  taxId: string;
  email: string;
  country: CountryCode;
  plan: Plan;
}

export interface CostBreakdown {
  baseCents: number;
  vatRateBasisPoints: number;
  vatCents: number;
  totalCents: number;
}

export interface Simulation extends CostBreakdown {
  id: number;
  customerId: number;
  users: number;
  storageGb: number;
  apiCalls: number;
  createdAt: string;
}

export interface PreviewInput {
  customerId: number;
  users: number;
}

export interface CreateSimulationInput extends PreviewInput {
  storageGb?: number;
  apiCalls?: number;
}

export type ApiErrorCode =
  | 'VALIDATION_ERROR'
  | 'INVALID_TAX_ID'
  | 'COUNTRY_NOT_SUPPORTED'
  | 'TAX_ID_ALREADY_EXISTS'
  | 'CUSTOMER_NOT_FOUND'
  | 'NOT_FOUND'
  | 'RATE_LIMITED'
  | 'INTERNAL_ERROR'
  | 'UNKNOWN';
