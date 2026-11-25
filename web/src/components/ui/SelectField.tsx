import { AlertCircle, ChevronDown } from 'lucide-react';
import type { ReactNode, SelectHTMLAttributes } from 'react';

import { CONTROL_STYLES, FieldShell, mergeDescribedBy } from './FieldShell';
import { Icon } from './Icon';

interface SelectFieldProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id'> {
  id?: string;
  label: ReactNode;
  error?: string;
  containerClassName?: string;
}

export function SelectField({
  id,
  label,
  error,
  containerClassName,
  className,
  children,
  'aria-describedby': describedBy,
  'aria-invalid': ariaInvalid,
  ...props
}: SelectFieldProps) {
  return (
    <FieldShell
      className={containerClassName}
      error={error}
      id={id}
      label={label}
    >
      {({ inputId, errorId }) => (
        <div className="relative">
          <select
            aria-describedby={mergeDescribedBy(describedBy, errorId)}
            aria-invalid={error ? 'true' : ariaInvalid}
            className={`${CONTROL_STYLES} appearance-none ${error ? 'border-2 border-danger pr-20' : 'border-input-border pr-12'} ${className ?? ''}`}
            id={inputId}
            {...props}
          >
            {children}
          </select>
          <Icon
            className={`pointer-events-none absolute inset-y-0 my-auto text-text-muted ${error ? 'right-12' : 'right-4'}`}
            icon={ChevronDown}
            size={18}
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
