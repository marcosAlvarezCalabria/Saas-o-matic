import { Plus, Search } from 'lucide-react';

import { Button, Icon } from './ui';

interface CustomerToolbarProps {
  search: string;
  onNewCustomer: () => void;
  onSearchChange: (search: string) => void;
}

export function CustomerToolbar({
  search,
  onNewCustomer,
  onSearchChange,
}: CustomerToolbarProps) {
  return (
    <div className="sticky top-12 z-40 border-b border-border bg-bg py-3 md:top-16">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-end gap-3 px-4 md:px-6 lg:px-12">
        <div className="relative min-w-0 flex-1 md:w-72 md:flex-none lg:w-96">
          <label className="sr-only" htmlFor="customer-search">
            Buscar por nombre o identificador fiscal
          </label>
          <Icon
            className="pointer-events-none absolute inset-y-0 left-4 my-auto text-text-muted"
            icon={Search}
            size={20}
          />
          <input
            aria-label="Buscar por nombre o identificador fiscal"
            className="h-11 w-full rounded-field border border-input-border bg-surface pl-12 pr-4 text-base text-text placeholder:text-text-muted"
            id="customer-search"
            placeholder="Buscar por nombre o identificador fiscal"
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </div>
        <button
          aria-label="Nuevo cliente"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary hover:bg-primary-hover md:hidden"
          type="button"
          onClick={onNewCustomer}
        >
          <Icon icon={Plus} size={20} />
        </button>
        <Button
          className="hidden md:inline-flex"
          icon={Plus}
          onClick={onNewCustomer}
        >
          Nuevo cliente
        </Button>
      </div>
    </div>
  );
}
