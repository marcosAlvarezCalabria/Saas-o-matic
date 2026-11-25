import type { ChangeEvent } from 'react';

import { type Currency, useCurrency } from '../context/CurrencyContext';

export function CurrencySelector() {
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
      className="h-11 w-20 rounded-field border border-input-border bg-surface px-3 text-label text-text disabled:cursor-not-allowed disabled:opacity-50 md:w-24"
      disabled={disabled}
      id="currency"
      value={currency}
      onChange={handleChange}
    >
      {ratesStatus === 'loading' ? (
        <option value="EUR">Cargando divisas…</option>
      ) : (
        availableCurrencies.map((availableCurrency) => (
          <option key={availableCurrency} value={availableCurrency}>
            {availableCurrency}
          </option>
        ))
      )}
    </select>
  );
}
