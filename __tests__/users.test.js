// @ts-check

import _ from 'lodash';
import { faker } from '@faker-js/faker';

import testFastify from './helpers/app.js';
import { getTestData, prepareData } from './helpers/data.js';
import encrypt from '../server/lib/secure.cjs';

describe('test users CRUD for authenticated', () => {
  let app;
  let knex;
  let models;
  let testData;
  let email;

  beforeAll(async () => {
    testData = await getTestData();
    email = testData.users.existing.email;
    app = await testFastify({ auth: true, email });
    knex = app.objection.knex;
    models = app.objection.models;
  });

  beforeEach(async () => {
    await knex.migrate.latest();
    await prepareData(app);
  });

  it('edit', async () => {
    const user = await models.user.query().findOne({ email });
    const response = await app.testGet(`users/${user.id}/edit`);
    expect(response.statusCode).toBe(200);
  });

  it('update', async () => {
    const user = await models.user.query().findOne({ email });
    const params = {
      firstName: faker.person.firstName(),
      lastName: user.lastName,
      email: faker.internet.email(),
      password: faker.lorem.word(),
    };
    const response = await app.testPatch(`/users/${user.id}`, { data: params });
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
