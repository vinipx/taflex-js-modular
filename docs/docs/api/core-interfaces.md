# API Reference

Complete reference for all classes, functions, and configuration schemas exported by the TAFLEX JS packages.

---

## @taflex/core

The foundation package. Provides abstract drivers, element wrappers, configuration management, logging, and the driver registry.

### BaseDriver (Abstract Class)

Root base class for all automation strategies.

```js
import { BaseDriver } from '@taflex/core';
```

| Method | Signature | Returns | Description |
|--------|-----------|---------|-------------|
| `initialize` | `initialize(config)` | `Promise<any>` | Initializes the driver session with environment settings. Abstract -- must be implemented by subclasses. |
| `terminate` | `terminate()` | `Promise<void>` | Closes the driver session and performs cleanup. Abstract. |
| `getExecutionMode` | `getExecutionMode()` | `string` | Returns the current execution mode (`'web'`, `'api'`, or `'mobile'`). Abstract. |
| `setReporterContext` | `setReporterContext(context)` | `void` | Stores the runner-specific reporter context (e.g., Playwright `testInfo`) on `this.reporterContext`. |

### UiDriver (Abstract Class)

Base class for Web and Mobile strategies. Extends `BaseDriver`.

```js
import { UiDriver } from '@taflex/core';
```

| Method | Signature | Returns | Description |
|--------|-----------|---------|-------------|
| `navigateTo` | `navigateTo(url)` | `Promise<void>` | Navigates to the specified URL or activity. Abstract. |
| `findElement` | `findElement(logicalName)` | `Promise<AbstractElement>` | Resolves a logical locator name and returns a wrapped element. Abstract. |
| `loadLocators` | `loadLocators(pageName)` | `Promise<void>` | Loads page-specific locators from JSON via `LocatorManager`. Abstract. |
| `captureScreenshot` | `captureScreenshot(name)` | `Promise<Buffer>` | Captures a screenshot and attaches it to active reports. Abstract. |
| `adoptPage` | `adoptPage(page)` | `Promise<void>` | Adopts an existing page object from the test runner. Default is a no-op; override in strategies that support it. |

### ApiDriver (Abstract Class)

Base class for API automation strategies. Extends `BaseDriver`.

```js
import { ApiDriver } from '@taflex/core';
```

| Method | Signature | Returns | Description |
|--------|-----------|---------|-------------|
| `get` | `get(endpoint, options = {})` | `Promise<any>` | Performs an HTTP GET request. Abstract. |
| `post` | `post(endpoint, data = {}, options = {})` | `Promise<any>` | Performs an HTTP POST request. Abstract. |
| `put` | `put(endpoint, data = {}, options = {})` | `Promise<any>` | Performs an HTTP PUT request. Abstract. |
| `delete` | `delete(endpoint, options = {})` | `Promise<any>` | Performs an HTTP DELETE request. Abstract. |
| `patch` | `patch(endpoint, data = {}, options = {})` | `Promise<any>` | Performs an HTTP PATCH request. Abstract. |
| `adoptRequest` | `adoptRequest(request)` | `Promise<void>` | Adopts an existing request context from the test runner. Default is a no-op; override in strategies that support it. |

### DriverRegistry (Static Class)

Internal factory used by `@taflex/bdd` to instantiate drivers based on mode and provider. Each package (`@taflex/web`, `@taflex/api`, `@taflex/mobile`) auto-registers its drivers on import, so consumers do not need to call `register()` manually.

```js
import { DriverRegistry } from '@taflex/core';
```

| Method | Signature | Returns | Description |
|--------|-----------|---------|-------------|
| `register` | `DriverRegistry.register(mode, provider, driverClass)` | `void` | Registers a driver class for a given mode/provider key (e.g., `'web'` + `'default'`). Called automatically by package barrel exports. |
| `create` | `DriverRegistry.create(mode, provider = 'default')` | `BaseDriver` | Creates and returns a new driver instance. Falls back to `mode:default` if the specific provider is not registered. Throws if no match is found. |

