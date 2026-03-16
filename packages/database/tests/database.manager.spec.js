import { describe, it, expect, vi, beforeEach } from 'vitest';
import { databaseManager } from '../../src/core/utils/database.manager.js';

vi.mock('pg', () => {
  class Pool {
    constructor() {
      this.connect = vi.fn();
      this.query = vi.fn().mockResolvedValue({ rows: [{ id: 1, name: 'test' }] });
      this.end = vi.fn();
    }
  }
  return { default: { Pool } };
});

vi.mock('mysql2/promise', () => ({
  default: {
    createPool: vi.fn(() => ({
      execute: vi.fn().mockResolvedValue([[{ id: 1, name: 'test' }]]),
      close: vi.fn(),
    })),
  },
}));

describe('DatabaseManager', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    await databaseManager.close();
  });

  it('should execute postgres queries', async () => {
    await databaseManager.connectPostgres({});
    const result = await databaseManager.query('postgres', 'SELECT 1');
    expect(result).toEqual([{ id: 1, name: 'test' }]);
  });

  it('should execute mysql queries', async () => {
    await databaseManager.connectMysql({});
    const result = await databaseManager.query('mysql', 'SELECT 1');
    expect(result).toEqual([{ id: 1, name: 'test' }]);
  });

  it('should throw error if connection not initialized', async () => {
    await expect(databaseManager.query('postgres', 'SELECT 1')).rejects.toThrow(
      'Postgres connection not initialized'
    );
  });
});
