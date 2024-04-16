// @ts-check

import i18next from 'i18next';
import { ValidationError } from 'objection';
import AccessError from '../errors/AccessError.js';

const isPermitted = (req) => {
  if (!req.isAuthenticated()) {
    throw new AccessError(i18next.t('flash.authError'));
  }
};

const isTaskOwner = (req, task) => {
  if (req.user.id !== task.creatorId) {
    throw new AccessError(i18next.t('flash.tasks.delete.notCreatorError'));
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

const parseFilters = (req) => {
  const parse = (data) => {
    if (!data) {
      return [];
    }
    return Array.isArray(data) ? data : [data];
  };
  const {
    status, executor, label, creator, isCreatorUser,
  } = req.query;
  return {
    status: parse(status),
    executor: parse(executor),
    label: parse(label),
    // query parameter 'isCreatorUser' is made in consent with requirements
    // it will override direct creator query
    creator: isCreatorUser === 'on' ? [req.user.id] : parse(creator),
  };
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
        const filters = parseFilters(req);
        const tasks = await Task.index(filters);
        const statuses = await Status.index();
        const users = await User.index();
        const labels = await Label.index();
        app.log.debug(['tasks with filters:', filters]);
        reply.render('tasks/index', {
          filters, tasks, statuses, users, labels,
        });
      } catch (e) {
        if (e instanceof AccessError) {
          req.flash('error', e.message);
          reply.redirect(app.reverse('root'));
        } else {
          throw e;
        }
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
        reply.render('tasks/new', {
          task, statuses, users, labels, selectedLabels,
        });
      } catch (e) {
        if (e instanceof AccessError) {
          req.flash('error', e.message);
          reply.redirect(app.reverse('root'));
        } else {
          throw e;
        }
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
        reply.render('tasks/show', {
          task, labels, status, creator, executor,
        });
      } catch (e) {
        if (e instanceof AccessError) {
          req.flash('error', e.message);
          reply.redirect(app.reverse('root'));
        } else {
          throw e;
        }
      }
      return reply;
    })
    .get('/tasks/:id/edit', async (req, reply) => {
      const statuses = await Status.index();
      const users = await User.index();
      const labels = await Label.index();
      try {
        isPermitted(req);
        const task = await Task.find(req.params.id);
        const selectedLabels = await task.getLabelIds();
        reply.render('tasks/edit', {
          task, statuses, users, labels, selectedLabels,
        });
      } catch (e) {
        if (e instanceof AccessError) {
          req.flash('error', e.message);
          reply.redirect(app.reverse('root'));
        } else {
          throw e;
        }
      }
      return reply;
    })
    .post('/tasks', async (req, reply) => {
      const {
        name, description, statusId, executorId, labels,
      } = req.body.data;
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
        if (e instanceof AccessError) {
          req.flash('error', e.message);
          reply.redirect(app.reverse('root'));
        } else if (e instanceof ValidationError) {
          const statuses = await Status.index();
          const users = await User.index();
          const labels = await Label.index();
          req.flash('error', i18next.t('flash.tasks.create.error'));
          reply.render('tasks/new', {
            task, statuses, users, labels, selectedLabels, errors: e.data,
          });
        } else {
          throw e;
        }
      }
      return reply;
    })
    .patch('/tasks/:id', async (req, reply) => {
      const {
        name, description, statusId, executorId, labels,
      } = req.body.data;
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
        if (e instanceof AccessError) {
          req.flash('error', e.message);
          reply.redirect(app.reverse('root'));
        } else if (e instanceof ValidationError) {
          const statuses = await Status.index();
          const users = await User.index();
          const labels = await Label.index();
          req.flash('error', i18next.t('flash.tasks.edit.error'));
          reply.render('tasks/edit', {
            task, statuses, users, labels, selectedLabels, errors: e.data,
          });
        } else {
          throw e;
        }
      }
      return reply;
    })
    .delete('/tasks/:id', async (req, reply) => {
      try {
        isPermitted(req);
        const task = await Task.find(req.params.id);
        app.log.debug(task);
        app.log.debug(req.user);
        isTaskOwner(req, task);
        await Task.delete(req.params.id);
        req.flash('info', i18next.t('flash.tasks.delete.success'));
      } catch (e) {
        app.log.error(e);// DELETE
        if (e instanceof AccessError) {
          req.flash('error', [i18next.t('flash.tasks.delete.error'), e.message].join('. '));
        } else {
          throw e;
        }
      }
      reply.redirect(app.reverse('tasks'));
      return reply;
    });
};
