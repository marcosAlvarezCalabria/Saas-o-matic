import type { ButtonHTMLAttributes } from 'react';

interface SwitchProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'aria-checked' | 'children' | 'onChange' | 'role'
  > {
  checked: boolean;
  label: string;
  onCheckedChange: (checked: boolean) => void;
}

export function Switch({
  checked,
  label,
  onCheckedChange,
  className,
  type = 'button',
  ...props
}: SwitchProps) {
  return (
    <button
      aria-checked={checked}
      className={`flex h-11 cursor-pointer items-center gap-3 rounded-full text-left text-sm font-medium text-text ${className ?? ''}`}
      role="switch"
      type={type}
      onClick={() => onCheckedChange(!checked)}
      {...props}
    >
      <span
        aria-hidden="true"
        className={`flex h-6 w-11 shrink-0 items-center rounded-full border p-0.5 transition-colors ${checked ? 'border-primary bg-primary justify-end' : 'border-border bg-border justify-start'}`}
      >
        <span className="h-5 w-5 rounded-full bg-surface" />
      </span>
      <span>{label}</span>
    </button>
  );
}
