import type { ChangeEvent } from 'react';

import { type Currency, useCurrency } from '../context/CurrencyContext';

const CURRENCY_LABELS: Record<Currency, string> = {
  EUR: 'EUR (€)',
  USD: 'USD ($)',
  GBP: 'GBP (£)',
  CHF: 'CHF (Fr.)',
  SEK: 'SEK (kr)',
  PLN: 'PLN (zł)',
};

interface SelectProps {
  compact: boolean;
  className: string;
}

function CurrencySelect({ compact, className }: SelectProps) {
  const {
    currency,
    availableCurrencies,
    ratesStatus,
    setCurrency,
  } = useCurrency();
  const disabled = ratesStatus !== 'success';

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setCurrency(event.target.value as Currency);
  };

  return (
    <select
      aria-label="Divisa"
      className={`h-11 rounded-field border border-input-border bg-surface px-3 text-label text-text disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      disabled={disabled}
      id={compact ? 'currency-mobile' : 'currency-desktop'}
      value={currency}
      onChange={handleChange}
    >
      {ratesStatus === 'loading' ? (
        <option value="EUR">Cargando divisas…</option>
      ) : (
        availableCurrencies.map((availableCurrency) => (
          <option key={availableCurrency} value={availableCurrency}>
            {compact
              ? availableCurrency
              : CURRENCY_LABELS[availableCurrency]}
          </option>
        ))
      )}
    </select>
  );
}

export function CurrencySelector() {
  return (
    <>
      <CurrencySelect compact className="w-20 md:hidden" />
      <CurrencySelect compact={false} className="hidden md:block" />
    </>
  );
}
