import {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
  useState,
} from 'react';

import {
  type ExchangeRatesStatus,
  useExchangeRates,
} from '../hooks/useExchangeRates';

export const SUPPORTED_CURRENCIES = [
  'EUR',
  'USD',
  'GBP',
  'CHF',
  'SEK',
  'PLN',
] as const;

export type Currency = (typeof SUPPORTED_CURRENCIES)[number];

interface CurrencyContextValue {
  currency: Currency;
  rate: number;
  availableCurrencies: readonly Currency[];
  ratesStatus: ExchangeRatesStatus;
  updatedAt: string | null;
  setCurrency(currency: Currency): void;
  retryRates(): void;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

interface CurrencyProviderProps {
  children: ReactNode;
}

export function CurrencyProvider({ children }: CurrencyProviderProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('EUR');
  const { status, rates, updatedAt, retry } = useExchangeRates();

  const availableCurrencies = useMemo<readonly Currency[]>(() => {
    if (status !== 'success' || rates === null) {
      return ['EUR'];
    }

    return SUPPORTED_CURRENCIES.filter(
      (currency) => typeof rates[currency] === 'number',
    );
  }, [rates, status]);

  const currency =
    status === 'success' && availableCurrencies.includes(selectedCurrency)
      ? selectedCurrency
      : 'EUR';
  const rate = currency === 'EUR' ? 1 : (rates?.[currency] ?? 1);

  const value = useMemo<CurrencyContextValue>(
    () => ({
      currency,
      rate,
      availableCurrencies,
      ratesStatus: status,
      updatedAt,
      setCurrency: setSelectedCurrency,
      retryRates: retry,
    }),
    [availableCurrencies, currency, rate, retry, status, updatedAt],
  );

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyContextValue {
  const context = useContext(CurrencyContext);
  if (context === null) {
    throw new Error('useCurrency must be used inside CurrencyProvider');
  }

  return context;
}
