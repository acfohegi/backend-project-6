// @ts-check

import _ from 'lodash';
import fastify from 'fastify';
import { faker } from '@faker-js/faker';

import init from '../server/plugin.js';
import encrypt from '../server/lib/secure.cjs';
import { getTestData, prepareData, authenticateRequests } from './helpers/index.js';

describe('test users CRUD for authenticated', () => {
  let app;
  let knex;
  let models;
  let testData;

  beforeAll(async () => {
    app = fastify({
      exposeHeadRoutes: false,
      logger: { target: 'pino-pretty' },
    });
    await init(app);
    knex = app.objection.knex;
    models = app.objection.models;
    testData = await getTestData();
    await authenticateRequests(app, testData.users.existing.email);
  });

  beforeEach(async () => {
    await knex.migrate.latest();
    await prepareData(app);
  });

  it('edit', async () => {
    const user = await models.user.query().findOne({ email: testData.users.existing.email });
    const response = await app.inject({
      method: 'GET',
      url: `users/${user.id}/edit`,
    });
    expect(response.statusCode).toBe(200);
  });

  it('update', async () => {
    const user = await models.user.query().findOne({ email: testData.users.existing.email });
    const params = {
      firstName: faker.person.firstName(),
      lastName: user.lastName,
      email: faker.internet.email(),
      password: faker.lorem.word(),
    };
    const response = await app.inject({
      method: 'PATCH',
      url: `users/${user.id}`,
      payload: {
        data: params,
      },
    });

    const updatedUser = await models.user.query().findOne({ email: params.email });
    expect(response.statusCode).toBe(302);
    const expected = {
      ..._.omit(params, 'password'),
      passwordDigest: encrypt(params.password),
    };
    expect(updatedUser).toMatchObject(expected);
  });

  afterEach(async () => {
    await knex.migrate.rollback();
  });

  afterAll(async () => {
    await app.close();
  });
});
