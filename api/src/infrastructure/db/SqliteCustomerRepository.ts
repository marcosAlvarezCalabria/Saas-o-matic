import type Database from 'better-sqlite3';

import type {
  CustomerRepository,
  CustomerSearch,
  CustomerToCreate,
} from '../../application/ports/CustomerRepository.js';
import { ApplicationError } from '../../application/errors.js';
import type { Customer, CustomerPlan } from '../../domain/customer.js';

interface CustomerRow {
  id: number;
  company_name: string;
  tax_id: string;
  email: string;
  country: string;
  plan: CustomerPlan;
  created_at: string;
}

export class SqliteCustomerRepository implements CustomerRepository {
  constructor(private readonly database: Database.Database) {}

  create(customer: CustomerToCreate): Customer {
    try {
      const result = this.database
        .prepare(
          `INSERT INTO customers (
            company_name, company_name_search, tax_id, email, country, plan
          ) VALUES (?, ?, ?, ?, ?, ?)`,
        )
        .run(
          customer.companyName,
          customer.companyNameSearch,
          customer.taxId,
          customer.email,
          customer.country,
          customer.plan,
        );

      const created = this.findById(Number(result.lastInsertRowid));

      if (created === null) {
        throw new Error('Customer insert did not return a persisted customer');
      }

      return created;
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw new ApplicationError(
          'TAX_ID_ALREADY_EXISTS',
          'Ya existe un cliente con ese identificador fiscal',
        );
      }

      throw error;
    }
  }

  findById(id: number): Customer | null {
    const row = this.database
      .prepare('SELECT * FROM customers WHERE id = ?')
      .get(id) as CustomerRow | undefined;

    return row === undefined ? null : mapCustomer(row);
  }

  findByTaxId(taxId: string): Customer | null {
    const row = this.database
      .prepare('SELECT * FROM customers WHERE tax_id = ?')
      .get(taxId) as CustomerRow | undefined;

    return row === undefined ? null : mapCustomer(row);
  }

  search(search: CustomerSearch): Customer[] {
    const companyNamePattern = containsPattern(search.companyName);
    const taxIdPattern = containsPattern(search.taxId);
    const rows = this.database
      .prepare(
        `SELECT * FROM customers
         WHERE company_name_search LIKE ? ESCAPE '\\'
            OR tax_id LIKE ? ESCAPE '\\'
         ORDER BY created_at DESC, id DESC`,
      )
      .all(companyNamePattern, taxIdPattern) as CustomerRow[];

    return rows.map(mapCustomer);
  }
}

function containsPattern(value: string): string {
  return `%${value.replace(/[\\%_]/g, '\\$&')}%`;
}

function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === 'SQLITE_CONSTRAINT_UNIQUE'
  );
}

function mapCustomer(row: CustomerRow): Customer {
  return {
    id: row.id,
    companyName: row.company_name,
    taxId: row.tax_id,
    email: row.email,
    country: row.country,
    plan: row.plan,
    createdAt: row.created_at,
  };
}
