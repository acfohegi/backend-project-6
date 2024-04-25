// @ts-check

import _ from 'lodash';

import encrypt from '../server/lib/secure.cjs';
import testFastify from './helpers/app.js';
import { getTestData, prepareData } from './helpers/data.js';

describe('test users CRUD for unauthenticated', () => {
  let app;
  let knex;
  let models;
  let testData;

  beforeAll(async () => {
    app = await testFastify();
    knex = app.objection.knex;
    models = app.objection.models;
    testData = await getTestData();
  });

  beforeEach(async () => {
    await knex.migrate.latest();
    await prepareData(app);
  });

  it('index', async () => {
    const response = await app.testGet(app.reverse('users'));
    expect(response.statusCode).toBe(200);
  });

  it('new', async () => {
    const response = await app.testGet(app.reverse('newUser'));
    expect(response.statusCode).toBe(200);
  });

  it('create with no name', async () => {
    const fullData = testData.users.new;
    const params = { email: fullData.email, password: fullData.password };
    const response = await app.testPost(app.reverse('users'), { data: params });

    expect(response.statusCode).toBe(200);
    const user = await models.user.query().findOne({ email: params.email });
    expect(user).toBeUndefined();
  });

  it('create', async () => {
    const params = testData.users.new;
    const response = await app.testPost(app.reverse('users'), { data: params });

    expect(response.statusCode).toBe(302);
    const expected = {
      ..._.omit(params, 'password'),
      passwordDigest: encrypt(params.password),
    };
    const user = await models.user.query().findOne({ email: params.email });
    expect(user).toMatchObject(expected);
  });

  afterEach(async () => {
    await knex.migrate.rollback();
  });

  afterAll(async () => {
    await app.close();
  });
});
