import {
  useId,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
} from 'react';
import { AlertCircle, ChevronDown } from 'lucide-react';

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

function FieldShell({
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

function mergeDescribedBy(
  describedBy: string | undefined,
  errorId: string | undefined,
) {
  return [describedBy, errorId].filter(Boolean).join(' ') || undefined;
}

const CONTROL_STYLES =
  'h-11 w-full rounded-field border bg-surface px-4 text-base text-text placeholder:text-text-muted disabled:cursor-not-allowed disabled:opacity-50';

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
