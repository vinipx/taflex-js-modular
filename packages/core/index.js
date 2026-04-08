export * from './src/drivers/base.driver.js';
export * from './src/drivers/ui.driver.js';
export * from './src/drivers/api.driver.js';
export * from './src/drivers/driver.registry.js';
export * from './src/elements/abstract.element.js';
export * from './src/locators/locator.manager.js';
export * from './src/utils/logger.js';
export * from './src/utils/log-transport.js';
export * from './src/config/schema.js';
export * from './src/config/config.manager.js';
export * from './src/utils/capability.builder.js';

// Auto-register test lifecycle hooks when running in vitest
if (process.env.VITEST) {
  await import('./src/setup/vitest.setup.js');
}
