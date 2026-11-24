import type { HTMLAttributes } from 'react';

type CardPadding = 'default' | 'compact';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: CardPadding;
}

const paddingClasses: Record<CardPadding, string> = {
  default: 'p-4 md:p-6 lg:p-8',
  compact: 'p-4 md:p-6',
};

export function Card({
  className,
  padding = 'default',
  ...props
}: CardProps) {
  return (
    <div
      className={`rounded-card border border-border bg-surface ${paddingClasses[padding]} ${className ?? ''}`}
      {...props}
    />
  );
}
