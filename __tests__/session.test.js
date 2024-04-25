// @ts-check

import testFastify from './helpers/app.js';
import { getTestData, prepareData } from './helpers/data.js';

describe('test session', () => {
  let app;
  let knex;
  let testData;

  beforeAll(async () => {
    app = await testFastify();
    knex = app.objection.knex;
    await knex.migrate.latest();
    await prepareData(app);
    testData = await getTestData();
  });

  it('test sign in / sign out', async () => {
    const response = await app.testGet(app.reverse('newSession'));
    expect(response.statusCode).toBe(200);

    const responseSignIn = await app.testPost(app.reverse('session'), { data: testData.users.existing });
    expect(responseSignIn.statusCode).toBe(302);
    // после успешной аутентификации получаем куки из ответа,
    // они понадобятся для выполнения запросов на маршруты требующие
    // предварительную аутентификацию
    const [sessionCookie] = responseSignIn.cookies;
    const { name, value } = sessionCookie;
    const cookie = { [name]: value };

    const responseSignOut = await app.testDelete(app.reverse('session'), null, {
      cookies: cookie,
    });
    expect(responseSignOut.statusCode).toBe(302);
  });

  afterAll(async () => {
    await knex.migrate.rollback();
    await app.close();
  });
});
