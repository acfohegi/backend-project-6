// @ts-check

import i18next from 'i18next';

const isPermitted = (req) => {
  if (!req.isAuthenticated()) {
    throw new Error(i18next.t('flash.authError'));
  }
}

export default (app) => {
  const Status = app.objection.models.status;

  app
    .get('/statuses', { name: 'statuses' }, async (req, reply) => {
      try {
        isPermitted(req);
        const statuses = await Status.index();
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
        const status = new Status();
        reply.render('statuses/new', { status });
      } catch (e) {
        req.flash('error', e.message);
        reply.redirect(app.reverse('root'));
      }
    })
    .get(
      '/statuses/:id/edit',
      // { name: 'editUser', preHandler: app.fp.authenticate },
      async (req, reply) => {
        try {
          isPermitted(req);
          const status = await Status.find(req.params.id);
          reply.render('statuses/edit', { status });
        } catch (e) {
          req.flash('error', e.message);
          reply.redirect(app.reverse('statuses'));
        }
        return reply;
      }
    )
    .post('/statuses', async (req, reply) => {
      const status = new Status();
      status.$set(req.body.data);
      try {
        isPermitted(req);
        await Status.create(req.body.data);
        req.flash('info', i18next.t('flash.statuses.create.success'));
        reply.redirect(app.reverse('root'));
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.statuses.create.error'));
        reply.render('statuses/new', { status, errors: data });
      }
      return reply;
    })
    .patch('/statuses/:id', async (req, reply) => {
      let status;
      try {
        isPermitted(req);
        const status = await Status.find(req.params.id);
        await status.update(req.body.data);
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
        const status = await Status.find(req.params.id);
        const tasks = await status.getTasks();
        if (tasks.length > 0) {
          throw Error(i18next.t('flash.statuses.delete.hasTasks'));
        }
        await Status.delete(req.params.id);
        req.flash('info', i18next.t('flash.statuses.delete.success'));
      } catch (e) {
        req.flash('error', i18next.t('flash.statuses.delete.error'), e.message);
      }
      reply.redirect(app.reverse('statuses'));
      return reply;
    });
};

