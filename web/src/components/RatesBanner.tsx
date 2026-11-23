import { AlertTriangle } from 'lucide-react';

import { useCurrency } from '../context/CurrencyContext';

export function RatesBanner() {
  const { ratesStatus, retryRates } = useCurrency();
  if (ratesStatus !== 'error') {
    return null;
  }

  return (
    <div className="bg-warning-soft text-warning" role="status">
      <div className="flex w-full items-center justify-between gap-3 px-4 py-2 md:px-8">
        <div className="flex items-start gap-2 text-sm font-medium">
          <AlertTriangle
            aria-hidden="true"
            className="mt-0.5 shrink-0"
            size={20}
          />
          <p>
            No se pudieron cargar los tipos de cambio. Los importes se muestran
            en euros.
          </p>
        </div>

        <button
          className="min-h-11 shrink-0 px-2 text-label underline"
          type="button"
          onClick={retryRates}
        >
          Reintentar
        </button>
      </div>
    </div>
  );
}