**Auto-registration:** Importing `@taflex/web` registers `PlaywrightDriver` as `web:default`. Importing `@taflex/api` registers `AxiosApiDriver` as `api:axios` and `PlaywrightApiDriver` as `api:playwright`. Importing `@taflex/mobile` registers `WebdriverioMobileDriver` as `mobile:default`.

**Fallback logic:** When `create('web', 'custom')` is called and `web:custom` is not registered, the registry tries `web:default` before throwing.

### AbstractElement (Abstract Class)

Unified element interface implemented by `PlaywrightElement` and `MobileElement`.

```js
import { AbstractElement } from '@taflex/core';
```

| Method | Signature | Returns | Description |
|--------|-----------|---------|-------------|
| `click` | `click(options = {})` | `Promise<void>` | Clicks on the element. |
| `fill` | `fill(value, options = {})` | `Promise<void>` | Fills the input with a value (clears existing content first). |
| `type` | `type(value, options = {})` | `Promise<void>` | Types a value into the input without clearing. |
| `press` | `press(key, options = {})` | `Promise<void>` | Presses a specific key (e.g., `'Enter'`). |
| `getText` | `getText()` | `Promise<string>` | Returns the inner text of the element. |
| `getValue` | `getValue()` | `Promise<string>` | Returns the input value of the element. |
| `isVisible` | `isVisible()` | `Promise<boolean>` | Returns `true` if the element is visible/displayed. |
| `isEnabled` | `isEnabled()` | `Promise<boolean>` | Returns `true` if the element is enabled. |
| `waitFor` | `waitFor(options = {})` | `Promise<void>` | Waits for the element to reach a specific state (visible, hidden, etc.). |
| `getAttribute` | `getAttribute(name)` | `Promise<string\|null>` | Returns the value of a specific attribute. |

### LocatorManager

Manages hierarchical locator resolution with a cascading inheritance model: **Global > Execution Mode > Page**.

```js
import { locatorManager } from '@taflex/core';  // singleton instance
import { LocatorManager } from '@taflex/core';   // class (for custom instances)
```

| Method | Signature | Returns | Description |
|--------|-----------|---------|-------------|
| `setMode` | `setMode(mode)` | `void` | Sets the execution mode (`'web'`, `'api'`, `'mobile'`) for locator file resolution. |
| `load` | `load(pageName = null)` | `void` | Loads and merges JSON locator files. Merge priority (highest last): `global.json` < `{mode}/common.json` < `{mode}/{pageName}.json`. |
| `resolve` | `resolve(logicalName)` | `string` | Returns the selector mapped to the logical name, or the `logicalName` itself if no mapping exists. |

Locator files are read from `src/resources/locators/` relative to `process.cwd()`.

### ConfigManager

Loads, validates, and provides access to environment variables using composable Zod schemas.

```js
import { configManager } from '@taflex/core';  // singleton instance
import { ConfigManager } from '@taflex/core';   // class (for custom instances)
```

| Method | Signature | Returns | Description |
|--------|-----------|---------|-------------|
| `registerSchema` | `registerSchema(schema)` | `void` | Registers an additional Zod schema for validation. Call before `load()`. |
| `load` | `load()` | `void` | Loads `.env` via dotenv, merges all registered schemas, and validates `process.env`. Throws on validation failure. |
| `get` | `get(key)` | `any` | Retrieves a validated configuration value by key. |

### Configuration Schemas (Zod)

#### CoreConfigSchema

Always registered by default in `ConfigManager`.

```js
import { CoreConfigSchema } from '@taflex/core';
```

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `TIMEOUT` | `number` | `30000` | Global timeout in milliseconds (parsed from string). |
| `REPORTERS` | `string[]` | `['html']` | Comma-separated list of reporters, transformed to an array. |

#### CloudConfigSchema

Shared schema for cloud platform settings, used by both `@taflex/web` and `@taflex/mobile`.

