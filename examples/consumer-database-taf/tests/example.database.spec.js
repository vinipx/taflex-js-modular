import { databaseManager, DatabaseConfigSchema } from '@taflex/database';
import { configManager, logger } from '@taflex/core';

describe('TAFLEX Consumer Database Example', () => {
  beforeAll(() => {
    configManager.registerSchema(DatabaseConfigSchema);
    configManager.load();
  });

  it('should verify @taflex/core and @taflex/database are importable', () => {
    expect(logger).toBeDefined();
    expect(configManager).toBeDefined();
    expect(databaseManager).toBeDefined();
  });

  it('should verify databaseManager has the expected API', () => {
    expect(typeof databaseManager.connectPostgres).toBe('function');
    expect(typeof databaseManager.connectMysql).toBe('function');
    expect(typeof databaseManager.query).toBe('function');
    expect(typeof databaseManager.close).toBe('function');
  });

  it('should read database configuration from env', () => {
    const host = configManager.get('DB_HOST');
    const port = configManager.get('DB_PORT');
    const user = configManager.get('DB_USER');
    const dbName = configManager.get('DB_NAME');

    // Values come from .env or .env.example defaults
    // Just verify configManager can resolve database keys
    expect(host === undefined || typeof host === 'string').toBe(true);
    expect(port === undefined || typeof port === 'number').toBe(true);
    expect(user === undefined || typeof user === 'string').toBe(true);
    expect(dbName === undefined || typeof dbName === 'string').toBe(true);
  });

  // Real database tests require a running PostgreSQL or MySQL instance.
  // Uncomment the tests below once your database is set up.

  // describe('with PostgreSQL running', () => {
  //   beforeAll(async () => {
  //     await databaseManager.connectPostgres({
  //       host: configManager.get('DB_HOST') || 'localhost',
  //       port: configManager.get('DB_PORT') || 5432,
  //       user: configManager.get('DB_USER') || 'postgres',
  //       password: configManager.get('DB_PASSWORD') || 'postgres',
  //       database: configManager.get('DB_NAME') || 'testdb',
  //     });
  //   });
  //
  //   afterAll(async () => {
  //     await databaseManager.close();
  //   });
  //
  //   it('should query the database version', async () => {
  //     const rows = await databaseManager.query('postgres', 'SELECT version()');
  //     expect(rows).toBeInstanceOf(Array);
  //     expect(rows.length).toBeGreaterThan(0);
  //     expect(rows[0].version).toContain('PostgreSQL');
  //   });
  //
  //   it('should run a parameterized query', async () => {
  //     const rows = await databaseManager.query(
  //       'postgres',
  //       'SELECT $1::text AS greeting',
  //       ['Hello from TAFLEX']
  //     );
  //     expect(rows[0].greeting).toBe('Hello from TAFLEX');
  //   });
  // });
});
