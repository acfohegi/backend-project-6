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

const parseLabels = (labels) => {
  if (Array.isArray(labels)) {
    return labels.map((l) => parseInt(l));
  }
  if (typeof labels === 'string') {
    return [parseInt(labels)];
  }
  return [];
};

export default (app) => {
  const Task = app.objection.models.task;
  const User = app.objection.models.user;
  const Status = app.objection.models.status;
  const Label = app.objection.models.label;

  app
    .get('/tasks', { name: 'tasks' }, async (req, reply) => {
      try {
        isPermitted(req);
        const tasks = await Task.index();
        const statuses = await Status.index();
        const users = await User.index();
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
        const statuses = await Status.index();
        const users = await User.index();
        const labels = await Label.index();
        const selectedLabels = [];
        reply.render('tasks/new', { task, statuses, users, labels, selectedLabels });
      } catch (e) {
        req.flash('error', e.message);
        reply.redirect(app.reverse('root'));
      }
      return reply;
    })
    .get('/tasks/:id', async (req, reply) => {
      try {
        isPermitted(req);
        const task = await Task.find(req.params.id);
        const labels = await task.getLabels();
        const status = await task.getStatus();
        const creator = await task.getCreator();
        const executor = await task.getExecutor();
        reply.render('tasks/show', { task, labels, status, creator, executor });
      } catch (e) {
        req.flash('error', e.message);
        reply.redirect(app.reverse('root'));
      }
      return reply;
    })
    .get(
      '/tasks/:id/edit',
      // { name: 'editUser', preHandler: app.fp.authenticate },
      async (req, reply) => {
        const statuses = await Status.index();
        const users = await User.index();
        const labels = await Label.index();
        try {
          isPermitted(req);
          const task = await Task.find(req.params.id);
          const selectedLabels = await task.getLabelIds();
          reply.render('tasks/edit', { task, statuses, users, labels, selectedLabels });
        } catch (e) {
          req.flash('error', e.message);
          reply.redirect(app.reverse('tasks'));
        }
        return reply;
      }
    )
    .post('/tasks', async (req, reply) => {
      const { name, description, statusId, executorId, labels } = req.body.data;
      const taskData = {
        name,
        description,
        statusId: parseInt(statusId),
        executorId: executorId === '' ? null : parseInt(executorId),
        creatorId: req.user.id,
      };
      const task = new Task();
      const selectedLabels = parseLabels(labels);
      task.$set(taskData);
      task.$setRelated('labels', selectedLabels);
      try {
        isPermitted(req);
        await Task.create(taskData, selectedLabels);
        req.flash('info', i18next.t('flash.tasks.create.success'));
        reply.redirect(app.reverse('tasks'));
      } catch (e) {
        const statuses = await Status.index();
        const users = await User.index();
        const labels = await Label.index();
        req.flash('error', i18next.t('flash.tasks.create.error'));
        reply.render('tasks/new', { task, statuses, users, labels, selectedLabels, errors: e.data });
      }
      return reply;
    })
    .patch('/tasks/:id', async (req, reply) => {
      const { name, description, statusId, executorId, labels } = req.body.data;
      const taskData = {
        name,
        description,
        statusId: parseInt(statusId),
        executorId: executorId === '' ? null : parseInt(executorId),
      };
      let task;
      const selectedLabels = parseLabels(labels);
      try {
        isPermitted(req);
        task = await Task.find(req.params.id);
        task.$set(taskData);
        task.$setRelated('labels', selectedLabels);
        await task.update(taskData, selectedLabels);
        req.flash('info', i18next.t('flash.tasks.edit.success'));
        reply.redirect(app.reverse('tasks'));
      } catch (e) {
        const statuses = await Status.index();
        const users = await User.index();
        const labels = await Label.index();
        req.flash('error', i18next.t('flash.tasks.edit.error'));
        reply.render('tasks/edit', { task, statuses, users, labels, selectedLabels, errors: e.data });
      }
      return reply;
    })
    .delete('/tasks/:id', async (req, reply) => {
      try {
        isPermitted(req);
        isTaskOwner(req);
        await Task.delete(req.params.id);
        req.flash('info', i18next.t('flash.tasks.delete.success'));
      } catch (e) {
        req.flash('error', i18next.t('flash.tasks.delete.error'));
      }
      reply.redirect(app.reverse('tasks'));
      return reply;
    });
};

