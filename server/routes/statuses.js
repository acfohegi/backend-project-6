// @ts-check

import i18next from 'i18next';
import { ValidationError } from 'objection';
import AccessError from '../errors/AccessError.js';
import HasTasksError from '../errors/HasTasksError.js';
import { statusHasTasks } from './helpers/hasTasks.js';

export default (app) => {
  const Status = app.objection.models.status;

  app
    .get('/statuses', { name: 'statuses' }, async (req, reply) => {
      try {
        req.isPermitted();
        const statuses = await Status.index();
        reply.render('statuses/index', { statuses });
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
    .get('/statuses/new', { name: 'newStatus' }, (req, reply) => {
      try {
        req.isPermitted();
        const status = new Status();
        reply.render('statuses/new', { status });
      } catch (e) {
        if (e instanceof AccessError) {
          req.flash('error', e.message);
          reply.redirect(app.reverse('root'));
        } else {
          throw e;
        }
      }
    })
    .get('/statuses/:id/edit', async (req, reply) => {
      try {
        req.isPermitted();
        const status = await Status.find(req.params.id);
        reply.render('statuses/edit', { status });
      } catch (e) {
        if (e instanceof AccessError) {
          req.flash('error', e.message);
          reply.redirect(app.reverse('statuses'));
        } else {
          throw e;
        }
      }
      return reply;
    })
    .post('/statuses', async (req, reply) => {
      const status = new Status();
      status.$set(req.body.data);
      try {
        req.isPermitted();
        await Status.create(req.body.data);
        req.flash('info', i18next.t('flash.statuses.create.success'));
        reply.redirect(app.reverse('statuses'));
      } catch (e) {
        if (e instanceof AccessError) {
          req.flash('error', e.message);
          reply.redirect(app.reverse('statuses'));
        } else if (e instanceof ValidationError) {
          req.flash('error', i18next.t('flash.statuses.create.error'));
          reply.render('statuses/new', { status, errors: e.data });
        } else {
          throw e;
        }
      }
      return reply;
    })
    .patch('/statuses/:id', async (req, reply) => {
      let status;
      try {
        req.isPermitted();
        // eslint-disable-next-line no-shadow
        const status = await Status.find(req.params.id);
        await status.update(req.body.data);
        req.flash('info', i18next.t('flash.statuses.edit.success'));
        reply.redirect(app.reverse('statuses'));
      } catch (e) {
        if (e instanceof AccessError) {
          req.flash('error', e.message);
          reply.redirect(app.reverse('statuses'));
        } else if (e instanceof ValidationError) {
          req.flash('error', i18next.t('flash.statuses.edit.error'));
          reply.render('statuses/edit', { status, errors: e.data });
        } else {
          throw e;
        }
      }
      return reply;
    })
    .delete('/statuses/:id', async (req, reply) => {
      try {
        req.isPermitted();
        const status = await Status.find(req.params.id);
        await statusHasTasks(status);
        await Status.delete(req.params.id);
        req.flash('info', i18next.t('flash.statuses.delete.success'));
      } catch (e) {
        if (e instanceof AccessError || e instanceof HasTasksError) {
          req.flash('error', [i18next.t('flash.statuses.delete.error'), e.message].join('. '));
        } else {
          throw e;
        }
      }
      reply.redirect(app.reverse('statuses'));
      return reply;
    });
};
