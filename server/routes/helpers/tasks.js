import i18next from 'i18next';
import AccessError from '../../errors/AccessError.js';

export const isTaskOwner = (req, task) => {
  if (req.user.id !== task.creatorId) {
    throw new AccessError(i18next.t('flash.tasks.delete.notCreatorError'));
  }
};

export const parseFilters = (req) => {
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

export const parseLabels = (req) => {
  const { labels } = req.body.data;
  if (Array.isArray(labels)) {
    return labels.map((l) => parseInt(l, 10));
  }
  if (typeof labels === 'string') {
    return [parseInt(labels, 10)];
  }
  return [];
};

export const parseTaskData = (req) => {
  const {
    name, description, statusId, executorId,
  } = req.body.data;
  return {
    name,
    description,
    statusId: parseInt(statusId, 10),
    executorId: executorId === '' ? null : parseInt(executorId, 10),
  };
};