```js
import { CloudConfigSchema } from '@taflex/core';
```

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `CLOUD_PLATFORM` | `'local' \| 'browserstack' \| 'saucelabs'` | `'local'` | Target cloud platform. |
| `CLOUD_USER` | `string` | -- | Cloud provider username (optional). |
| `CLOUD_KEY` | `string` | -- | Cloud provider access key (optional). |
| `OS` | `string` | -- | Operating system name (optional). |
| `OS_VERSION` | `string` | -- | Operating system version (optional). |

#### mergeSchemas

```js
import { mergeSchemas } from '@taflex/core';
```

| Signature | Returns | Description |
|-----------|---------|-------------|
| `mergeSchemas(...schemas)` | `ZodObject` | Merges multiple Zod object schemas into a single schema by calling `.merge()` sequentially. Returns an empty `z.object({})` if no schemas are provided. |

### Logger

Unified logging utility that broadcasts to the console (via Pino), registered transports, and stdout (in worker contexts).

```js
import { logger } from '@taflex/core';
```

| Method | Signature | Description |
|--------|-----------|-------------|
| `info` | `info(message, ...args)` | Logs an INFO level message. |
| `debug` | `debug(message, ...args)` | Logs a DEBUG level message. |
| `warn` | `warn(message, ...args)` | Logs a WARN level message. |
| `error` | `error(message, ...args)` | Logs an ERROR level message. |
| `trace` | `trace(message, ...args)` | Logs a TRACE level message. |
| `screenshot` | `screenshot(name, buffer)` | Attaches a screenshot to all registered reporting transports. Does not write to console. |

### registerTransport

```js
import { registerTransport } from '@taflex/core';
```

| Signature | Returns | Description |
|-----------|---------|-------------|
| `registerTransport(transport)` | `void` | Registers a `LogTransport` instance to receive broadcast log messages from `logger`. |

### LogTransport (Abstract Base Class)

Base class for logger transports. All methods are no-ops by default -- override only the ones you need.

```js
import { LogTransport } from '@taflex/core';
```

| Method | Signature | Description |
|--------|-----------|-------------|
| `info` | `info(message)` | Called on INFO log events. |
| `debug` | `debug(message)` | Called on DEBUG log events. |
| `warn` | `warn(message)` | Called on WARN log events. |
| `error` | `error(message)` | Called on ERROR log events. |
| `trace` | `trace(message)` | Called on TRACE log events. |
| `screenshot` | `screenshot(name, buffer)` | Called when a screenshot is captured. |

### CapabilityBuilder (Static Class)

Builds platform-specific capabilities for cloud testing providers (BrowserStack, SauceLabs).

```js
import { CapabilityBuilder } from '@taflex/core';
```

| Method | Signature | Returns | Description |
|--------|-----------|---------|-------------|
| `buildWebCapabilities` | `CapabilityBuilder.buildWebCapabilities(config)` | `object` | Returns formatted capabilities for Playwright cloud connection. Handles BrowserStack `bstack:options` and SauceLabs `sauce:options`. |
| `buildMobileConfig` | `CapabilityBuilder.buildMobileConfig(config)` | `object` | Returns formatted WDIO remote configuration with Appium capabilities for mobile cloud execution. |

---

## @taflex/web

Playwright-based web automation driver.

### PlaywrightDriver

Extends `UiDriver`. Full implementation for web automation via Playwright, with local and cloud grid support.

```js
import { PlaywrightDriver } from '@taflex/web';
```

