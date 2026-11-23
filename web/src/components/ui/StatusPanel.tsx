import type { ReactNode } from 'react';

interface StatusPanelProps {
  title: string;
  text?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function StatusPanel({
  title,
  text,
  icon,
  action,
  className,
}: StatusPanelProps) {
  return (
    <section
      className={`mx-auto flex max-w-xl flex-col items-center rounded-card border border-border bg-surface p-12 text-center ${className ?? ''}`}
    >
      {icon ? <div className="mb-4">{icon}</div> : null}
      <h2 className="text-title-sm text-text">{title}</h2>
      {text ? <p className="mt-2 max-w-prose text-sm text-text-muted">{text}</p> : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </section>
  );
}
