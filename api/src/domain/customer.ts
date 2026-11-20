import { DomainError } from './errors.js';

export const CUSTOMER_PLANS = ['basic', 'pro', 'enterprise'] as const;

export type CustomerPlan = (typeof CUSTOMER_PLANS)[number];

export interface Customer {
  id: number;
  companyName: string;
  taxId: string;
  email: string;
  country: string;
  plan: CustomerPlan;
  createdAt: string;
}

export interface ValidatedCustomerFields {
  companyName: string;
  companyNameSearch: string;
  email: string;
  country: string;
  plan: CustomerPlan;
}

export interface CustomerFieldsInput {
  companyName?: string;
  email?: string;
  country?: string;
  plan?: string;
}

const BASIC_EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const COUNTRY_PATTERN = /^[A-Z]{2}$/;

export function validateCustomerFields(input: CustomerFieldsInput): ValidatedCustomerFields {
  const companyName = input.companyName?.trim() ?? '';
  const email = input.email ?? '';
  const country = input.country?.trim().toUpperCase() ?? '';
  const plan = input.plan ?? '';

  if (companyName.length < 2 || companyName.length > 100) {
    throw validationError('nombre de empresa no válido');
  }

  if (!BASIC_EMAIL_PATTERN.test(email)) {
    throw validationError('email no válido');
  }

  if (!isCustomerPlan(plan)) {
    throw validationError('plan no válido');
  }

  if (!COUNTRY_PATTERN.test(country)) {
    throw validationError('país no válido');
  }

  return {
    companyName,
    companyNameSearch: normalizeCompanyNameForSearch(companyName),
    email,
    country,
    plan,
  };
}

export function normalizeCompanyNameForSearch(companyName: string): string {
  return companyName
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');
}

function isCustomerPlan(plan: string): plan is CustomerPlan {
  return CUSTOMER_PLANS.some((allowedPlan) => allowedPlan === plan);
}

function validationError(message: string): DomainError {
  return new DomainError('VALIDATION_ERROR', message);
}