| Method | Signature | Returns | Description |
|--------|-----------|---------|-------------|
| `initialize` | `initialize(config)` | `Promise<Page>` | Launches the Playwright browser (local or cloud), creates a context and page. Returns the Playwright `Page`. |
| `terminate` | `terminate()` | `Promise<void>` | Closes the Playwright browser instance. |
| `navigateTo` | `navigateTo(url)` | `Promise<void>` | Navigates the current page to the given URL. |
| `findElement` | `findElement(logicalName)` | `Promise<PlaywrightElement>` | Resolves the logical name to a selector and returns a wrapped `PlaywrightElement`. |
| `loadLocators` | `loadLocators(pageName)` | `Promise<void>` | Loads page-specific locators via `LocatorManager`. |
| `captureScreenshot` | `captureScreenshot(name)` | `Promise<Buffer>` | Captures a full-page screenshot, attaches it to reporter context and transports. |
| `adoptPage` | `adoptPage(page)` | `Promise<void>` | Adopts an existing Playwright `Page` (e.g., from the `@playwright/test` runner). Sets internal `page`, `context`, and `browser` references and loads locators. |
| `getExecutionMode` | `getExecutionMode()` | `string` | Returns `'web'`. |
| `registerCloudPlatform` | `PlaywrightDriver.registerCloudPlatform(name, builder)` | `void` | **Static.** Registers a WebSocket endpoint builder function for a custom cloud platform. The builder receives capabilities and must return a `wss://` URL. |

Built-in cloud platforms: `browserstack`, `saucelabs`.

### PlaywrightElement

Extends `AbstractElement`. Wraps a Playwright `Locator` with logging.

```js
import { PlaywrightElement } from '@taflex/web';
```

| Constructor | `new PlaywrightElement(locator, name)` |
|-------------|----------------------------------------|

All `AbstractElement` methods are implemented. Delegates to the underlying Playwright `Locator`:

- `click` -> `locator.click(options)`
- `fill` -> `locator.fill(value, options)`
- `type` -> `locator.pressSequentially(value, options)`
- `press` -> `locator.press(key, options)`
- `getText` -> `locator.innerText()`
- `getValue` -> `locator.inputValue()`
- `isVisible` -> `locator.isVisible()`
- `isEnabled` -> `locator.isEnabled()`
- `waitFor` -> `locator.waitFor(options)`
- `getAttribute` -> `locator.getAttribute(name)`

### WebConfigSchema (Zod)

Merges `CloudConfigSchema` with web-specific fields.

```js
import { WebConfigSchema } from '@taflex/web';
```

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `BROWSER` | `'chromium' \| 'firefox' \| 'webkit'` | `'chromium'` | Browser engine to use. |
| `HEADLESS` | `boolean` | `true` | Run in headless mode (parsed from `'true'`/`'false'` string). |
| `BROWSER_VERSION` | `string` | `'latest'` | Browser version for cloud grids. |
| `BASE_URL` | `string` (URL) | -- | Base URL for the application under test (optional). Empty strings and `'/'` are treated as undefined. |

Inherits all fields from `CloudConfigSchema` (`CLOUD_PLATFORM`, `CLOUD_USER`, `CLOUD_KEY`, `OS`, `OS_VERSION`).

---

## @taflex/api

API automation strategies using Playwright or Axios.

### PlaywrightApiDriver

Extends `ApiDriver`. Uses Playwright's `APIRequestContext` for HTTP operations.

```js
import { PlaywrightApiDriver } from '@taflex/api';
```

| Method | Signature | Returns | Description |
|--------|-----------|---------|-------------|
| `initialize` | `initialize(config)` | `Promise<APIRequestContext>` | Creates a new Playwright API request context with the configured `apiBaseUrl`. |
| `terminate` | `terminate()` | `Promise<void>` | Disposes the request context. |
| `get` | `get(endpoint, options = {})` | `Promise<APIResponse>` | Performs a GET request. |
| `post` | `post(endpoint, data = {}, options = {})` | `Promise<APIResponse>` | Performs a POST request. |
| `put` | `put(endpoint, data = {}, options = {})` | `Promise<APIResponse>` | Performs a PUT request. |
| `delete` | `delete(endpoint, options = {})` | `Promise<APIResponse>` | Performs a DELETE request. |
| `patch` | `patch(endpoint, data = {}, options = {})` | `Promise<APIResponse>` | Performs a PATCH request. |
| `adoptRequest` | `adoptRequest(request)` | `Promise<void>` | Adopts an existing Playwright `APIRequestContext` (e.g., from the `@playwright/test` runner). |
| `getExecutionMode` | `getExecutionMode()` | `string` | Returns `'api'`. |

