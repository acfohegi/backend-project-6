// @ts-check

import i18next from 'i18next';

const isPermitted = (req) => {
  if (!req.isAuthenticated()) {
    throw new Error(i18next.t('flash.authError'));
  }
};

const isTaskOwner = (req) => {
  if (req.user.id.toString() !== req.params.id) {
    throw new Error(i18next.t('flash.authError'));
  }
};

const getCurrentTask = async (req) => {
  return await req.server.objection.models.task.query().findById(req.params.id);
};

export default (app) => {
  const Task = app.objection.models.task;
  const User = app.objection.models.user;
  const Status = app.objection.models.status;

  app
    .get('/tasks', { name: 'tasks' }, async (req, reply) => {
      try {
        isPermitted(req);
        const tasks = await Task.query();
        const statuses = await Status.query();
        const users = await User.query();
        reply.render('tasks/index', { tasks, statuses, users });
      } catch (e) {
        req.flash('error', e.message);
        reply.redirect(app.reverse('root'));
      }
      return reply;
    })
    .get('/tasks/new', { name: 'newTask' }, async (req, reply) => {
      try {
        isPermitted(req);
        const task = new Task();
        const statuses = await Status.query();
        const users = await User.query();
        reply.render('tasks/new', { task, statuses, users });
      } catch (e) {
        req.flash('error', e.message);
        reply.redirect(app.reverse('root'));
      }
      return reply;
    })
    .get('/tasks/:id', async (req, reply) => {
      try {
        isPermitted(req);
        const task = await getCurrentTask(req);
        const status = await task.getStatus();
        const creator = await task.getCreator();
        const executor = await task.getExecutor();
        reply.render('tasks/show', { task, status, creator, executor });
      } catch (e) {
        req.flash('error', e.message);
        reply.redirect(app.reverse('root'));
      }
      return reply;
    })
    .post('/tasks', async (req, reply) => {
      const task = new Task();
      const { name, description, statusId, executorId } = req.body.data;
      const data = {
        name,
        description,
        statusId: parseInt(statusId),
        executorId: executorId === '' ? null : parseInt(executorId),
        creatorId: req.user.id,
      };
      task.$set(data);
      try {
        isPermitted(req);
        const validTask = await Task.fromJson(data);
        await Task.query().insert(validTask);
        req.flash('info', i18next.t('flash.tasks.create.success'));
        reply.redirect(app.reverse('root'));
      } catch (e) {
        const statuses = await Status.query();
        const users = await User.query();
        req.flash('error', i18next.t('flash.tasks.create.error'));
        reply.render('tasks/new', { task, statuses, users, errors: e.data });
      }
      return reply;
    })
    .get(
      '/tasks/:id/edit',
      // { name: 'editUser', preHandler: app.fp.authenticate },
      async (req, reply) => {
        const statuses = await Status.query();
        const users = await User.query();
        try {
          isPermitted(req);
          const task = await getCurrentTask(req);
          reply.render('tasks/edit', { task, statuses, users});
        } catch (e) {
          req.flash('error', e.message);
          reply.redirect(app.reverse('tasks'));
        }
        return reply;
      }
    )
    .patch('/tasks/:id', async (req, reply) => {
      app.log.error(req.body.data);
      const { name, description, statusId, executorId } = req.body.data;
      const data = {
        name,
        description,
        statusId: parseInt(statusId),
        executorId: executorId === '' ? null : parseInt(executorId),
        creatorId: req.user.id,
      };
      app.log.error(data);
      let task;
      try {
        isPermitted(req);
        task = await getCurrentTask(req);
        await task.$query().patch(data);
        req.flash('info', i18next.t('flash.tasks.edit.success'));
        reply.redirect(app.reverse('tasks'));
      } catch (e) {
        const statuses = await Status.query();
        const users = await User.query();
        req.flash('error', i18next.t('flash.tasks.edit.error'));
        reply.render('tasks/edit', { task, statuses, users, errors: e.data });
      }
      return reply;
    })
    .delete('/tasks/:id', async (req, reply) => {
      try {
        isPermitted(req);
        isTaskOwner(req);
        await Task.query().deleteById(req.params.id);
        req.flash('info', i18next.t('flash.tasks.delete.success'));
      } catch (e) {
        req.flash('error', i18next.t('flash.tasks.delete.error'));
      }
      reply.redirect(app.reverse('tasks'));
      return reply;
    });
};

