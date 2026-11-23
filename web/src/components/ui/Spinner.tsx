interface SpinnerProps {
  label?: string;
  className?: string;
}

export function Spinner({
  label = 'Cargando…',
  className,
}: SpinnerProps) {
  return (
    <span
      aria-label={label}
      className={`inline-block h-12 w-12 animate-spin rounded-full border-4 border-primary-soft border-t-primary motion-reduce:animate-none ${className ?? ''}`}
      role="status"
    />
  );
}
