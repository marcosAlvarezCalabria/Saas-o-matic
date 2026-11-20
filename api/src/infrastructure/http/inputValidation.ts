import type { CreateCustomerInput } from '../../application/createCustomer.js';

const CUSTOMER_FIELDS = ['companyName', 'taxId', 'email', 'country', 'plan'] as const;

export function parseCreateCustomerInput(body: unknown): CreateCustomerInput | null {
  if (!isRecord(body)) {
    return null;
  }

  for (const field of CUSTOMER_FIELDS) {
    if (typeof body[field] !== 'string') {
      return null;
    }
  }

  return {
    companyName: body.companyName as string,
    taxId: body.taxId as string,
    email: body.email as string,
    country: body.country as string,
    plan: body.plan as string,
  };
}

export function parseCustomerId(value: string): number | null {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
