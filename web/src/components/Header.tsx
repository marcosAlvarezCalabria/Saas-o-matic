import { Link } from 'react-router';

import { CurrencySelector } from './CurrencySelector';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 h-16 border-b border-border bg-surface">
      <div className="flex h-full w-full items-center justify-between gap-4 px-4 md:px-8">
        <Link
          className="shrink-0 text-title-sm text-link md:text-title-md"
          to="/"
        >
          SaaS-O-Matic
        </Link>

        <div className="flex items-center gap-2 md:gap-4">
          <CurrencySelector />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
