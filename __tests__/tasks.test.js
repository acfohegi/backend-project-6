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

    // TODO: пока один раз перед тестами
    // тесты не должны зависеть друг от друга
    // перед каждым тестом выполняем миграции
    // и заполняем БД тестовыми данными
    await knex.migrate.latest();
    await prepareData(app);
    await authenticateRequests(app);
  });

  beforeEach(async () => {
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
    const expected = params;
    const task = await models.task.query().orderBy('id', 'desc').limit(1)
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
      url: '/tasks/1',
      payload: {
        data: params,
      },
    });

    const updatedTask = await models.task.query().findById(task.id);
    expect(response.statusCode).toBe(302);
    expect(updatedTask).toMatchObject(params);
  });

  afterEach(async () => {
    // Пока Segmentation fault: 11
    // после каждого теста откатываем миграции
    // await knex.migrate.rollback();
  });

  afterAll(async () => {
    await app.close();
  });
});

