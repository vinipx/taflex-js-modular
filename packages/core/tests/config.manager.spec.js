import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock dotenv before importing ConfigManager
vi.mock('dotenv', () => ({
  default: { config: vi.fn() },
}));

describe('ConfigManager', () => {
  beforeEach(() => {
    vi.resetModules();
    // Clear relevant env vars to ensure a clean state
    delete process.env.EXECUTION_MODE;
    delete process.env.BROWSER;
    delete process.env.HEADLESS;
    delete process.env.BASE_URL;
    delete process.env.API_BASE_URL;
    delete process.env.TIMEOUT;

    process.env.EXECUTION_MODE = 'web';
    process.env.BROWSER = 'chromium';
  });

  it('should load default values when environment variables are missing', async () => {
    const { ConfigManager } = await import('../../src/config/config.manager.js');
    const config = new ConfigManager();

    expect(config.get('EXECUTION_MODE')).toBe('web');
    expect(config.get('HEADLESS')).toBe(true);
    expect(config.get('TIMEOUT')).toBe(30000);
  });

  it('should override defaults with environment variables', async () => {
    process.env.HEADLESS = 'false';
    process.env.TIMEOUT = '5000';
    process.env.BASE_URL = 'https://example.com';

    const { ConfigManager } = await import('../../src/config/config.manager.js');
    const config = new ConfigManager();

    expect(config.get('HEADLESS')).toBe(false);
    expect(config.get('TIMEOUT')).toBe(5000);
    expect(config.get('BASE_URL')).toBe('https://example.com');
  });

  it('should correctly load cloud configuration variables', async () => {
    process.env.CLOUD_PLATFORM = 'browserstack';
    process.env.CLOUD_USER = 'testuser';
    process.env.CLOUD_KEY = 'testkey';
    process.env.BROWSER_VERSION = 'latest';
    process.env.OS = 'OS X';
    process.env.OS_VERSION = 'Ventura';

    const { ConfigManager } = await import('../../src/config/config.manager.js');
    const config = new ConfigManager();

    expect(config.get('CLOUD_PLATFORM')).toBe('browserstack');
    expect(config.get('CLOUD_USER')).toBe('testuser');
    expect(config.get('CLOUD_KEY')).toBe('testkey');
    expect(config.get('BROWSER_VERSION')).toBe('latest');
    expect(config.get('OS')).toBe('OS X');
    expect(config.get('OS_VERSION')).toBe('Ventura');
  });

  it('should throw error on invalid configuration', async () => {
    // First import with valid env to get the class
    process.env.EXECUTION_MODE = 'web';
    const { ConfigManager } = await import('../../src/config/config.manager.js');

    // Then set invalid env and try to instantiate manually
    process.env.EXECUTION_MODE = 'invalid_mode';
    expect(() => new ConfigManager()).toThrow('Invalid environment configuration');
  });
});
