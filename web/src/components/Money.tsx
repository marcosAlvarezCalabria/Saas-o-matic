import { useCurrency } from '../context/CurrencyContext';
import { convertCents, formatMoney } from '../lib/money';

interface MoneyProps {
  cents: number;
  suffix?: string;
  variant?: 'stacked' | 'inline';
}

export function Money({ cents, suffix, variant = 'stacked' }: MoneyProps) {
  const { currency, rate } = useCurrency();
  const euroAmount = convertCents(cents, 1);

  if (currency === 'EUR') {
    return (
      <span className="inline-flex max-w-full flex-wrap items-baseline justify-end gap-x-2 tabular-nums">
        <span>{formatMoney(euroAmount, 'EUR')}</span>
        {suffix ? (
          <span className="text-base font-normal text-text-muted">{suffix}</span>
        ) : null}
      </span>
    );
  }

  const convertedAmount = `≈\u00a0${formatMoney(
    convertCents(cents, rate),
    currency,
  )}`;

  if (variant === 'inline') {
    return <span className="tabular-nums">{convertedAmount}</span>;
  }

  return (
    <span className="inline-flex max-w-full flex-col items-end tabular-nums">
      <span className="flex max-w-full flex-wrap items-baseline justify-end gap-x-2">
        <span>{convertedAmount}</span>
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
