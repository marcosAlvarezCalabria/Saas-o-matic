import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Info } from 'lucide-react';

import { Icon } from './Icon';

interface InfoTipProps {
  id: string;
  children: ReactNode;
  className?: string;
}

export function InfoTip({ id, children, className }: InfoTipProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <span
      className={`relative inline-flex ${className ?? ''}`}
      ref={containerRef}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        aria-label="Más información"
        className="inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-text-muted"
        type="button"
        onBlur={() => setOpen(false)}
        onClick={() => setOpen(true)}
        onFocus={() => setOpen(true)}
      >
        <Icon icon={Info} size={16} />
      </button>
      <span
        className={
          open
            ? 'absolute left-1/2 top-full z-50 mt-2 w-64 max-w-64 -translate-x-1/2 rounded-field border border-border bg-surface p-3 text-sm font-normal text-text'
            : 'sr-only'
        }
        id={id}
        role="tooltip"
      >
        {children}
      </span>
    </span>
  );
}
