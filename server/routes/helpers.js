// @ts-check

export default (app) => {
  app
    .get('/whoami', async (req) => {
      if (!req.isAuthenticated()) {
        return 'unknown';
      }
      return req.user.id;
    });
};
