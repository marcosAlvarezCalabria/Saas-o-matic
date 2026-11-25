import { useState } from 'react';
import { Building2, CloudOff, Plus, Search } from 'lucide-react';

import { CustomerFormDialog } from '../components/CustomerFormDialog';
import { CustomerList } from '../components/CustomerList';
import { CustomerToolbar } from '../components/CustomerToolbar';
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
  const [page, setPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const debouncedSearch = useDebouncedValue(search, 300);
  const { status, customers, retry } = useCustomers(debouncedSearch);
  const hasSearch = debouncedSearch.trim().length > 0;

  function changeSearch(nextSearch: string): void {
    setSearch(nextSearch);
    setPage(1);
  }

  return (
    <div>
      <div className="mx-auto w-full max-w-7xl px-4 pb-6 pt-8 md:px-6 lg:px-12 lg:pt-12">
        <h1 className="text-title-lg text-text">Clientes</h1>
        <p className="mt-1 text-sm text-text-muted">
          Alta de clientes y simulación de su coste mensual.
        </p>
      </div>
      <CustomerToolbar
        search={search}
        onNewCustomer={() => setIsDialogOpen(true)}
        onSearchChange={changeSearch}
      />

      <div className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6 lg:px-12 lg:py-12">
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
            action={
              <Button icon={Plus} onClick={() => setIsDialogOpen(true)}>
                Nuevo cliente
              </Button>
            }
            icon={<StatusIcon icon={Building2} variant="primary" />}
            text="Da de alta el primero para empezar a simular."
            title="Aún no hay clientes."
          />
        ) : null}

        {status === 'success' && customers.length === 0 && hasSearch ? (
          <StatusPanel
            action={
              <Button variant="soft" onClick={() => changeSearch('')}>
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
          <CustomerList
            customers={customers}
            page={page}
            onPageChange={setPage}
          />
        ) : null}
      </div>
      <CustomerFormDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </div>
  );
}
