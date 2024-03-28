// @ts-check

import i18next from 'i18next';

const isPermitted = (req) => {
  if (!req.isAuthenticated() || req.user.id.toString() !== req.params.id) {
    throw new Error(i18next.t('flash.authError'));
  }
}

export default (app) => {
  const User = app.objection.models.user;
  const Task = app.objection.models.task;

  app
    .get('/users', { name: 'users' }, async (req, reply) => {
      const users = await User.index();
      reply.render('users/index', { users });
      return reply;
    })
    .get('/users/new', { name: 'newUser' }, (req, reply) => {
      const user = new User();
      reply.render('users/new', { user });
    })
    .get(
      '/users/:id/edit',
      // { name: 'editUser', preHandler: app.fp.authenticate },
      async (req, reply) => {
        try {
          isPermitted(req);
          const user = await User.find(req.params.id);
          reply.render('users/edit', { user });
        } catch (e) {
          req.flash('error', e.message);
          reply.redirect(app.reverse('users'));
        }
        return reply;
      }
    )
    .post('/users', async (req, reply) => {
      const user = new User();
      user.$set(req.body.data);
      try {
        await User.create(req.body.data);
        req.flash('info', i18next.t('flash.users.create.success'));
        reply.redirect(app.reverse('root'));
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.users.create.error'));
        reply.render('users/new', { user, errors: data });
      }
      return reply;
    })
    .patch('/users/:id', async (req, reply) => {
      let user;
      try {
        isPermitted(req);
        user = await User.find(req.params.id);
        await user.update(req.body.data);
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
        isPermitted(req);
        const user = await getCurrentUser(app, req);
        const tasks = await user.getTasks();
        if (tasks.length > 0) {
          throw Error(i18next.t('flash.users.delete.hasTasks'));
        }
        await User.delete(req.params.id);
        req.logOut();
        req.flash('info', i18next.t('flash.users.delete.success'));
      } catch (e) {
        req.flash('error', i18next.t('flash.users.delete.error'), e.message);
      }
      reply.redirect(app.reverse('users'));
      return reply;
    })
};

