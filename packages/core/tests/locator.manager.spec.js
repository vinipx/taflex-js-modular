import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'fs';
import { LocatorManager } from '../../src/core/locators/locator.manager.js';

vi.mock('fs');
vi.mock('../../src/config/config.manager.js', () => ({
  configManager: {
    get: vi.fn().mockReturnValue('web'),
  },
}));

describe('LocatorManager', () => {
  let locatorManager;

  beforeEach(() => {
    vi.clearAllMocks();
    locatorManager = new LocatorManager();
  });

  it('should resolve logical names from loaded locators', () => {
    // Mocking _readJson indirectly by mocking fs.existsSync and fs.readFileSync
    fs.existsSync.mockImplementation((path) => path.includes('global.json'));
    fs.readFileSync.mockReturnValue(JSON.stringify({ btn_login: '#login' }));

    locatorManager.load();

    expect(locatorManager.resolve('btn_login')).toBe('#login');
  });

  it('should return the logical name if no locator is found', () => {
    fs.existsSync.mockReturnValue(false);
    locatorManager.load();
    expect(locatorManager.resolve('unknown')).toBe('unknown');
  });

  it('should merge locators hierarchically (Page > Mode > Global)', () => {
    fs.existsSync.mockReturnValue(true);
    fs.readFileSync.mockImplementation((path) => {
      if (path.includes('global.json')) return JSON.stringify({ key: 'global' });
      if (path.includes('common.json')) return JSON.stringify({ key: 'mode' });
      if (path.includes('login.json')) return JSON.stringify({ key: 'page' });
      return '{}';
    });

    locatorManager.load('login');

    expect(locatorManager.resolve('key')).toBe('page');
  });
});