### AxiosApiDriver

Extends `ApiDriver`. Uses Axios for HTTP operations. Returns a normalized response wrapper for consistency with the Playwright driver.

```js
import { AxiosApiDriver } from '@taflex/api';
```

| Method | Signature | Returns | Description |
|--------|-----------|---------|-------------|
| `initialize` | `initialize(config)` | `Promise<AxiosInstance>` | Creates an Axios client with `apiBaseUrl`, `timeout`, and optional `headers`. Sets `validateStatus: () => true` so 4xx/5xx responses do not throw. |
| `terminate` | `terminate()` | `Promise<void>` | Nullifies the Axios client instance. |
| `get` | `get(endpoint, options = {})` | `Promise<WrappedResponse>` | Performs a GET request. |
| `post` | `post(endpoint, data = {}, options = {})` | `Promise<WrappedResponse>` | Performs a POST request. |
| `put` | `put(endpoint, data = {}, options = {})` | `Promise<WrappedResponse>` | Performs a PUT request. |
| `delete` | `delete(endpoint, options = {})` | `Promise<WrappedResponse>` | Performs a DELETE request. |
| `patch` | `patch(endpoint, data = {}, options = {})` | `Promise<WrappedResponse>` | Performs a PATCH request. |
| `getExecutionMode` | `getExecutionMode()` | `string` | Returns `'api'`. |

#### WrappedResponse (Axios)

The `AxiosApiDriver` wraps Axios responses to provide a consistent interface across API strategies:

| Property/Method | Returns | Description |
|-----------------|---------|-------------|
| `status()` | `number` | HTTP status code. |
| `ok()` | `boolean` | `true` if status is 200-299. |
| `json()` | `Promise<any>` | Parsed response data. |
| `headers()` | `object` | Response headers. |
| `text()` | `Promise<string>` | Response body as text (stringifies objects). |
| `raw` | `AxiosResponse` | The original Axios response for advanced usage. |

### ApiConfigSchema (Zod)

```js
import { ApiConfigSchema } from '@taflex/api';
```

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `API_BASE_URL` | `string` (URL) | -- | Base URL for API requests (optional). Empty strings and `'/'` are treated as undefined. |

---

## @taflex/mobile

WebdriverIO/Appium-based mobile automation driver.

### WebdriverioMobileDriver

Extends `UiDriver`. Full implementation for mobile automation using WebdriverIO and Appium.

```js
import { WebdriverioMobileDriver } from '@taflex/mobile';
```

| Method | Signature | Returns | Description |
|--------|-----------|---------|-------------|
| `initialize` | `initialize(config)` | `Promise<Browser>` | Initializes a WebdriverIO remote session. Builds cloud capabilities via `CapabilityBuilder` when `cloudPlatform` is not `'local'`. |
| `terminate` | `terminate()` | `Promise<void>` | Deletes the WebdriverIO session. |
| `navigateTo` | `navigateTo(activityOrUrl)` | `Promise<void>` | Navigates to a URL or starts a mobile activity. |
| `findElement` | `findElement(logicalName)` | `Promise<MobileElement>` | Resolves the logical name and returns a wrapped `MobileElement`. |
| `loadLocators` | `loadLocators(pageName)` | `Promise<void>` | Loads page-specific locators via `LocatorManager`. |
| `captureScreenshot` | `captureScreenshot(name)` | `Promise<Buffer>` | Takes a screenshot via WDIO, attaches it to reporter context and transports. |
| `getExecutionMode` | `getExecutionMode()` | `string` | Returns `'mobile'`. |

### MobileElement

Extends `AbstractElement`. Wraps a WebdriverIO `Element`.

```js
import { MobileElement } from '@taflex/mobile';
```

