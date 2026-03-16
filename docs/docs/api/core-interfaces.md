# Core API Reference

This page documents the primary interfaces and classes provided by TAFLEX JS.

## BaseDriver (Abstract Class)

The root base class for all automation strategies.

| Method | Description |
|--------|-------------|
| `initialize(config)` | Initializes the driver session. |
| `terminate()` | Closes the driver session. |
| `getExecutionMode()` | Returns the current execution mode ('web', 'api', 'mobile'). |
| `setReporterContext(context)` | Sets the reporter context for runner-specific logging. |

## UiDriver (Abstract Class)

The base class for Web and Mobile automation strategies (extends `BaseDriver`).

| Method | Description |
|--------|-------------|
| `navigateTo(url)` | Navigates to the specified URL or endpoint. |
| `findElement(logicalName)` | Resolves a locator and returns a wrapped element. |
| `loadLocators(pageName)` | Loads page-specific locators from JSON. |
| `captureScreenshot(name)` | Captures and attaches a screenshot to the reports. |

## ApiDriver (Abstract Class)

The base class for API automation strategies (extends `BaseDriver`).

| Method | Description |
|--------|-------------|
| `get(endpoint, options)` | Performs an HTTP GET request. |
| `post(endpoint, data, options)` | Performs an HTTP POST request. |
| `put(endpoint, data, options)` | Performs an HTTP PUT request. |
| `delete(endpoint, options)` | Performs an HTTP DELETE request. |

## Element (Wrappers)

TAFLEX JS wraps native engine elements (Playwright or WDIO) to provide a consistent API by extending `AbstractElement`.

### Common Methods

| Method | Description |
|--------|-------------|
| `click()` | Performs a click action. |
| `fill(value)` | Fills an input field with the specified value (clears first). |
| `type(value)` | Types a value into the input field (without clearing). |
| `press(key)` | Presses a specific key (e.g., 'Enter'). |
| `getText()` | Returns the inner text of the element. |
| `getValue()` | Returns the input value of the element. |
| `isVisible()` | Returns `true` if the element is visible. |
| `isEnabled()` | Returns `true` if the element is enabled. |
| `waitFor(options)` | Waits for the element state (visible, hidden, etc). |
| `getAttribute(name)` | Returns the value of a specific attribute. |

## LocatorManager

The engine behind hierarchical locator resolution.

| Method | Description |
|--------|-------------|
| `load(pageName)` | Loads and merges JSON locator files. |
| `resolve(logicalName)`| Returns the selector associated with the logical name. |
