// @ts-check

import _ from 'lodash';
import fastify from 'fastify';
import { faker } from '@faker-js/faker';

import init from '../server/plugin.js';
import { getTestData, prepareData, authenticateRequests } from './helpers/index.js';

describe('test labels CRUD', () => {
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
      url: app.reverse('labels'),
    });

    expect(response.statusCode).toBe(200);
  });

  it('new', async () => {
    const response = await app.inject({
      method: 'GET',
      url: app.reverse('newLabel'),
    });

    expect(response.statusCode).toBe(200);
  });

  it('create with no name', async () => {
    const labelsCount = await models.label.query().count();
    const params = { name: '' };
    const response = await app.inject({
      method: 'POST',
      url: app.reverse('labels'),
      payload: {
        data: params,
      },
    });

    expect(response.statusCode).toBe(200);
    const result = await models.label.query().count();
    expect(labelsCount).toStrictEqual(result);
  });

  it('create', async () => {
    const params = { name: faker.lorem.word() };
    const response = await app.inject({
      method: 'POST',
      url: app.reverse('labels'),
      payload: {
        data: params,
      },
    });

    expect(response.statusCode).toBe(302);
    const expected = params;
    const label = await models.label.query().findOne(params);
    expect(label).toMatchObject(expected);
  });

  it('edit label', async () => {
    const params = { name: 'new Name)' };
    const label = await models.label.query().findById(2);
    const tasks = await label.getTasks();
    expect(tasks.length).toBe(1);
    const response = await app.inject({
      method: 'PATCH',
      url: `/labels/${label.id}`,
      payload: {
        data: params,
      },
    });

    const updatedLabel = await label.$query();
    expect(response.statusCode).toBe(302);
    expect(updatedLabel.name).toBe(params.name);
    const task = await models.task.query().findOne(tasks[0]);
    const labelsFromTask = await task.getLabels();
    expect(labelsFromTask[0].name).toBe(params.name);
  });

  it('add label to task with another label', async () => {
    const task = await models.task.query().findById(1);
    const labels = await task.getLabels();
    expect(labels.length).toBe(1);
    expect(labels[0].id).toBe(1);
    const {
      name, description, executorId, statusId,
    } = task;
    const params = {
      name,
      description,
      executorId,
      statusId,
      labels: [1, 2],
    };
    await app.inject({
      method: 'PATCH',
      url: `/tasks/${task.id}`,
      payload: {
        data: params,
      },
    });
    const updatedTask = await task.$query();
    const updatedLabels = await updatedTask.getLabels();
    expect(updatedLabels.length).toBe(2);
    expect(updatedLabels[0].id).toBe(1);
    expect(updatedLabels[1].id).toBe(2);
  });

  it('deletion of task and label relation doesn\'t delete associated task and label', async () => {
    const tasks = await models.task.query();
    const labels = await models.label.query();

    const tasksLabels = await models.taskLabel.query();
    /* eslint-disable */
    for (const { id } of tasksLabels) {
      await models.taskLabel.query().deleteById(id);
    }
    /* eslint-disable */

    const tasksLabels2 = await models.taskLabel.query();
    const tasks2 = await models.task.query();
    const labels2 = await models.label.query();
    expect(tasksLabels2).toStrictEqual([]);
    expect(tasks2).toStrictEqual(tasks);
    expect(labels2).toStrictEqual(labels);
  });

  it('successful deletion of label which has no associated tasks', async () => {
    const label = await models.label.query().findById(3);
    const tasksForLabel = await models.taskLabel.query().where('labelId', 3);
    expect(tasksForLabel).toStrictEqual([]);
    const response = await app.inject({
      method: 'DELETE',
      url: `/labels/${label.id}`,
    });

    expect(response.statusCode).toBe(302);
    const noLabel = await models.label.query().findById(3);
    expect(noLabel).toBeUndefined();
  });

  it('cannot delete label associated with a task', async () => {
    const task = await models.task.query().findById(1);
    const labels = await task.getLabels();
    const label = labels[0];
    const response = await app.inject({
      method: 'DELETE',
      url: `/labels/${label.id}`,
    });
    expect(response.statusCode).toBe(302);
    const refreshedLabel = await label.$query();
    expect(refreshedLabel).toStrictEqual(label);
  });

  it('deletion of task doesn\'t delete associated label', async () => {
    const task = await models.task.query().findById(1);
    const labels = await task.getLabels();
    const label = labels[0];
    const response = await app.inject({
      method: 'DELETE',
      url: `/tasks/${task.id}`,
    });
    expect(response.statusCode).toBe(302);
    const refreshedLabel = await label.$query();
    expect(refreshedLabel).toStrictEqual(label);
  });

  it('add labels when creating a task', async () => {
    const params = testData.tasks.new;
    const response = await app.inject({
      method: 'POST',
      url: app.reverse('tasks'),
      payload: {
        data: params,
      },
    });

    expect(response.statusCode).toBe(302);
    const tasks = await models.task.query().orderBy('id', 'desc').limit(1);
    const relatedLabels = await tasks[0].getLabels();
    const labels = await models.label.query().whereIn('id', params.labels);
    expect(labels).toMatchObject(relatedLabels);
    expect(tasks[0]).toMatchObject(_.omit(params, 'labels'));
  });

  it('create a task with no labels', async () => {
    const params = _.omit(testData.tasks.new, 'labels');
    const response = await app.inject({
      method: 'POST',
      url: app.reverse('tasks'),
      payload: {
        data: params,
      },
    });

    expect(response.statusCode).toBe(302);
    const tasks = await models.task.query().orderBy('id', 'desc').limit(1);
    const relatedLabels = await tasks[0].getLabels();
    expect(tasks[0]).toMatchObject(params);
    expect(relatedLabels).toStrictEqual([]);
  });

  it('unrelate one of task\'s labels', async () => {
    const task = await models.task.query().findById(2);
    const labels = await task.getLabels();
    expect(labels.length).toBe(2);

    const {
      name, description, statusId, creatorId, executorId,
    } = task;
    const params = {
      name,
      description,
      statusId,
      creatorId,
      executorId,
      labels: [labels[0].id],
    };
    const response = await app.inject({
      method: 'PATCH',
      url: '/tasks/2',
      payload: {
        data: params,
      },
    });

    expect(response.statusCode).toBe(302);
    const updatedTask = await task.$query();
    const updatedLabels = await updatedTask.getLabels();
    expect(updatedLabels.length).toBe(1);
  });

  afterEach(async () => {
    await knex.migrate.rollback();
  });

  afterAll(async () => {
    await app.close();
  });
});
