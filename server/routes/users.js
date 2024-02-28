// @ts-check

import i18next from 'i18next';

const isPermitted = (req) => {
  if (!req.isAuthenticated() || req.user.id.toString() !== req.params.id) {
    throw new Error(i18next.t('flash.authError'));
  }
}

const getCurrentUser = async (app, req) => {
  return await app.objection.models.user.query().findById(req.params.id);
}

export default (app) => {
  app
    .get('/users', { name: 'users' }, async (req, reply) => {
      const users = await app.objection.models.user.query();
      reply.render('users/index', { users });
      return reply;
    })
    .get('/users/new', { name: 'newUser' }, (req, reply) => {
      const user = new app.objection.models.user();
      reply.render('users/new', { user });
    })
    .post('/users', async (req, reply) => {
      const user = new app.objection.models.user();
      user.$set(req.body.data);
      try {
        const validUser = await app.objection.models.user.fromJson(req.body.data);
        await app.objection.models.user.query().insert(validUser);
        req.flash('info', i18next.t('flash.users.create.success'));
        reply.redirect(app.reverse('root'));
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.users.create.error'));
        reply.render('users/new', { user, errors: data });
      }
      return reply;
    })
    .get(
      '/users/:id/edit',
      // { name: 'editUser', preHandler: app.fp.authenticate },
      async (req, reply) => {
        try {
          isPermitted(req);
          const user = await getCurrentUser(app, req);
          reply.render('users/edit', { user });
        } catch (e) {
          req.flash('error', e.message);
          reply.redirect(app.reverse('users'));
        }
        return reply;
      }
    )
    .patch('/users/:id', async (req, reply) => {
      let user;
      try {
        isPermitted(req)
        user = await getCurrentUser(app, req);
        await user.$query().patch(req.body.data);
        req.flash('info', i18next.t('flash.users.edit.success'));
        reply.redirect(app.reverse('users'));
      } catch (e) {
        req.flash('error', i18next.t('flash.users.edit.error'));
        reply.render('users/edit', { user, errors: e.data });
      }
      return reply;
    })
    .delete('/users/:id', async (req, reply) => {
      try {
        isPermitted(req)
        const userId = req.params.id;
        await app.objection.models.user.query().deleteById(userId);
        req.logOut();
        req.flash('info', i18next.t('flash.users.delete.success'));
      } catch (e) {
        req.flash('error', i18next.t('flash.users.delete.error'));
      }
      reply.redirect(app.reverse('users'));
      return reply;
    });
};
