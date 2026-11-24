import { useState } from 'react';
import { Building2, CloudOff, Plus, Search } from 'lucide-react';

import { CustomerCard } from '../components/CustomerCard';
import { Button, Icon, Spinner, StatusPanel } from '../components/ui';
import { useCustomers } from '../hooks/useCustomers';
import { useDebouncedValue } from '../hooks/useDebouncedValue';

function StatusIcon({
  icon,
  variant = 'neutral',
}: {
  icon: typeof Search;
  variant?: 'neutral' | 'primary' | 'danger';
}) {
  const styles = {
    neutral: 'bg-bg text-text-muted',
    primary: 'bg-primary-soft text-link',
    danger: 'bg-danger-soft text-danger',
  };

  return (
    <span
      className={`flex h-12 w-12 items-center justify-center rounded-full ${styles[variant]}`}
    >
      <Icon icon={icon} size={24} />
    </span>
  );
}

export function DashboardPage() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 300);
  const { status, customers, retry } = useCustomers(debouncedSearch);
  const hasSearch = debouncedSearch.trim().length > 0;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6 lg:px-12 lg:py-12">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-title-lg text-text">Clientes</h1>
          <p className="mt-1 text-sm text-text-muted">
            Alta de clientes y simulación de su coste mensual.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row">
          <div className="relative w-full md:w-72 lg:w-96">
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
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <Button className="w-full md:w-auto" icon={Plus}>
            Nuevo cliente
          </Button>
        </div>
      </div>

      <div className="mt-8 lg:mt-12">
        {status === 'loading' ? (
          <StatusPanel
            icon={<Spinner label="Cargando clientes" />}
            title="Cargando clientes…"
          />
        ) : null}

        {status === 'error' ? (
          <StatusPanel
            action={
              <Button variant="danger" onClick={retry}>
                Reintentar
              </Button>
            }
            icon={<StatusIcon icon={CloudOff} variant="danger" />}
            text="Comprueba tu conexión e inténtalo de nuevo."
            title="No se pudieron cargar los clientes."
          />
        ) : null}

        {status === 'success' && customers.length === 0 && !hasSearch ? (
          <StatusPanel
            action={<Button icon={Plus}>Nuevo cliente</Button>}
            icon={<StatusIcon icon={Building2} variant="primary" />}
            text="Da de alta el primero para empezar a simular."
            title="Aún no hay clientes."
          />
        ) : null}

        {status === 'success' && customers.length === 0 && hasSearch ? (
          <StatusPanel
            action={
              <Button variant="soft" onClick={() => setSearch('')}>
                Limpiar búsqueda
              </Button>
            }
            icon={<StatusIcon icon={Search} />}
            text="Revisa el nombre o el identificador fiscal."
            title={`Ningún cliente coincide con «${debouncedSearch}».`}
          />
        ) : null}

        {(status === 'success' || status === 'pending') &&
        customers.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {customers.map((customer) => (
              <CustomerCard customer={customer} key={customer.id} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
