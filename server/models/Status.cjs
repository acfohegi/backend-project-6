// @ts-check

const BaseModel = require('./BaseModel.cjs');
const objectionUnique = require('objection-unique');

const unique = objectionUnique({ fields: ['name'] });

module.exports = class Status extends unique(BaseModel) {
  static get tableName() {
    return 'statuses';
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

  async getTasks(db) {
    const Task = require('./Task.cjs');
    return await Task.query(db).where('statusId', this.id);
  }

  static async create(statusData, db) {
    const validStatus = await this.fromJson(statusData);
    await this.query(db).insert(validStatus);
  }

  async update(statusData, db) {
    await this.$query(db).patch(statusData);
  }
}

