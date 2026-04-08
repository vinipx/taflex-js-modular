import { AxiosApiDriver, logger, configManager, ApiConfigSchema } from '@taflex/api';

describe('TAFLEX Consumer API Example', () => {
  let api;

  beforeAll(async () => {
    configManager.registerSchema(ApiConfigSchema);
    configManager.load();

    const apiBaseUrl = configManager.get('API_BASE_URL') || 'https://jsonplaceholder.typicode.com';
    api = new AxiosApiDriver();
    await api.initialize({ apiBaseUrl });
  });

  afterAll(async () => {
    await api.terminate();
  });

  it('should verify @taflex/core and @taflex/api are importable', () => {
    expect(logger).toBeDefined();
    expect(api).toBeDefined();
  });

  it('should GET a list of users', async () => {
    const response = await api.get('/users');

    expect(response.ok()).toBe(true);
    expect(response.status()).toBe(200);

    const users = await response.json();
    expect(users).toBeInstanceOf(Array);
    expect(users.length).toBeGreaterThan(0);
    expect(users[0]).toHaveProperty('name');
    expect(users[0]).toHaveProperty('email');
  });

  it('should GET a single post by ID', async () => {
    const response = await api.get('/posts/1');

    expect(response.ok()).toBe(true);
    expect(response.status()).toBe(200);

    const post = await response.json();
    expect(post.id).toBe(1);
    expect(post).toHaveProperty('title');
    expect(post).toHaveProperty('body');
    expect(post.userId).toBeDefined();
  });

  it('should POST a new resource', async () => {
    const payload = {
      title: 'TAFLEX API Test',
      body: 'Testing POST with AxiosApiDriver',
      userId: 1,
    };

    const response = await api.post('/posts', payload);

    expect(response.ok()).toBe(true);
    expect(response.status()).toBe(201);

    const created = await response.json();
    expect(created.title).toBe(payload.title);
    expect(created.body).toBe(payload.body);
    expect(created.id).toBeDefined();
  });

  it('should PUT (update) an existing resource', async () => {
    const payload = {
      id: 1,
      title: 'Updated Title',
      body: 'Updated body via TAFLEX',
      userId: 1,
    };

    const response = await api.put('/posts/1', payload);

    expect(response.ok()).toBe(true);
    expect(response.status()).toBe(200);

    const updated = await response.json();
    expect(updated.title).toBe('Updated Title');
  });

  it('should PATCH a resource partially', async () => {
    const response = await api.patch('/posts/1', { title: 'Patched Title' });

    expect(response.ok()).toBe(true);
    expect(response.status()).toBe(200);

    const patched = await response.json();
    expect(patched.title).toBe('Patched Title');
  });

  it('should DELETE a resource', async () => {
    const response = await api.delete('/posts/1');

    expect(response.ok()).toBe(true);
    expect(response.status()).toBe(200);
  });

  it('should handle 404 for non-existent resource', async () => {
    const response = await api.get('/posts/999999');

    expect(response.ok()).toBe(false);
    expect(response.status()).toBe(404);
  });
});
