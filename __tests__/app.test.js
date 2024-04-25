// @ts-check

import {
  describe, beforeAll, it, expect,
} from '@jest/globals';

import testFastify from './helpers/app.js';

describe('requests', () => {
  let app;

  beforeAll(async () => {
    app = await testFastify();
  });

  it('GET 200', async () => {
    const res = await app.testGet(app.reverse('root'));
    expect(res.statusCode).toBe(200);
  });

  it('GET 404', async () => {
    const res = await app.testGet('/wrong-path');
    expect(res.statusCode).toBe(404);
  });

  afterAll(async () => {
    await app.close();
  });
});
