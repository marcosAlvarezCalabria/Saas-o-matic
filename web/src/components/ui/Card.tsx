import type { HTMLAttributes } from 'react';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-card border border-border bg-surface p-4 md:p-6 lg:p-8 ${className ?? ''}`}
      {...props}
    />
  );
}
