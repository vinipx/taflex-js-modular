import pg from 'pg';
import mysql from 'mysql2/promise';

/**
 * Manages database connections and query orchestration for PostgreSQL and MySQL.
 * Useful for test data setup, validation, and teardown.
 */
class DatabaseManager {
  /**
   * Initializes the DatabaseManager with empty connection pools.
   */
  constructor() {
    this.connections = {
      postgres: null,
      mysql: null,
    };
  }

  /**
   * Connects to a PostgreSQL database using a pool.
   * @param {import('pg').PoolConfig} config - Connection configuration.
   * @returns {Promise<void>}
   */
  async connectPostgres(config) {
    const { Pool } = pg;
    this.connections.postgres = new Pool(config);
  }

  /**
   * Connects to a MySQL database using a pool.
   * @param {import('mysql2/promise').PoolOptions} config - Connection configuration.
   * @returns {Promise<void>}
   */
  async connectMysql(config) {
    this.connections.mysql = await mysql.createPool(config);
  }

  /**
   * Executes a parameterized SQL query on the specified database.
   * @param {string} type - Database type: 'postgres' or 'mysql'.
   * @param {string} query - SQL query string.
   * @param {Array} [params=[]] - Query parameters to prevent SQL injection.
   * @returns {Promise<Array>} Array of rows resulting from the query.
   * @throws {Error} If connection is not initialized or database type is unsupported.
   */
  async query(type, query, params = []) {
    const conn = this.connections[type];
    if (!conn)
      throw new Error(`${type.charAt(0).toUpperCase() + type.slice(1)} connection not initialized`);

    const queryExecutors = {
      postgres: async () => (await conn.query(query, params)).rows,
      mysql: async () => {
        const [rows] = await conn.execute(query, params);
        return rows;
      },
    };

    const executor = queryExecutors[type];
    if (!executor) throw new Error(`Unsupported database type: ${type}`);
    return executor();
  }

  /**
   * Closes all active database connections and pools.
   * @returns {Promise<void>}
   */
  async close() {
    if (this.connections.postgres) {
      await this.connections.postgres.end();
      this.connections.postgres = null;
    }
    if (this.connections.mysql) {
      await this.connections.mysql.close();
      this.connections.mysql = null;
    }
  }
}

/**
 * Singleton instance of DatabaseManager.
 */
export const databaseManager = new DatabaseManager();
