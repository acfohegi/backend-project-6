// @ts-check

export default (app) => {
  app
    .get('/whoami', async (req, reply) => {
      if (!req.isAuthenticated()) {
        return 'unknown';
      }
      return req.user.id;
    });
};

