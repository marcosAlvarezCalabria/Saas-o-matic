import { History } from 'lucide-react';

import type { SimulationHistoryView } from './SimulationHistoryList';
import { Button, Icon } from './ui';

interface SimulationHistoryHeaderProps {
  count: number;
  view: SimulationHistoryView;
  onViewChange: (view: SimulationHistoryView) => void;
}

export function SimulationHistoryHeader({
  count,
  view,
  onViewChange,
}: SimulationHistoryHeaderProps) {
  return (
    <>
      <div className="flex items-center justify-between gap-4 border-b border-border pb-4 lg:pb-1">
        <div className="flex items-center gap-3">
          <Icon className="text-link" icon={History} size={24} />
          <h2 className="text-title-md text-text">Historial</h2>
        </div>
        <span className="text-caption text-text-muted">
          {count === 1 ? '1 simulación' : `${count} simulaciones`}
        </span>
      </div>

      <div className="mt-3 flex gap-2 lg:mt-2">
        {(['active', 'archived'] as const).map((option) => (
          <Button
            aria-pressed={view === option}
            key={option}
            size="compact"
            variant={view === option ? 'soft' : 'secondary'}
            onClick={() => onViewChange(option)}
          >
            {option === 'active' ? 'Activas' : 'Archivadas'}
          </Button>
        ))}
      </div>
    </>
  );
}
