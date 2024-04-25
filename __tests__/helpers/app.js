import fastify from 'fastify';
import init from '../../server/plugin.js';

const authenticateRequests = async (app, email) => {
  await app.addHook('preHandler', async (req) => {
    let user;
    if (email) {
      user = await app.objection.models.user.query().findOne({ email });
    } else {
      user = await app.objection.models.user.query().first();
    }
    await req.logIn(user);
  });
};

const methods = ['Get', 'Post', 'Patch', 'Delete'];

const addTestRequests = async (app) => {
  const decorateInject = async (method) => {
    await app.decorate(`test${method}`, async (url, payload, options = {}) => app.inject({
      method: method.toUpperCase(),
      url,
      payload,
      ...options,
    }));
  };
  await Promise.all(methods.map(decorateInject));
};

export default async (opts) => {
  const { email } = opts || {};
  const app = fastify({
    exposeHeadRoutes: false,
    logger: { target: 'pino-pretty' },
  });
  await init(app);
  await addTestRequests(app);
  if (opts?.auth) {
    await authenticateRequests(app, email);
  }
  return app;
};
