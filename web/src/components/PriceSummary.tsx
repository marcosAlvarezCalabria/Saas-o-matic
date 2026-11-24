import type { CostBreakdown } from '../api/types';
import type { PreviewStatus } from '../hooks/usePreview';
import { formatVatRate } from '../lib/vatRate';
import { Money } from './Money';
import { InlineAlert } from './ui';

interface PriceSummaryProps {
  rateLimited: boolean;
  result: CostBreakdown | null;
  status: PreviewStatus;
  onRetry: () => void;
}

export function PriceSummary({
  rateLimited,
  result,
  status,
  onRetry,
}: PriceSummaryProps) {
  if (status === 'error') {
    return (
      <InlineAlert action={{ label: 'Reintentar', onClick: onRetry }} variant="error">
        {rateLimited
          ? 'Demasiadas peticiones. Espera un momento y vuelve a intentarlo.'
          : 'No se pudo calcular el precio.'}
      </InlineAlert>
    );
  }

  if (result === null) {
    return (
      <div className="rounded-card border border-border bg-primary-soft p-6 text-center font-medium text-text-muted lg:p-4">
        Calculando…
      </div>
    );
  }

  return (
    <div
      aria-live="polite"
      className={`rounded-card border border-border bg-primary-soft p-6 transition-opacity duration-150 lg:grid lg:grid-cols-3 lg:items-center lg:gap-4 lg:p-4 ${status === 'refreshing' ? 'opacity-50' : ''}`}
    >
      <div className="flex justify-between gap-4 text-sm font-medium text-text-muted">
        <span>Base</span>
        <span className="text-text">
          <Money cents={result.baseCents} />
        </span>
      </div>
      <div className="mt-3 flex justify-between gap-4 text-sm font-medium text-text-muted lg:mt-0">
        <span>IVA ({formatVatRate(result.vatRateBasisPoints)})</span>
        <span className="text-text">
          <Money cents={result.vatCents} />
        </span>
      </div>
      <div className="mt-5 flex flex-wrap items-end justify-between gap-4 border-t border-border pt-5 lg:mt-0 lg:border-l lg:border-t-0 lg:pl-4 lg:pt-0">
        <span className="text-caption uppercase text-text-muted">
          Total mensual
        </span>
        <span className="ml-auto max-w-full text-right text-amount-sm text-text">
          <Money cents={result.totalCents} suffix="/ mes" />
        </span>
      </div>
    </div>
  );
}
