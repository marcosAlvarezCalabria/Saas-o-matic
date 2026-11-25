import { useCurrency } from '../context/CurrencyContext';
import { convertCents, formatMoney } from '../lib/money';

interface MoneyProps {
  cents: number;
  suffix?: string;
}

export function Money({ cents, suffix }: MoneyProps) {
  const { currency, rate } = useCurrency();
  const amount = formatMoney(convertCents(cents, rate), currency);
  const displayedAmount = currency === 'EUR' ? amount : `≈\u00a0${amount}`;

  return (
    <span className="inline-flex max-w-full flex-wrap items-baseline justify-end gap-x-2 tabular-nums">
      <span>{displayedAmount}</span>
      {suffix ? (
        <span className="text-base font-normal text-text-muted">{suffix}</span>
      ) : null}
    </span>
  );
}
