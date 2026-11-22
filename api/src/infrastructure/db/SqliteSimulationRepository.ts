import type Database from 'better-sqlite3';

import type {
  SimulationRepository,
  SimulationToCreate,
} from '../../application/ports/SimulationRepository.js';
import type { Simulation } from '../../domain/simulation.js';

interface SimulationRow {
  id: number;
  customer_id: number;
  users: number;
  storage_gb: number;
  api_calls: number;
  base_cents: number;
  vat_rate_basis_points: number;
  vat_cents: number;
  total_cents: number;
  created_at: string;
}

export class SqliteSimulationRepository implements SimulationRepository {
  constructor(private readonly database: Database.Database) {}

  create(simulation: SimulationToCreate): Simulation {
    const row = this.database
      .prepare(
        `INSERT INTO simulations (
          customer_id, users, storage_gb, api_calls, base_cents,
          vat_rate_basis_points, vat_cents, total_cents
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        RETURNING *`,
      )
      .get(
        simulation.customerId,
        simulation.users,
        simulation.storageGb,
        simulation.apiCalls,
        simulation.baseCents,
        simulation.vatRateBasisPoints,
        simulation.vatCents,
        simulation.totalCents,
      ) as SimulationRow | undefined;

    if (row === undefined) {
      throw new Error('Simulation insert did not return a persisted simulation');
    }

    return mapSimulation(row);
  }

  findByCustomerId(customerId: number): Simulation[] {
    const rows = this.database
      .prepare(
        `SELECT * FROM simulations
         WHERE customer_id = ?
         ORDER BY created_at DESC, id DESC`,
      )
      .all(customerId) as SimulationRow[];

    return rows.map(mapSimulation);
  }
}

function mapSimulation(row: SimulationRow): Simulation {
  return {
    id: row.id,
    customerId: row.customer_id,
    users: row.users,
    storageGb: row.storage_gb,
    apiCalls: row.api_calls,
    baseCents: row.base_cents,
    vatRateBasisPoints: row.vat_rate_basis_points,
    vatCents: row.vat_cents,
    totalCents: row.total_cents,
    createdAt: row.created_at,
  };
}
