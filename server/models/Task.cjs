// @ts-check

const BaseModel = require('./BaseModel.cjs');

module.exports = class Task extends BaseModel {
  static get tableName() {
    return 'tasks';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'statusId', 'creatorId'],
      properties: {
        id: { type: 'integer' },
        name: { type: 'string', minLength: 1 },
        description: { type: 'string' },
        statusId: { type: 'integer' },
        creatorId: { type: 'integer' },
        executorId: { type: [ 'integer', 'null'] },
      },
    };
  }

  static get relationMappings() {
    const Status = require('./Status.cjs');
    const User = require('./User.cjs');

    return {
      status: {
        relation: BaseModel.HasOneRelation,
        modelClass: Status,
        join: {
          from: 'tasks.statusId',
          to: 'statuses.id'
        },
      },
      owner: {
        relation: BaseModel.HasOneRelation,
        modelClass: User,
        join: {
          from: 'tasks.ownerId',
          to: 'users.id'
        },
      },
      executor: {
        relation: BaseModel.HasOneRelation,
        modelClass: User,
        join: {
          from: 'tasks.executorId',
          to: 'users.id'
        },
      },
    }
  }

  async getStatus() {
    const Status = require('./Status.cjs');
    return await Status.query().findById(this.statusId);
  }

  async getExecutor() {
    const User = require('./User.cjs');
    return await User.query().findById(this.executorId);
  }

  async getCreator() {
    const User = require('./User.cjs');
    return await User.query().findById(this.creatorId);
  }
}

