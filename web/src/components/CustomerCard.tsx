import { Mail } from 'lucide-react';
import { Link } from 'react-router';

import type { Customer } from '../api/types';
import { COUNTRIES } from '../lib/countries';
import { CountryBadge, Icon, PlanBadge } from './ui';

interface CustomerCardProps {
  customer: Customer;
}

export function CustomerCard({ customer }: CustomerCardProps) {
  const countryName =
    COUNTRIES.find(({ code }) => code === customer.country)?.name ??
    customer.country;

  return (
    <Link
      className="flex h-full flex-col rounded-card border border-border bg-surface p-6 transition-colors hover:border-input-border"
      to={`/customers/${customer.id}`}
    >
      <div className="flex items-center justify-between gap-3">
        <CountryBadge code={customer.country} name={countryName} />
        <PlanBadge plan={customer.plan} />
      </div>

      <h2 className="mt-4 text-title-sm text-text">{customer.companyName}</h2>
      <p className="mt-1 text-sm text-text-muted">
        NIF: <span className="font-medium text-text">{customer.taxId}</span>
      </p>

      <div className="mt-4 flex min-w-0 items-center gap-2 border-t border-border pt-4 text-sm text-text-muted">
        <Icon className="shrink-0" icon={Mail} size={18} />
        <span className="truncate">{customer.email}</span>
      </div>

      <div className="mt-4 border-t border-border pt-4 text-label text-link">
        Ver detalle y simular →
      </div>
    </Link>
  );
}
