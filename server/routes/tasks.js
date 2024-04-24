// @ts-check

import i18next from 'i18next';
import { ValidationError } from 'objection';
import AccessError from '../errors/AccessError.js';
import {
  isTaskOwner, parseFilters, parseLabels, parseTaskData,
} from './helpers/tasks.js';

export default (app) => {
  const Task = app.objection.models.task;
  const User = app.objection.models.user;
  const Status = app.objection.models.status;
  const Label = app.objection.models.label;

  app
    .get(
      '/tasks',
      {
        name: 'tasks',
        preHandler: (req, _reply, done) => {
          req.filters = parseFilters(req);
          done();
        },
      },
      async (req, reply) => {
        try {
          req.isPermitted();
          const { filters } = req;
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
      },
    )
    .get('/tasks/new', { name: 'newTask' }, async (req, reply) => {
      try {
        req.isPermitted();
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
        req.isPermitted();
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
        req.isPermitted();
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
    .post('/tasks', {
      preHandler: (req, _reply, done) => {
        req.selectedLabels = parseLabels(req);
        req.taskData = parseTaskData(req);
        req.taskData.creatorId = req.user.id;
        done();
      },
    }, async (req, reply) => {
      const task = new Task();
      task.$set(req.taskData);
      task.$setRelated('labels', req.selectedLabels);
      try {
        req.isPermitted();
        await Task.create(req.taskData, req.selectedLabels);
        req.flash('info', i18next.t('flash.tasks.create.success'));
        reply.redirect(app.reverse('tasks'));
      } catch (e) {
        if (e instanceof AccessError) {
          req.flash('error', e.message);
          reply.redirect(app.reverse('root'));
        } else if (e instanceof ValidationError) {
          const statuses = await Status.index();
          const users = await User.index();
          // eslint-disable-next-line no-shadow
          const labels = await Label.index();
          const { selectedLabels } = req;
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
    .patch('/tasks/:id', {
      preHandler: (req, _reply, done) => {
        req.selectedLabels = parseLabels(req);
        req.taskData = parseTaskData(req);
        done();
      },
    }, async (req, reply) => {
      let task;
      try {
        req.isPermitted();
        task = await Task.find(req.params.id);
        task.$set(req.taskData);
        task.$setRelated('labels', req.selectedLabels);
        await task.update(req.taskData, req.selectedLabels);
        req.flash('info', i18next.t('flash.tasks.edit.success'));
        reply.redirect(app.reverse('tasks'));
      } catch (e) {
        if (e instanceof AccessError) {
          req.flash('error', e.message);
          reply.redirect(app.reverse('root'));
        } else if (e instanceof ValidationError) {
          const statuses = await Status.index();
          const users = await User.index();
          // eslint-disable-next-line no-shadow
          const labels = await Label.index();
          const { selectedLabels } = req;
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
        req.isPermitted();
        const task = await Task.find(req.params.id);
        isTaskOwner(req, task);
        await Task.delete(req.params.id);
        req.flash('info', i18next.t('flash.tasks.delete.success'));
      } catch (e) {
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
