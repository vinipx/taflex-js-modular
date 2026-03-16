# Unit Testing

Taflex JS uses **Vitest** for unit testing its core components. This ensures that the framework's logic (configuration, locators, factory) is reliable independent of the automation engines.

## Running Unit Tests

```bash
npm run test:unit
```

## Test Structure

Unit tests are located in `tests/unit/` and follow the `*.spec.js` naming convention.

### ConfigManager Tests
Verifies that environment variables are correctly validated using Zod and that default values are applied.

### LocatorManager Tests
Ensures that locators are correctly merged from Global, Mode, and Page-specific JSON files.

### DriverFactory Tests
Checks that the correct driver strategy (Web, API, or Mobile) is instantiated based on the execution mode.

### DatabaseManager Tests
Mocks database drivers to verify that queries are correctly routed to PostgreSQL or MySQL connections.

## Mocking in Tests

We use Vitest's `vi.mock()` to isolate components during testing, especially for filesystem operations (`fs`) and database drivers.
