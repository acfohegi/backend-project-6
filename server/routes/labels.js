// @ts-check

import i18next from 'i18next';
import { ValidationError } from 'objection';
import AccessError from '../errors/AccessError.js';
import HasTasksError from '../errors/HasTasksError.js';
import { labelHasTasks } from './helpers/hasTasks.js';

export default (app) => {
  const Label = app.objection.models.label;

  app
    .get('/labels', { name: 'labels' }, async (req, reply) => {
      try {
        req.isPermitted();
        const labels = await Label.index();
        reply.render('labels/index', { labels });
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
    .get('/labels/new', { name: 'newLabel' }, (req, reply) => {
      try {
        req.isPermitted();
        const label = new Label();
        reply.render('labels/new', { label });
      } catch (e) {
        if (e instanceof AccessError) {
          req.flash('error', e.message);
          reply.redirect(app.reverse('root'));
        } else {
          throw e;
        }
      }
    })
    .get('/labels/:id/edit', async (req, reply) => {
      try {
        req.isPermitted();
        const label = await Label.find(req.params.id);
        reply.render('labels/edit', { label });
      } catch (e) {
        if (e instanceof AccessError) {
          req.flash('error', e.message);
          reply.redirect(app.reverse('labels'));
        } else {
          throw e;
        }
      }
      return reply;
    })
    .post('/labels', async (req, reply) => {
      const label = new Label();
      label.$set(req.body.data);
      try {
        req.isPermitted();
        await Label.create(req.body.data);
        req.flash('info', i18next.t('flash.labels.create.success'));
        reply.redirect(app.reverse('labels'));
      } catch (e) {
        if (e instanceof AccessError) {
          req.flash('error', e.message);
          reply.redirect(app.reverse('labels'));
        } else if (e instanceof ValidationError) {
          req.flash('error', i18next.t('flash.labels.create.error'));
          reply.render('labels/new', { label, errors: e.data });
        } else {
          throw e;
        }
      }
      return reply;
    })
    .patch('/labels/:id', async (req, reply) => {
      let label;
      try {
        req.isPermitted();
        label = await Label.find(req.params.id);
        await label.update(req.body.data);
        req.flash('info', i18next.t('flash.labels.edit.success'));
        reply.redirect(app.reverse('labels'));
      } catch (e) {
        if (e instanceof AccessError) {
          req.flash('error', e.message);
          reply.redirect(app.reverse('labels'));
        } else if (e instanceof ValidationError) {
          req.flash('error', i18next.t('flash.labels.edit.error'));
          reply.render('labels/edit', { label, errors: e.data });
        } else {
          throw e;
        }
      }
      return reply;
    })
    .delete('/labels/:id', async (req, reply) => {
      try {
        req.isPermitted();
        const label = await Label.find(req.params.id);
        await labelHasTasks(label);
        await Label.delete(label.id);
        req.flash('info', i18next.t('flash.labels.delete.success'));
      } catch (e) {
        if (e instanceof AccessError || e instanceof HasTasksError) {
          req.flash('error', [i18next.t('flash.labels.delete.error'), e.message].join('. '));
        } else {
          throw e;
        }
      }
      reply.redirect(app.reverse('labels'));
      return reply;
    });
};
