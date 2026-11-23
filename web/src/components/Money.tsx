import { useCurrency } from '../context/CurrencyContext';
import { convertCents, formatMoney } from '../lib/money';

interface MoneyProps {
  cents: number;
}

export function Money({ cents }: MoneyProps) {
  const { currency, rate } = useCurrency();
  const euroAmount = convertCents(cents, 1);

  if (currency === 'EUR') {
    return <span className="tabular-nums">{formatMoney(euroAmount, 'EUR')}</span>;
  }

  return (
    <span className="inline-flex flex-col items-end tabular-nums">
      <span>≈ {formatMoney(convertCents(cents, rate), currency)}</span>
      <span className="text-caption text-text-muted">
        {formatMoney(euroAmount, 'EUR')}
      </span>
    </span>
  );
}
