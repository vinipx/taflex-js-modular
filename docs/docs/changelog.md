# Changelog

## [1.1.0] - 2026-04-01
### Added
- `patch()` method to `ApiDriver` abstract and all API strategy implementations.
- `CloudConfigSchema` in `@taflex/core` — shared cloud platform configuration preventing schema collision between Web and Mobile.
- `captureScreenshot()` implementation in `WebdriverioMobileDriver` for mobile screenshot support.
- `createPactManager()` factory function in `@taflex/contracts` for proper dependency injection.
- `createXrayService()` factory function in `@taflex/reporters` for proper dependency injection.
- Error boundary with `{ cause }` in BDD fixture driver initialization.
- Package Registry guide for GitHub Packages NPM Registry publishing and consumption.

### Fixed
- **CRITICAL**: `PlaywrightApiDriver.post()` and `put()` now accept 3 parameters `(endpoint, data, options)` matching the `ApiDriver` abstract contract. Previously, data was silently lost.
- `XrayReporter` now uses named export instead of default export, making it accessible via barrel `export *`.
- `DatabaseManager.connectPostgres()` no longer leaks a PoolClient connection.
- `HEADLESS` boolean default now correctly falls through to `true` when the env var is unset.
- `MobileElement.press()` now uses `element.parent.keys()` for proper keyboard events instead of `addValue()`.
- `@pact-foundation/pact` added as declared dependency in `@taflex/contracts`.

### Changed
- `dotenv.config()` moved from module-level side-effect to inside `ConfigManager.load()`.
- `PlaywrightElement.type()` now uses `locator.pressSequentially()` replacing the deprecated `locator.type()`.
- `CapabilityBuilder` build names now use ISO date format (`YYYY-MM-DD`) for locale-independent reproducibility.
- `WebConfigSchema` and `MobileConfigSchema` now extend `CloudConfigSchema` from core instead of re-declaring fields.

### Removed
- Dead singleton exports `pactManager` and `xrayService` replaced with factory functions.

## [1.0.0] - 2026-02-11
### Added
- Initial release of Taflex JS (migrated from Java).
- Unified `AutomationDriver` with Playwright and WDIO strategies.
- Hierarchical JSON Locator Manager.
- Type-safe configuration with Zod.
- Integrated `DatabaseManager`.
- Vitest unit test suite.
- Docusaurus enterprise documentation.
