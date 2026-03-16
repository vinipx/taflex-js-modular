import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { AxiosApiStrategy } from '../../src/core/drivers/strategies/axios.api.strategy.js';

vi.mock('axios');

describe('AxiosApiStrategy', () => {
  let strategy;
  let mockAxiosInstance;

  beforeEach(() => {
    mockAxiosInstance = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      patch: vi.fn(),
    };
    axios.create.mockReturnValue(mockAxiosInstance);
    strategy = new AxiosApiStrategy();
  });

  it('should initialize with config', async () => {
    const config = {
      apiBaseUrl: 'http://api.test',
      timeout: 5000,
      headers: { 'X-Test': 'val' },
    };
    await strategy.initialize(config);

    expect(axios.create).toHaveBeenCalledWith(
      expect.objectContaining({
        baseURL: 'http://api.test',
        timeout: 5000,
        headers: expect.objectContaining({
          'X-Test': 'val',
          'Content-Type': 'application/json',
        }),
      })
    );
  });

  it('should wrap GET response correctly', async () => {
    const mockResponse = {
      status: 200,
      data: { id: 1 },
      headers: { 'content-type': 'application/json' },
    };
    mockAxiosInstance.get.mockResolvedValue(mockResponse);

    await strategy.initialize({ apiBaseUrl: 'http://test' });
    const response = await strategy.get('/users/1');

    expect(response.status()).toBe(200);
    expect(response.ok()).toBe(true);
    expect(await response.json()).toEqual({ id: 1 });
    expect(response.headers()).toEqual(mockResponse.headers);
  });

  it('should wrap POST response correctly', async () => {
    const mockResponse = {
      status: 201,
      data: { success: true },
    };
    mockAxiosInstance.post.mockResolvedValue(mockResponse);

    await strategy.initialize({ apiBaseUrl: 'http://test' });
    const response = await strategy.post('/users', { name: 'test' });

    expect(response.status()).toBe(201);
    expect(response.ok()).toBe(true);
    expect(await response.json()).toEqual({ success: true });
  });

  it('should handle failure status in ok()', async () => {
    const mockResponse = {
      status: 500,
      data: 'Error',
    };
    mockAxiosInstance.get.mockResolvedValue(mockResponse);

    await strategy.initialize({ apiBaseUrl: 'http://test' });
    const response = await strategy.get('/fail');

    expect(response.status()).toBe(500);
    expect(response.ok()).toBe(false);
  });

  it('should return text from response', async () => {
    const mockResponse = {
      status: 200,
      data: 'plain text',
    };
    mockAxiosInstance.get.mockResolvedValue(mockResponse);

    await strategy.initialize({ apiBaseUrl: 'http://test' });
    const response = await strategy.get('/text');

    expect(await response.text()).toBe('plain text');
  });
});
