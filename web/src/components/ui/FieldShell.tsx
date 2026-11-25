import { AlertCircle } from 'lucide-react';
import { useId, type ReactNode } from 'react';

import { Icon } from './Icon';

interface FieldShellProps {
  id?: string;
  label: ReactNode;
  labelAction?: ReactNode;
  error?: string;
  className?: string;
  children: (details: {
    inputId: string;
    errorId: string | undefined;
  }) => ReactNode;
}

export const CONTROL_STYLES =
  'h-11 w-full rounded-field border bg-surface px-4 text-base text-text placeholder:text-text-muted disabled:cursor-not-allowed disabled:opacity-50';

export function FieldShell({
  id,
  label,
  labelAction,
  error,
  className,
  children,
}: FieldShellProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className={`flex flex-col gap-1.5 ${className ?? ''}`}>
      <div className="flex items-center gap-1">
        <label className="text-label text-text" htmlFor={inputId}>
          {label}
        </label>
        {labelAction}
      </div>
      {children({ inputId, errorId })}
      {error ? (
        <div
          className="flex items-start gap-2 rounded-note bg-danger-soft p-2 text-caption text-danger"
          id={errorId}
        >
          <Icon className="mt-0.5 shrink-0" icon={AlertCircle} size={16} />
          <span>{error}</span>
        </div>
      ) : null}
    </div>
  );
}

export function mergeDescribedBy(
  describedBy: string | undefined,
  errorId: string | undefined,
) {
  return [describedBy, errorId].filter(Boolean).join(' ') || undefined;
}
