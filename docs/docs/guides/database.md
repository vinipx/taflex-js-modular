# Database Operations

The `databaseManager` utility provides a unified way to interact with PostgreSQL and MySQL databases.

## Usage

```javascript
import { databaseManager } from '../../src/core/utils/database.manager.js';

// Postgres
await databaseManager.connectPostgres({
    user: 'dbuser',
    host: 'database.server.com',
    database: 'mydb',
    password: 'secretpassword',
    port: 5432,
});

const users = await databaseManager.query('postgres', 'SELECT * FROM users WHERE id = $1', [1]);
console.log(users[0].name);

// MySQL
await databaseManager.connectMysql({
    host: 'localhost',
    user: 'root',
    database: 'test'
});

const results = await databaseManager.query('mysql', 'SELECT * FROM products');

// Close connections
await databaseManager.close();
```
