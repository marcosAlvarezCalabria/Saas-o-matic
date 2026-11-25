import { AlertCircle } from 'lucide-react';
import type { InputHTMLAttributes, ReactNode } from 'react';

import { CONTROL_STYLES, FieldShell, mergeDescribedBy } from './FieldShell';
import { Icon } from './Icon';

interface TextFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  id?: string;
  label: ReactNode;
  error?: string;
  containerClassName?: string;
}

export function TextField({
  id,
  label,
  error,
  containerClassName,
  className,
  'aria-describedby': describedBy,
  'aria-invalid': ariaInvalid,
  ...props
}: TextFieldProps) {
  return (
    <FieldShell
      className={containerClassName}
      error={error}
      id={id}
      label={label}
    >
      {({ inputId, errorId }) => (
        <div className="relative">
          <input
            aria-describedby={mergeDescribedBy(describedBy, errorId)}
            aria-invalid={error ? 'true' : ariaInvalid}
            className={`${CONTROL_STYLES} ${error ? 'border-2 border-danger pr-12' : 'border-input-border'} ${className ?? ''}`}
            id={inputId}
            {...props}
          />
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
