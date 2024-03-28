// @ts-check

import i18next from 'i18next';

const isPermitted = (req) => {
  if (!req.isAuthenticated()) {
    throw new Error(i18next.t('flash.authError'));
  }
}

export default (app) => {
  const Label = app.objection.models.label;

  app
    .get('/labels', { name: 'labels' }, async (req, reply) => {
      try {
        isPermitted(req);
        const labels = await Label.index();
        reply.render('labels/index', { labels });
      } catch (e) {
        req.flash('error', e.message);
        reply.redirect(app.reverse('root'));
      }
      return reply;
    })
    .get('/labels/new', { name: 'newLabel' }, (req, reply) => {
      try {
        isPermitted(req);
        const label = new Label();
        reply.render('labels/new', { label });
      } catch (e) {
        req.flash('error', e.message);
        reply.redirect(app.reverse('root'));
      }
    })
    .get(
      '/labels/:id/edit',
      // { name: 'editUser', preHandler: app.fp.authenticate },
      async (req, reply) => {
        try {
          isPermitted(req);
          const label = await Label.find(req.params.id);
          reply.render('labels/edit', { label });
        } catch (e) {
          req.flash('error', e.message);
          reply.redirect(app.reverse('labels'));
        }
        return reply;
      }
    )
    .post('/labels', async (req, reply) => {
      const label = new Label();
      label.$set(req.body.data);
      try {
        isPermitted(req);
        await Label.create(req.body.data);
        req.flash('info', i18next.t('flash.labels.create.success'));
        reply.redirect(app.reverse('labels'));
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.labels.create.error'));
        reply.render('labels/new', { label, errors: data });
      }
      return reply;
    })
    .patch('/labels/:id', async (req, reply) => {
      let label;
      try {
        isPermitted(req);
        label = await Label.find(req.params.id);
        await label.update(req.body.data);
        req.flash('info', i18next.t('flash.labels.edit.success'));
        reply.redirect(app.reverse('labels'));
      } catch (e) {
        req.flash('error', i18next.t('flash.labels.edit.error'));
        reply.render('labels/edit', { label, errors: e.data });
      }
      return reply;
    })
    .delete('/labels/:id', async (req, reply) => {
      try {
        isPermitted(req);
        const label = await Label.find(req.params.id);
        const relations = await label.hasTasks();
        if (relations) {
          throw Error(i18next.t('flash.labels.delete.hasTasks'));
        }
        await Label.delete(label.id);
        req.flash('info', i18next.t('flash.labels.delete.success'));
      } catch (e) {
        req.flash('error', i18next.t('flash.labels.delete.error'), e.message);
      }
      reply.redirect(app.reverse('labels'));
      return reply;
    });
};

