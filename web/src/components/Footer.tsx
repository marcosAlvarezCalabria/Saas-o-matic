import { useCurrency } from '../context/CurrencyContext';

function formatUpdateDate(updatedAt: string): string {
  const date = new Date(updatedAt);
  if (Number.isNaN(date.getTime())) {
    return updatedAt;
  }

  return new Intl.DateTimeFormat('es-ES', { dateStyle: 'long' }).format(date);
}

export function Footer() {
  const { ratesStatus, updatedAt } = useCurrency();
  if (ratesStatus !== 'success' || updatedAt === null) {
    return null;
  }

  return (
    <footer className="bg-surface p-6 text-center text-sm text-text-muted">
      Tipos de cambio del {formatUpdateDate(updatedAt)}. Fuente:{' '}
      <a
        className="text-link underline"
        href="https://www.exchangerate-api.com"
      >
        ExchangeRate-API
      </a>
    </footer>
  );
}
