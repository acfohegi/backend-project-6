// @ts-check

import { Reader, loadFiles } from 'simple-knex-fixtures';

const f = (fixture) => `__fixtures__/${fixture}.json`;

export const getFixtureData = async (fixture) => {
  const reader = new Reader();
  const data = await reader.readFile(fixture);
  return data;
};

export const getTestData = () => getFixtureData(f('testData'));

export const prepareData = async (app) => {
  const { knex } = app.objection;
  const fixtures = [
    'users',
    'statuses',
    'tasks',
    'labels',
    'tasks_labels',
  ];
  const fixturePaths = fixtures.map((fixture) => f(fixture));
  await loadFiles(fixturePaths, knex);
};
