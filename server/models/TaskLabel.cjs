// @ts-check

const BaseModel = require('./BaseModel.cjs');

module.exports = class TaskLabel extends BaseModel {
  static get tableName() {
    return 'tasks_labels';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['taskId', 'labelId'],
      properties: {
        id: { type: 'integer' },
        taskId: { type: 'integer' },
        labelId: { type: 'integer' },
      },
    };
  }

  async getTask(db) {
    const Task = require('./Task.cjs');
    return await Task.query(db).findOne('id', this.taskId);
  }

  async getLabel(db) {
    const Label = require('./Label.cjs');
    return await Label.query(db).findOne('id', this.labelId);
  }
}

