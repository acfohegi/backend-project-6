// @ts-check

import { URL } from 'url';
import fs from 'fs';
import path from 'path';

// TODO: использовать для фикстур https://github.com/viglucci/simple-knex-fixtures

const getFixturePath = (filename) => path.join('..', '..', '__fixtures__', filename);
const readFixture = (filename) => fs.readFileSync(new URL(getFixturePath(filename), import.meta.url), 'utf-8').trim();
export const getFixtureData = (filename) => JSON.parse(readFixture(filename));
export const getTestData = () => getFixtureData('testData.json');

export const prepareData = async (app) => {
  const { knex } = app.objection;
  await knex('users').insert(getFixtureData('users.json'));
  await knex('statuses').insert(getFixtureData('statuses.json'));
  await knex('tasks').insert(getFixtureData('tasks.json'));
  await knex('labels').insert(getFixtureData('labels.json'));
  await knex('tasks_labels').insert(getFixtureData('tasks_labels.json'));
};

export const authenticateRequests = async (app, email) => {
  await app.addHook('preHandler', async (req, reply) => {
    let user;
    if (email) {
      user = await app.objection.models.user.query().findOne({ email });
    } else {
      user = await app.objection.models.user.query().first();
    }
    await req.logIn(user);
  });
};
