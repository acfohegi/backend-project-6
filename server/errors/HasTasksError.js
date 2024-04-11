import i18next from 'i18next';
import AppError from './AppError.js';

export default class HasTasksError extends AppError {
  constructor(message = i18next.t('flash.hasTasksError')) {
    super(message);
  }
};

