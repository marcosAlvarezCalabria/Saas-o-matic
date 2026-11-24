import { Globe2 } from 'lucide-react';

import type { Customer } from '../api/types';
import { COUNTRIES } from '../lib/countries';
import { Card, Icon, PlanBadge } from './ui';

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
}

function formatCreatedAt(createdAt: string): string {
  return new Intl.DateTimeFormat('es-ES', { dateStyle: 'long' }).format(
    new Date(createdAt),
  );
}

interface CustomerSummaryProps {
  customer: Customer;
}

export function CustomerSummary({ customer }: CustomerSummaryProps) {
  const countryName =
    COUNTRIES.find(({ code }) => code === customer.country)?.name ??
    customer.country;

  return (
    <Card padding="compact">
      <div className="lg:flex lg:items-center lg:gap-6">
        <div className="flex min-w-0 flex-wrap items-center gap-4 lg:w-1/3 lg:flex-nowrap">
          <span className="flex h-12 w-12 items-center justify-center rounded-card bg-primary-soft text-title-md text-link">
            {getInitials(customer.companyName)}
          </span>
          <h1
            className="min-w-0 flex-1 text-title-lg text-text lg:truncate lg:text-title-md"
            title={customer.companyName}
          >
            {customer.companyName}
          </h1>
          <PlanBadge plan={customer.plan} />
        </div>

        <dl className="mt-6 grid grid-cols-1 gap-6 border-t border-border pt-6 md:grid-cols-2 lg:mt-0 lg:w-2/3 lg:grid-cols-4 lg:border-0 lg:pt-0">
          <div className="min-w-0">
            <dt className="text-caption uppercase text-text-muted">NIF / CIF</dt>
            <dd
              className="mt-1 truncate font-medium text-text"
              title={customer.taxId}
            >
              {customer.taxId}
            </dd>
          </div>
          <div className="min-w-0">
            <dt className="text-caption uppercase text-text-muted">País</dt>
            <dd className="mt-1 flex min-w-0 items-center gap-2 font-medium text-text">
              <Icon className="shrink-0" icon={Globe2} size={18} />
              <span className="truncate" title={countryName}>
                {countryName}
              </span>
            </dd>
          </div>
          <div className="min-w-0">
            <dt className="text-caption uppercase text-text-muted">Email</dt>
            <dd className="mt-1 truncate font-medium">
              <a
                className="text-link hover:underline"
                href={`mailto:${customer.email}`}
              >
                {customer.email}
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-caption uppercase text-text-muted">
              Fecha de alta
            </dt>
            <dd
              className="mt-1 truncate font-medium text-text"
              title={formatCreatedAt(customer.createdAt)}
            >
              {formatCreatedAt(customer.createdAt)}
            </dd>
          </div>
        </dl>
      </div>
    </Card>
  );
}
