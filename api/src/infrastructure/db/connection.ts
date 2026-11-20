import Database from 'better-sqlite3';

import { DATABASE_SCHEMA } from './schema.js';

export function createDatabase(path: string): Database.Database {
  const database = new Database(path);
  database.pragma('foreign_keys = ON');
  database.exec(DATABASE_SCHEMA);
  return database;
}
