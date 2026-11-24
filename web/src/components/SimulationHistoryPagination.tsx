import { Button } from './ui';

interface SimulationHistoryPaginationProps {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}

export function SimulationHistoryPagination({
  page,
  pageCount,
  onPageChange,
}: SimulationHistoryPaginationProps) {
  if (pageCount <= 1) {
    return null;
  }

  return (
    <nav
      aria-label="Paginación del historial"
      className="mt-4 flex items-center justify-center gap-2 lg:mt-1"
    >
      <Button
        disabled={page === 1}
        size="compact"
        variant="secondary"
        onClick={() => onPageChange(page - 1)}
      >
        Anterior
      </Button>
      <span className="text-center text-caption text-text-muted">
        Página {page} de {pageCount}
      </span>
      <Button
        disabled={page === pageCount}
        size="compact"
        variant="secondary"
        onClick={() => onPageChange(page + 1)}
      >
        Siguiente
      </Button>
    </nav>
  );
}
