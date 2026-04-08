# Consumer Database TAF — TAFLEX Example

Sample project demonstrating how to consume `@taflex/core` and `@taflex/database`
packages from the GitHub Packages for database validation.

Supports [PostgreSQL](https://www.postgresql.org) and
[MySQL](https://www.mysql.com) with parameterized queries for safe test data
setup, validation, and teardown.

## Prerequisites

- Node.js >= 20
- Access to the TAFLEX repository on GitHub
- A GitHub Personal Access Token (PAT) with `read:packages` scope
- For real database tests: a running PostgreSQL or MySQL instance

## Setup

### 1. Create your GitHub PAT

1. Go to <https://github.com/settings/tokens>
2. Create a token with the **read:packages** scope
3. Export it as an environment variable:

```bash
export GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
```

> The `.npmrc` file is already configured to resolve `@taflex/*` packages from GitHub Packages — no additional setup needed.

### 2. Install dependencies

```bash
npm install
```

### 3. Run tests

```bash
npm test
```

> **Note:** The default tests verify imports and API structure without
> requiring a running database. Uncomment the skipped tests in
> `tests/example.database.spec.js` once your database is set up.

## How it works

- The `.npmrc` file tells npm to resolve any `@taflex/*` package from the
  GitHub Packages instead of the public npm registry.
- The `GITHUB_TOKEN` environment variable provides authentication.
- Tests use **Vitest** as the runner and `databaseManager` from
  `@taflex/database`.
- The database manager supports PostgreSQL (`connectPostgres`) and MySQL
  (`connectMysql`) with parameterized queries to prevent SQL injection.
- Configuration is loaded via `configManager` from `@taflex/core` using the
  `DatabaseConfigSchema`.

## Local testing (before packages are published)

If the packages haven't been published yet, you can test locally using `npm pack`:

```bash
# From the taflex-js-modular root
cd packages/core && npm pack && cd ../..
cd packages/database && npm pack && cd ../..

# From this consumer project
npm install ../../packages/core/taflex-core-1.0.0.tgz
npm install ../../packages/database/taflex-database-1.0.0.tgz
```
