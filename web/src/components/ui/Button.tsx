import type { ButtonHTMLAttributes, ComponentProps } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Link } from 'react-router';

import { Icon } from './Icon';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'soft';
export type ButtonSize = 'md' | 'lg';

const BASE_STYLES =
  'inline-flex cursor-pointer items-center justify-center gap-2 rounded-full px-6 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50';

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-on-primary hover:bg-primary-hover',
  secondary:
    'border border-input-border bg-surface text-text hover:bg-bg',
  danger: 'bg-danger text-on-primary hover:opacity-90',
  soft: 'bg-primary-soft text-link hover:bg-border',
};

const SIZE_STYLES: Record<ButtonSize, string> = {
  md: 'h-11',
  lg: 'h-12',
};

function getButtonStyles(
  variant: ButtonVariant,
  size: ButtonSize,
  className?: string,
) {
  return [BASE_STYLES, VARIANT_STYLES[variant], SIZE_STYLES[size], className]
    .filter(Boolean)
    .join(' ');
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
}

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  className,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      className={getButtonStyles(variant, size, className)}
      type={type}
      {...props}
    >
      {icon ? <Icon icon={icon} size={18} /> : null}
      {children}
    </button>
  );
}

interface LinkButtonProps extends ComponentProps<typeof Link> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
}

export function LinkButton({
  variant = 'primary',
  size = 'md',
  icon,
  className,
  children,
  ...props
}: LinkButtonProps) {
  return (
    <Link className={getButtonStyles(variant, size, className)} {...props}>
      {icon ? <Icon icon={icon} size={18} /> : null}
      {children}
    </Link>
  );
}