| Constructor | `new MobileElement(element, name)` |
|-------------|-------------------------------------|

All `AbstractElement` methods are implemented. Delegates to the underlying WDIO `Element`:

- `click` -> `element.click(options)`
- `fill` -> `element.setValue(value)`
- `type` -> `element.addValue(value)`
- `press` -> `element.click()` then `element.parent.keys(key)`
- `getText` -> `element.getText()`
- `getValue` -> `element.getValue()`
- `isVisible` -> `element.isDisplayed()`
- `isEnabled` -> `element.isEnabled()`
- `waitFor` -> `element.waitForDisplayed(options)`
- `getAttribute` -> `element.getAttribute(name)`

### MobileConfigSchema (Zod)

```js
import { MobileConfigSchema } from '@taflex/mobile';
```

Equals `CloudConfigSchema` -- see the [CloudConfigSchema](#cloudconfigschema) table for fields.

---

## @taflex/bdd

BDD integration layer using `playwright-bdd`.

### Exported Fixtures and Functions

```js
import { test, Given, When, Then, expect } from '@taflex/bdd';
```

| Export | Type | Description |
|--------|------|-------------|
| `test` | Playwright `test` fixture | Extended Playwright `test` object with a `driver` fixture. Automatically creates the correct driver based on `EXECUTION_MODE` and `API_PROVIDER` from `BddConfigSchema`. For `web` mode, adopts the Playwright `page`; for `api` mode with `playwright` provider, adopts the `request` context; otherwise calls `initialize()` and `terminate()`. |
| `Given` | `Function` | BDD step definition from `playwright-bdd`, bound to the extended `test` fixture. |
| `When` | `Function` | BDD step definition from `playwright-bdd`, bound to the extended `test` fixture. |
| `Then` | `Function` | BDD step definition from `playwright-bdd`, bound to the extended `test` fixture. |
| `expect` | `Function` | Re-exported `expect` from `@playwright/test`. |

### BddConfigSchema (Zod)

```js
import { BddConfigSchema } from '@taflex/bdd';
```

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `EXECUTION_MODE` | `'web' \| 'api' \| 'mobile'` | `'web'` | Active execution mode — determines which driver the BDD fixture creates via `DriverRegistry`. |
| `API_PROVIDER` | `string` | `'playwright'` | API driver provider name (used when `EXECUTION_MODE=api`). |
| `FEATURES_PATH` | `string` | `'tests/bdd/features'` | Directory containing `.feature` files. |
| `STEPS_PATH` | `string` | `'tests/bdd/steps'` | Directory containing step definition files. |

---

## @taflex/database

Database connection and query management for PostgreSQL and MySQL.

### DatabaseManager

Manages connection pools and provides a unified query interface. Exported as a singleton.

```js
import { databaseManager } from '@taflex/database';
```

| Method | Signature | Returns | Description |
|--------|-----------|---------|-------------|
| `connectPostgres` | `connectPostgres(config)` | `Promise<void>` | Creates a PostgreSQL connection pool using `pg.Pool`. |
| `connectMysql` | `connectMysql(config)` | `Promise<void>` | Creates a MySQL connection pool using `mysql2/promise`. |
| `query` | `query(type, query, params = [])` | `Promise<Array>` | Executes a parameterized SQL query on the specified database (`'postgres'` or `'mysql'`). Returns rows. |
| `close` | `close()` | `Promise<void>` | Closes all active connection pools. |

### DatabaseConfigSchema (Zod)

```js
import { DatabaseConfigSchema } from '@taflex/database';
```

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `DB_HOST` | `string` | -- | Database host (optional). |
| `DB_PORT` | `number` | -- | Database port, parsed from string (optional). |
| `DB_USER` | `string` | -- | Database user (optional). |
| `DB_PASSWORD` | `string` | -- | Database password (optional). |
| `DB_NAME` | `string` | -- | Database name (optional). |

---

## @taflex/contracts

Pact-based consumer-driven contract testing.

### PactManager

Manages the Pact contract testing lifecycle using `@pact-foundation/pact` (PactV3).

```js
import { PactManager, createPactManager } from '@taflex/contracts';
```

| Method | Signature | Returns | Description |
|--------|-----------|---------|-------------|
| `constructor` | `new PactManager(configProvider = null)` | `PactManager` | Initializes the manager. Reads `PACT_ENABLED` from the config provider to determine if contract testing is active. |
| `setup` | `setup(consumer?, provider?)` | `PactV3 \| null` | Creates a new PactV3 instance for the given consumer/provider pair. Defaults to `PACT_CONSUMER` and `PACT_PROVIDER` from config. Returns `null` if disabled. Pact files are written to `./pacts/`. |
| `addInteraction` | `addInteraction(interaction)` | `Promise<void>` | Adds a request/response interaction to the current Pact contract. No-op if disabled or not set up. |
| `executeTest` | `executeTest(testFn)` | `Promise<any>` | Runs the test function within the Pact mock server context. If disabled, calls `testFn()` directly without Pact. |

### createPactManager

```js
import { createPactManager } from '@taflex/contracts';
```

| Signature | Returns | Description |
|-----------|---------|-------------|
| `createPactManager(configProvider)` | `PactManager` | Factory function that creates a new `PactManager` with the given config provider. |

### PactConfigSchema (Zod)

```js
import { PactConfigSchema } from '@taflex/contracts';
```

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `PACT_ENABLED` | `boolean` | `false` | Enable contract testing (parsed from `'true'`/`'false'` string). |
| `PACT_BROKER_URL` | `string` (URL) | -- | Pact Broker URL (optional). |
| `PACT_BROKER_TOKEN` | `string` | -- | Pact Broker authentication token (optional). |
| `PACT_CONSUMER` | `string` | `'taflex-consumer'` | Consumer service name. |
| `PACT_PROVIDER` | `string` | `'taflex-provider'` | Provider service name. |
| `PACT_LOG_LEVEL` | `'debug' \| 'info' \| 'warn' \| 'error'` | `'info'` | Pact internal log level. |

---

## @taflex/reporters

Reporting integrations: Xray (Jira), Allure, and ReportPortal.

### XrayReporter

Custom Playwright reporter that exports test results to Jira Xray Cloud.

```js
import { XrayReporter } from '@taflex/reporters';
```

| Method | Signature | Returns | Description |
|--------|-----------|---------|-------------|
| `constructor` | `new XrayReporter(configProvider = null)` | `XrayReporter` | Initializes the reporter. Reads `XRAY_ENABLED` from config. Creates an internal `XrayService` instance. |
| `onTestEnd` | `onTestEnd(test, result)` | `void` | Playwright reporter hook. Extracts the Xray key from test tags or title and collects test status, timing, and error comments. |
| `onEnd` | `onEnd()` | `Promise<void>` | Playwright reporter hook. Formats and uploads all collected results to Xray via `XrayService`. |
| `extractXrayKey` | `extractXrayKey(test)` | `string \| null` | Extracts a Jira key (e.g., `TAF-123`) from test tags (with or without `@` prefix) or from the test title. |
| `mapStatus` | `mapStatus(playwrightStatus)` | `string` | Maps Playwright status to Xray status: `passed` -> `PASSED`, `failed`/`timedOut` -> `FAILED`, `skipped` -> `TODO`. |

### XrayService

HTTP client for the Xray Cloud REST API.

```js
import { XrayService, createXrayService } from '@taflex/reporters';
```

| Method | Signature | Returns | Description |
|--------|-----------|---------|-------------|
| `constructor` | `new XrayService(configProvider = null)` | `XrayService` | Initializes the service with the Xray Cloud API base URL (`https://xray.cloud.getxray.app/api/v2`). |
| `authenticate` | `authenticate()` | `Promise<string>` | Authenticates with Xray using `XRAY_CLIENT_ID` and `XRAY_CLIENT_SECRET`. Caches the token for subsequent calls. |
| `importExecution` | `importExecution(results)` | `Promise<object>` | Uploads formatted test results to Xray. Returns the API response (including the execution key). No-op if `XRAY_ENABLED` is false. |
| `formatResults` | `formatResults(testResults)` | `object` | Converts raw test result objects into the Xray JSON import format with `info` (summary, project, test plan, environment) and `tests` arrays. |

### createXrayService

| Signature | Returns | Description |
|-----------|---------|-------------|
| `createXrayService(configProvider)` | `XrayService` | Factory function that creates a new `XrayService` with the given config provider. |

### AllureTransport

Extends `LogTransport`. Broadcasts log messages and screenshots to Allure reports.

```js
import { AllureTransport } from '@taflex/reporters';
import { registerTransport } from '@taflex/core';

registerTransport(new AllureTransport());
```

| Method | Delegates To | Description |
|--------|-------------|-------------|
| `info(message)` | `allure.logStep(message, 'passed')` | Logs an info step. |
| `warn(message)` | `allure.logStep('WARN: ...', 'broken')` | Logs a warning step. |
| `error(message)` | `allure.logStep('ERROR: ...', 'failed')` | Logs an error step. |
| `screenshot(name, buffer)` | `allure.attachment(name, buffer, 'image/png')` | Attaches a screenshot. |

`debug()` and `trace()` are inherited no-ops from `LogTransport`.

### ReportPortalTransport

Extends `LogTransport`. Broadcasts log messages and screenshots to ReportPortal.

```js
import { ReportPortalTransport } from '@taflex/reporters';
import { registerTransport } from '@taflex/core';

registerTransport(new ReportPortalTransport());
```

| Method | Delegates To | Description |
|--------|-------------|-------------|
| `info(message)` | `ReportingApi.info(message)` | Logs an info message. |
| `debug(message)` | `ReportingApi.debug(message)` | Logs a debug message. |
| `warn(message)` | `ReportingApi.warn(message)` | Logs a warning message. |
| `error(message)` | `ReportingApi.error(message)` | Logs an error message. |
| `trace(message)` | `ReportingApi.trace(message)` | Logs a trace message. |
| `screenshot(name, buffer)` | `ReportingApi.info(name, { content: base64 })` | Attaches a screenshot as a base64-encoded PNG. |

### ReporterConfigSchema (Zod)

```js
import { ReporterConfigSchema } from '@taflex/reporters';
```

**Xray fields:**

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `XRAY_ENABLED` | `boolean` | `false` | Enable Xray integration (parsed from string). |
| `XRAY_CLIENT_ID` | `string` | -- | Xray Cloud OAuth2 client ID (optional). |
| `XRAY_CLIENT_SECRET` | `string` | -- | Xray Cloud OAuth2 client secret (optional). |
| `XRAY_PROJECT_KEY` | `string` | -- | Jira project key (optional). |
| `XRAY_TEST_PLAN_KEY` | `string` | -- | Xray test plan key (optional). |
| `XRAY_TEST_EXEC_KEY` | `string` | -- | Xray test execution key (optional). |
| `XRAY_ENVIRONMENT` | `string` | -- | Test environment name (optional). |

**Allure fields:**

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `ALLURE_RESULTS_DIR` | `string` | `'allure-results'` | Directory for Allure result output. |

**ReportPortal fields:**

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `RP_ENDPOINT` | `string` (URL) | -- | ReportPortal server endpoint (optional). |
| `RP_API_KEY` | `string` | -- | ReportPortal API key (optional). |
| `RP_PROJECT` | `string` | -- | ReportPortal project name (optional). |
| `RP_LAUNCH` | `string` | -- | ReportPortal launch name (optional). |
| `RP_ATTRIBUTES` | `Array<{key, value}>` | `[]` | Semicolon-separated `key:value` pairs, transformed to an array of objects. |
| `RP_DESCRIPTION` | `string` | -- | ReportPortal launch description (optional). |
