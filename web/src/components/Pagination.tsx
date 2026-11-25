import { Button } from './ui';

interface PaginationProps {
  ariaLabel: string;
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  ariaLabel,
  page,
  pageCount,
  onPageChange,
  className,
}: PaginationProps) {
  if (pageCount <= 1) {
    return null;
  }

  return (
    <nav
      aria-label={ariaLabel}
      className={`flex items-center justify-center gap-2 ${className ?? ''}`}
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
