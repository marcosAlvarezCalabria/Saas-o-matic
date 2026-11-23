import type { ReactNode } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Info,
  TriangleAlert,
  X,
  type LucideIcon,
} from 'lucide-react';

import { Icon } from './Icon';

export type AlertVariant = 'success' | 'error' | 'warning' | 'info';

const ALERT_STYLES: Record<AlertVariant, string> = {
  success: 'border-success/20 bg-success-soft text-success',
  error: 'border-danger/20 bg-danger-soft text-danger',
  warning: 'border-warning/20 bg-warning-soft text-warning',
  info: 'border-primary/20 bg-primary-soft text-link',
};

const ALERT_ICONS: Record<AlertVariant, LucideIcon> = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: TriangleAlert,
  info: Info,
};

interface AlertAction {
  label: string;
  onClick: () => void;
}

interface InlineAlertProps {
  variant: AlertVariant;
  children: ReactNode;
  action?: AlertAction;
  onClose?: () => void;
  className?: string;
}

export function InlineAlert({
  variant,
  children,
  action,
  onClose,
  className,
}: InlineAlertProps) {
  const alertIcon = ALERT_ICONS[variant];

  return (
    <div
      aria-live="polite"
      className={`flex items-center gap-3 rounded-card border p-4 text-sm font-medium ${ALERT_STYLES[variant]} ${className ?? ''}`}
      role="status"
    >
      <Icon className="shrink-0" icon={alertIcon} size={20} />
      <div className="min-w-0 flex-1">{children}</div>
      {action ? (
        <button
          className="min-h-11 shrink-0 px-2 text-label underline"
          type="button"
          onClick={action.onClick}
        >
          {action.label}
        </button>
      ) : null}
      {onClose ? (
        <button
          aria-label="Cerrar aviso"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full hover:bg-surface"
          type="button"
          onClick={onClose}
        >
          <Icon icon={X} size={18} />
        </button>
      ) : null}
    </div>
  );
}
