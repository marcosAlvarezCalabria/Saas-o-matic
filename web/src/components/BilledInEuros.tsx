import { useCurrency } from '../context/CurrencyContext';
import { convertCents, formatMoney } from '../lib/money';

interface BilledInEurosProps {
  cents: number;
  suffix?: string;
  variant: 'full' | 'short';
}

export function BilledInEuros({
  cents,
  suffix,
  variant,
}: BilledInEurosProps) {
  const { currency } = useCurrency();

  if (currency === 'EUR') return null;

  const amount = formatMoney(convertCents(cents, 1), 'EUR');

  if (variant === 'short') {
    return (
      <span className="block text-caption text-text-muted">
        se factura <span className="tabular-nums">{amount}</span>
      </span>
    );
  }

  return (
    <p className="mt-2 border-t border-dashed border-border pt-2 text-sm text-text-muted">
      Se factura en euros:{' '}
      <strong className="font-medium text-text tabular-nums">
        {amount}
        {suffix ? ` ${suffix}` : null}
      </strong>
    </p>
  );
}
