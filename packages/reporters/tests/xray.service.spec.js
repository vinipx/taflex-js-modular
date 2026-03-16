import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { xrayService } from '../../src/core/utils/xray.service.js';
import { configManager } from '../../src/config/config.manager.js';

vi.mock('axios');
vi.mock('../../src/config/config.manager.js', () => ({
  configManager: {
    get: vi.fn(),
  },
}));

describe('XrayService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    xrayService.token = null;
  });

  it('should authenticate and store token', async () => {
    configManager.get.mockImplementation((key) => {
      if (key === 'XRAY_CLIENT_ID') return 'test-id';
      if (key === 'XRAY_CLIENT_SECRET') return 'test-secret';
      return null;
    });

    axios.post.mockResolvedValue({ data: 'fake-token' });

    const token = await xrayService.authenticate();

    expect(token).toBe('fake-token');
    expect(axios.post).toHaveBeenCalledWith('https://xray.cloud.getxray.app/api/v2/authenticate', {
      client_id: 'test-id',
      client_secret: 'test-secret',
    });
  });

  it('should format results correctly', () => {
    configManager.get.mockImplementation((key) => {
      const config = {
        XRAY_PROJECT_KEY: 'PROJ',
        XRAY_TEST_PLAN_KEY: 'PROJ-1',
        XRAY_ENVIRONMENT: 'Dev',
      };
      return config[key];
    });

    const testResults = [
      {
        testKey: 'PROJ-123',
        status: 'PASSED',
        start: '2023-01-01T10:00:00Z',
        finish: '2023-01-01T10:01:00Z',
      },
    ];

    const formatted = xrayService.formatResults(testResults);

    expect(formatted.info.project).toBe('PROJ');
    expect(formatted.info.testPlanKey).toBe('PROJ-1');
    expect(formatted.info.testEnvironments).toContain('Dev');
    expect(formatted.tests).toHaveLength(1);
    expect(formatted.tests[0].testKey).toBe('PROJ-123');
  });

  it('should not import execution if disabled', async () => {
    configManager.get.mockReturnValue(false); // XRAY_ENABLED = false

    const result = await xrayService.importExecution([]);

    expect(result).toBeUndefined();
    expect(axios.post).not.toHaveBeenCalled();
  });
});
