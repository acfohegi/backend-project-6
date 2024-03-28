// @ts-check

const BaseModel = require('./BaseModel.cjs');

module.exports = class Label extends BaseModel {
  static get tableName() {
    return 'labels';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name'],
      properties: {
        id: { type: 'integer' },
        name: { type: 'string', minLength: 1 },
      },
    };
  }

  async hasTasks(db) {
    const TaskLabel = require('./TaskLabel.cjs');
    const tasksLabels = await TaskLabel.query(db).where('labelId', this.id);
    return Array.isArray(tasksLabels) && tasksLabels.length > 0;
  }

  async getTasks(db) {
    const TaskLabel = require('./TaskLabel.cjs');
    const tasksLabels = await TaskLabel.query(db).where('labelId', this.id);
    if (!tasksLabels) {
      return [];
    }
    const promises = tasksLabels.map((tl) => tl.getTask(db));
    return Promise.all(promises);
  }

  static async create(labelData, db) {
    const validLabel = await this.fromJson(labelData);
    await this.query(db).insert(validLabel);
  }

  async update(labelData, db) {
    await this.$query(db).patch(labelData);
  }
}

