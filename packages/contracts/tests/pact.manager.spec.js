import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PactManager } from '../../src/core/contracts/pact.manager.js';
import { configManager } from '../../src/config/config.manager.js';

vi.mock('../../src/config/config.manager.js', () => ({
  configManager: {
    get: vi.fn(),
  },
}));

vi.mock('@pact-foundation/pact', () => ({
  PactV3: vi.fn().mockImplementation(function () {
    this.addInteraction = vi.fn();
    this.executeTest = vi.fn((cb) => cb('http://127.0.0.1:1234'));
  }),
}));

describe('PactManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not initialize if PACT_ENABLED is false', () => {
    configManager.get.mockReturnValue(false);
    const manager = new PactManager();
    const pact = manager.setup();

    expect(pact).toBeNull();
    expect(manager.enabled).toBe(false);
  });

  it('should initialize PactV3 if enabled', () => {
    configManager.get.mockImplementation((key) => {
      if (key === 'PACT_ENABLED') return true;
      if (key === 'PACT_CONSUMER') return 'test-consumer';
      if (key === 'PACT_PROVIDER') return 'test-provider';
      if (key === 'PACT_LOG_LEVEL') return 'info';
    });

    const manager = new PactManager();
    const pact = manager.setup();

    expect(pact).not.toBeNull();
    expect(manager.enabled).toBe(true);
  });

  it('should pass through test execution when disabled', async () => {
    configManager.get.mockReturnValue(false);
    const manager = new PactManager();
    const mockTest = vi.fn().mockResolvedValue('success');

    const result = await manager.executeTest(mockTest);

    expect(result).toBe('success');
    expect(mockTest).toHaveBeenCalled();
  });
});
