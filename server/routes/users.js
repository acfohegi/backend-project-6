import i18next from 'i18next';
import { ValidationError } from 'objection';
import AccessError from '../errors/AccessError.js';
import HasTasksError from '../errors/HasTasksError.js';

const isUser = (req) => {
  if (req.user.id.toString() !== req.params.id) {
    throw new AccessError(i18next.t('flash.authError'));
  }
};

const userHasTasks = async (user) => {
  const tasks = await user.getTasks();
  if (tasks.length > 0) {
    throw new HasTasksError();
  }
};

export default (app) => {
  const User = app.objection.models.user;

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
      '/users/:id/edit', async (req, reply) => {
      try {
        req.isPermitted();
        isUser(req);
        const user = await User.find(req.params.id);
        reply.render('users/edit', { user });
      } catch (e) {
        if (e instanceof AccessError) {
          req.flash('error', e.message);
          reply.redirect(app.reverse('users'));
        } else {
          throw e;
        }
      }
      return reply;
    })
    .post('/users', async (req, reply) => {
      const user = new User();
      user.$set(req.body.data);
      try {
        await User.create(req.body.data);
        req.flash('info', i18next.t('flash.users.create.success'));
        reply.redirect(app.reverse('root'));
      } catch (e) {
        if (e instanceof ValidationError) {
          req.flash('error', i18next.t('flash.users.create.error'));
          reply.render('users/new', { user, errors: e.data });
        } else {
          throw e;
        }
      }
      return reply;
    })
    .patch('/users/:id', async (req, reply) => {
      let user;
      try {
        req.isPermitted();
        isUser(req);
        user = await User.find(req.params.id);
        await user.update(req.body.data);
        req.flash('info', i18next.t('flash.users.edit.success'));
        reply.redirect(app.reverse('users'));
      } catch (e) {
        if (e instanceof AccessError) {
          req.flash('error', e.message);
          reply.redirect(app.reverse('users'));
        } else if (e instanceof ValidationError) {
          req.flash('error', i18next.t('flash.users.edit.error'));
          reply.render('users/edit', { user, errors: e.data });
        } else {
          throw e;
        }
      }
      return reply;
    })
    .delete('/users/:id', async (req, reply) => {
      try {
        req.isPermitted();
        isUser(req);
        const user = await User.find(req.params.id);
        await userHasTasks(user);
        await User.delete(req.params.id);
        req.logOut();
        req.flash('info', i18next.t('flash.users.delete.success'));
      } catch (e) {
        if (e instanceof AccessError || e instanceof HasTasksError) {
          req.flash('error', [i18next.t('flash.users.delete.error'), e.message].join('. '));
        } else {
          throw e;
        }
      }
      reply.redirect(app.reverse('users'));
      return reply;
    });
};
