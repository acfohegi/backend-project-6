// @ts-check

import i18next from 'i18next';

const isPermitted = (req) => {
  if (!req.isAuthenticated()) {
    throw new Error(i18next.t('flash.authError'));
  }
}

const getCurrentStatus = async (req) => {
  return await req.server.objection.models.status.query().findById(req.params.id);
}

export default (app) => {
  app
    .get('/statuses', { name: 'statuses' }, async (req, reply) => {
      try {
        isPermitted(req);
        const statuses = await app.objection.models.status.query();
        reply.render('statuses/index', { statuses });
      } catch (e) {
        req.flash('error', e.message);
        reply.redirect(app.reverse('root'));
      }
      return reply;
    })
    .get('/statuses/new', { name: 'newStatus' }, (req, reply) => {
      try {
        isPermitted(req);
        const status = new app.objection.models.status();
        reply.render('statuses/new', { status });
      } catch (e) {
        req.flash('error', e.message);
        reply.redirect(app.reverse('root'));
      }
    })
    .post('/statuses', async (req, reply) => {
      const status = new app.objection.models.status();
      status.$set(req.body.data);
      try {
        isPermitted(req);
        const validStatus = await app.objection.models.status.fromJson(req.body.data);
        await app.objection.models.status.query().insert(validStatus);
        req.flash('info', i18next.t('flash.statuses.create.success'));
        reply.redirect(app.reverse('root'));
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.statuses.create.error'));
        reply.render('statuses/new', { status, errors: data });
      }
      return reply;
    })
    .get(
      '/statuses/:id/edit',
      // { name: 'editUser', preHandler: app.fp.authenticate },
      async (req, reply) => {
        try {
          isPermitted(req);
          const status = await getCurrentStatus(req);
          reply.render('statuses/edit', { status });
        } catch (e) {
          req.flash('error', e.message);
          reply.redirect(app.reverse('statuses'));
        }
        return reply;
      }
    )
    .patch('/statuses/:id', async (req, reply) => {
      let status;
      try {
        isPermitted(req);
        status = await getCurrentStatus(req);
        await status.$query().patch(req.body.data);
        req.flash('info', i18next.t('flash.statuses.edit.success'));
        reply.redirect(app.reverse('statuses'));
      } catch (e) {
        req.flash('error', i18next.t('flash.statuses.edit.error'));
        reply.render('statuses/edit', { status, errors: e.data });
      }
      return reply;
    })
    .delete('/statuses/:id', async (req, reply) => {
      try {
        isPermitted(req);
        const status = await getCurrentStatus(req);
        const tasks = await status.getTasks();
        if (tasks.length > 0) {
          throw Error(i18next.t('flash.tasks.delete.hasTasks'));
        }
        const statusId = req.params.id;
        await app.objection.models.status.query().deleteById(statusId);
        req.flash('info', i18next.t('flash.status.delete.success'));
      } catch (e) {
        req.flash('error', i18next.t('flash.status.delete.error'), e.message);
      }
      reply.redirect(app.reverse('status'));
      return reply;
    });
};

