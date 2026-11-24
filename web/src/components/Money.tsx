import { useCurrency } from '../context/CurrencyContext';
import { convertCents, formatMoney } from '../lib/money';

interface MoneyProps {
  cents: number;
  suffix?: string;
}

export function Money({ cents, suffix }: MoneyProps) {
  const { currency, rate } = useCurrency();
  const euroAmount = convertCents(cents, 1);

  if (currency === 'EUR') {
    return (
      <span className="inline-flex items-baseline gap-2 tabular-nums">
        <span>{formatMoney(euroAmount, 'EUR')}</span>
        {suffix ? (
          <span className="text-base font-normal text-text-muted">{suffix}</span>
        ) : null}
      </span>
    );
  }

  return (
    <span className="inline-flex flex-col items-end tabular-nums">
      <span className="inline-flex items-baseline gap-2">
        <span>≈ {formatMoney(convertCents(cents, rate), currency)}</span>
        {suffix ? (
          <span className="text-base font-normal text-text-muted">{suffix}</span>
        ) : null}
      </span>
      <span className="text-caption text-text-muted">
        {formatMoney(euroAmount, 'EUR')}
      </span>
    </span>
  );
}
