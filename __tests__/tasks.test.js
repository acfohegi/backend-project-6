// @ts-check

import _ from 'lodash';
import fastify from 'fastify';
import { faker } from '@faker-js/faker';

import init from '../server/plugin.js';
import { getTestData, prepareData, authenticateRequests } from './helpers/index.js';


describe('test tasks CRUD', () => {
  let app;
  let knex;
  let models;
  const testData = getTestData();

  beforeAll(async () => {
    app = fastify({
      exposeHeadRoutes: false,
      logger: { target: 'pino-pretty' },
    });
    await init(app);
    knex = app.objection.knex;
    models = app.objection.models;
    await authenticateRequests(app);
  });

  beforeEach(async () => {
    await knex.migrate.latest();
    await prepareData(app);
  });

  it('index', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('tasks'),
    });

    expect(response.statusCode).toBe(200);
  });

  it('show', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/tasks/1',
    });

    expect(response.statusCode).toBe(200);
  });

  it('new', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('newTask'),
    });

    expect(response.statusCode).toBe(200);
  });

  it('create with no name', async () => {
    const params = _.omit(testData.tasks.new, 'name');
    const response = await app.inject({
      method: 'POST',
      url: app.reverse('tasks'),
      payload: {
        data: params,
      },
    });

    const tasksCount = await models.task.query().count();
    expect(response.statusCode).toBe(200);
    const result = await models.task.query().count();
    expect(tasksCount).toStrictEqual(result);
  });

  it('create', async () => {
    const params = testData.tasks.new;
    const response = await app.inject({
      method: 'POST',
      url: app.reverse('tasks'),
      payload: {
        data: params,
      },
    });

    expect(response.statusCode).toBe(302);
    const expected = _.omit(params, 'labels');
    const task = await models.task.query().orderBy('id', 'desc').limit(1).first();
    expect(task).toMatchObject(expected);
  });

  it('edit', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/tasks/1',
    });

    expect(response.statusCode).toBe(200);
  });

  it('update', async () => {
    const task = await models.task.query().findOne(testData.tasks.existing);
    const params = { ...task, description: faker.lorem.word() };
    const response = await app.inject({
      method: 'PATCH',
      url: `/tasks/${task.id}`,
      payload: {
        data: params,
      },
    });

    const updatedTask = await task.$query();
    expect(response.statusCode).toBe(302);
    expect(updatedTask).toMatchObject(params);
  });

  it('update does not change creator', async () => {
    const task = await models.task.query().findOne(testData.tasks.existing);
    const params = { ...task, description: faker.lorem.word() };
    const response = await app.inject({
      method: 'PATCH',
      url: `/tasks/${task.id}`,
      payload: {
        data: params,
      },
    });

    const updatedTask = await task.$query();
    const whoamiResponse = await app.inject({ method: 'GET', url: '/whoami' });    const userId = parseInt(whoamiResponse.body);
    expect(userId).not.toBe(task.creatorId);
    expect(response.statusCode).toBe(302);
    expect(updatedTask.creatorId).toBe(task.creatorId);
  });
  afterEach(async () => {
    await knex.migrate.rollback();
  });

  afterAll(async () => {
    await app.close();
  });
});

