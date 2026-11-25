import { Check, Copy } from 'lucide-react';
import { useEffect, useState } from 'react';

import type { Customer, Simulation } from '../api/types';
import {
  buildSimulationClipboardText,
  type SimulationConversion,
} from '../lib/simulationEmail';
import { formatSimulationDate } from './simulationHistoryFormat';
import { Button } from './ui';

interface CopySimulationButtonProps {
  customer: Customer;
  simulation: Simulation;
  conversion: SimulationConversion | null;
  onError: () => void;
}

export function CopySimulationButton({
  customer,
  simulation,
  conversion,
  onError,
}: CopySimulationButtonProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timeoutId = window.setTimeout(() => setCopied(false), 2_000);
    return () => window.clearTimeout(timeoutId);
  }, [copied]);

  async function copySimulation(): Promise<void> {
    try {
      await navigator.clipboard.writeText(
        buildSimulationClipboardText(customer, simulation, conversion),
      );
      setCopied(true);
    } catch {
      onError();
    }
  }

  return (
    <Button
      aria-label={`Copiar la simulación del ${formatSimulationDate(simulation.createdAt)}`}
      icon={copied ? Check : Copy}
      size="compact"
      variant="soft"
      onClick={copySimulation}
    >
      <span className="lg:sr-only">Copiar</span>
      {copied ? (
        <span className="sr-only" role="status">
          Texto copiado
        </span>
      ) : null}
    </Button>
  );
}
