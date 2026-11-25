import { AlertCircle } from 'lucide-react';
import type { InputHTMLAttributes, ReactNode } from 'react';

import { CONTROL_STYLES, FieldShell, mergeDescribedBy } from './FieldShell';
import { Icon } from './Icon';

interface NumberFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'type'> {
  id?: string;
  label: ReactNode;
  labelAction?: ReactNode;
  error?: string;
  suffix?: string;
  containerClassName?: string;
}

export function NumberField({
  id,
  label,
  labelAction,
  error,
  suffix,
  containerClassName,
  className,
  'aria-describedby': describedBy,
  'aria-invalid': ariaInvalid,
  ...props
}: NumberFieldProps) {
  return (
    <FieldShell
      className={containerClassName}
      error={error}
      id={id}
      label={label}
      labelAction={labelAction}
    >
      {({ inputId, errorId }) => (
        <div className="relative">
          <input
            aria-describedby={mergeDescribedBy(describedBy, errorId)}
            aria-invalid={error ? 'true' : ariaInvalid}
            className={`${CONTROL_STYLES} ${error ? 'border-2 border-danger pr-24' : 'border-input-border pr-20'} ${className ?? ''}`}
            id={inputId}
            type="number"
            {...props}
          />
          {suffix ? (
            <span
              aria-hidden="true"
              className={`pointer-events-none absolute inset-y-0 my-auto flex items-center text-caption text-text-muted ${error ? 'right-12' : 'right-4'}`}
            >
              {suffix}
            </span>
          ) : null}
          {error ? (
            <Icon
              className="pointer-events-none absolute inset-y-0 right-4 my-auto text-danger"
              icon={AlertCircle}
              size={20}
            />
          ) : null}
        </div>
      )}
    </FieldShell>
  );
}
