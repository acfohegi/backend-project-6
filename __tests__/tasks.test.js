// @ts-check

import _ from 'lodash';
import { faker } from '@faker-js/faker';

import testFastify from './helpers/app.js';
import { getTestData, prepareData } from './helpers/data.js';
import taskFilters from '../__fixtures__/taskFilters.js';
import indexQueries from '../__fixtures__/indexQueries.js';

describe('test tasks CRUD', () => {
  let app;
  let knex;
  let models;
  let testData;

  beforeAll(async () => {
    app = await testFastify({ auth: true });
    knex = app.objection.knex;
    models = app.objection.models;
    testData = await getTestData();
  });

  beforeEach(async () => {
    await knex.migrate.latest();
    await prepareData(app);
  });

  it.each(indexQueries)('index%s', async (i) => {
    const url = [
      app.reverse('tasks'),
      i,
    ].join('');
    const response = await app.testGet(url);
    expect(response.statusCode).toBe(200);
  });

  it.each(taskFilters)('filters %s', async (_name, { filters, result }) => {
    const tasks = await models.task.index(filters);
    const actual = tasks.map((t) => t.id);
    expect(actual).toStrictEqual(result);
  });

  it('show', async () => {
    const response = await app.testGet('/tasks/1');
    expect(response.statusCode).toBe(200);
  });

  it('new', async () => {
    const response = await app.testGet(app.reverse('newTask'));
    expect(response.statusCode).toBe(200);
  });

  it('create with no name', async () => {
    const params = _.omit(testData.tasks.new, 'name');
    const response = await app.testPost(app.reverse('tasks'), { data: params });
    const tasksCount = await models.task.query().count();
    expect(response.statusCode).toBe(200);
    const result = await models.task.query().count();
    expect(tasksCount).toStrictEqual(result);
  });

  it('create', async () => {
    const params = testData.tasks.new;
    const response = await app.testPost(app.reverse('tasks'), { data: params });
    expect(response.statusCode).toBe(302);
    const expected = _.omit(params, 'labels');
    const task = await models.task.query().orderBy('id', 'desc').limit(1).first();
    expect(task).toMatchObject(expected);
  });

  it('edit', async () => {
    const response = await app.testGet('/tasks/1/edit');
    expect(response.statusCode).toBe(200);
  });

  it('update', async () => {
    const task = await models.task.query().findOne(testData.tasks.existing);
    const params = { ...task, description: faker.lorem.word() };
    const response = await app.testPatch(`/tasks/${task.id}`, { data: params });

    const updatedTask = await task.$query();
    expect(response.statusCode).toBe(302);
    expect(updatedTask).toMatchObject(_.omit(params, 'updatedAt'));
  });

  it('update does not change creator', async () => {
    const task = await models.task.query().findOne(testData.tasks.existing);
    const params = { ...task, description: faker.lorem.word() };
    const response = await app.testPatch(`/tasks/${task.id}`, { data: params });

    const updatedTask = await task.$query();
    const whoamiResponse = await app.inject({ method: 'GET', url: '/whoami' }); const userId = parseInt(whoamiResponse.body, 10);
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
