import type { HTMLAttributes, ReactNode } from 'react';

import type { Plan } from '../../api/types';

export type BadgeVariant = 'neutral' | 'primary' | 'success';

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  neutral: 'bg-bg text-text-muted',
  primary: 'bg-primary-soft text-link',
  success: 'bg-success-soft text-success',
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: ReactNode;
}

export function Badge({
  variant = 'neutral',
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={`inline-flex min-h-6 items-center rounded-full px-3 text-caption ${VARIANT_STYLES[variant]} ${className ?? ''}`}
      {...props}
    >
      {children}
    </span>
  );
}

const PLAN_DETAILS: Record<Plan, { label: string; variant: BadgeVariant }> = {
  basic: { label: 'Basic', variant: 'neutral' },
  pro: { label: 'Pro', variant: 'primary' },
  enterprise: { label: 'Enterprise', variant: 'success' },
};

interface PlanBadgeProps extends Omit<BadgeProps, 'children' | 'variant'> {
  plan: Plan;
}

export function PlanBadge({ plan, ...props }: PlanBadgeProps) {
  const details = PLAN_DETAILS[plan];

  return (
    <Badge variant={details.variant} {...props}>
      {details.label}
    </Badge>
  );
}

interface CountryBadgeProps extends Omit<BadgeProps, 'children' | 'variant'> {
  code: string;
  name: string;
}

export function CountryBadge({ code, name, ...props }: CountryBadgeProps) {
  return (
    <Badge variant="neutral" {...props}>
      <strong className="mr-1 font-bold">{code}</strong>
      {name}
    </Badge>
  );
}
