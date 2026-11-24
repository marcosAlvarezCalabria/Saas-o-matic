import { History, UserX } from 'lucide-react';
import { Link, useParams } from 'react-router';

import { CustomerSummary } from '../components/CustomerSummary';
import { Simulator } from '../components/Simulator';
import { Button, Card, Icon, Spinner, StatusPanel } from '../components/ui';
import { useCustomer } from '../hooks/useCustomer';

function parseCustomerId(id: string | undefined): number | null {
  if (!id || !/^[1-9]\d*$/.test(id)) {
    return null;
  }

  const parsedId = Number(id);
  return Number.isSafeInteger(parsedId) ? parsedId : null;
}

export function CustomerDetailPage() {
  const { id } = useParams();
  const customerId = parseCustomerId(id);
  const { status, customer, retry } = useCustomer(customerId);

  if (status === 'loading') {
    return (
      <div className="px-4 py-12">
        <StatusPanel
          icon={<Spinner label="Cargando cliente" />}
          title="Cargando cliente…"
        />
      </div>
    );
  }

  if (status === 'notFound') {
    return (
      <div className="px-4 py-12">
        <StatusPanel
          action={
            <Link className="text-label text-link hover:underline" to="/">
              ← Volver a clientes
            </Link>
          }
          icon={
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-danger-soft text-danger">
              <Icon icon={UserX} size={24} />
            </span>
          }
          title="Cliente no encontrado."
          titleSize="lg"
        />
      </div>
    );
  }

  if (status === 'error' || customer === null || customerId === null) {
    return (
      <div className="px-4 py-12">
        <StatusPanel
          action={
            <Button variant="danger" onClick={retry}>
              Reintentar
            </Button>
          }
          text="Comprueba tu conexión e inténtalo de nuevo."
          title="No se pudo cargar el cliente."
        />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6 lg:px-12 lg:py-12">
      <Link className="text-label text-link hover:underline" to="/">
        ← Clientes
      </Link>
      <div className="mt-6">
        <CustomerSummary customer={customer} />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Simulator customerId={customerId} />
        </div>
        <Card className="lg:col-span-5">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <Icon className="text-text-muted" icon={History} size={24} />
            <h2 className="text-title-md text-text">Historial</h2>
          </div>
        </Card>
      </div>
    </div>
  );
}
