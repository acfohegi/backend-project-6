import i18next from 'i18next';
import AccessError from '../../errors/AccessError.js';
import HasTasksError from '../../errors/HasTasksError.js';

export const isUser = (req) => {
  if (req.user.id.toString() !== req.params.id) {
    throw new AccessError(i18next.t('flash.authError'));
  }
};

export const userHasTasks = async (user) => {
  const tasks = await user.getTasks();
  if (tasks.length > 0) {
    throw new HasTasksError();
  }
};
