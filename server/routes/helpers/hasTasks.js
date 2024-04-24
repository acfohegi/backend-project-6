import HasTasksError from '../../errors/HasTasksError.js';

export const labelHasTasks = async (label) => {
  const relations = await label.hasTasks();
  if (relations) {
    throw new HasTasksError();
  }
};

export const statusHasTasks = async (status) => {
  const tasks = await status.getTasks();
  if (tasks.length > 0) {
    throw new HasTasksError();
  }
};
