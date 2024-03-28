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
    const Label = require('./Label.cjs');
    const TaskLabel = require('./TaskLabel.cjs');
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
      labels: {
        relation: BaseModel.ManyToManyRelation,
        modelClass: Label,
        join: {
          from: 'tasks.id',
          through: {
            modelClass: TaskLabel,
            from: 'tasks_labels.taskId',
            to: 'tasks_labels.labelId'
          },
          to: 'labels.id'
        },
      },
    }
  }

  async getStatus(db) {
    const Status = require('./Status.cjs');
    return await Status.query(db).findById(this.statusId);
  }

  async getExecutor(db) {
    const User = require('./User.cjs');
    return await User.query(db).findById(this.executorId);
  }

  async getCreator(db) {
    const User = require('./User.cjs');
    return await User.query().findById(this.creatorId);
  }

  async getTasksLabels(db) {
    const TaskLabel = require('./TaskLabel.cjs');
    return await TaskLabel.query(db).where('taskId', this.id);
  }

  async getLabelIds(db) {
    const tasksLabels = await this.getTasksLabels(db);
    if (!tasksLabels) {
      return [];
    }
    return tasksLabels.map((tl) => tl.labelId);
  }

  async getLabels(db) {
    const tasksLabels = await this.getTasksLabels(db);
    if (!tasksLabels) {
      return [];
    }
    const promises = tasksLabels.map((tl) => tl.getLabel(db));
    return Promise.all(promises);
  }

  static async create(taskData, labels) {
    const trx = await BaseModel.startTransaction();
    try {
      const validTask = await this.fromJson(taskData);
      const insertedTask = await this.query(trx).insert(validTask);
      for (const l of labels) {
        await this.relatedQuery('labels', trx).for(insertedTask.id).relate(l);
      }
      await trx.commit();
    } catch (e) {
      await trx.rollback();
      throw e;
    }
  }

  async update(taskData, labels){
    const Task = this.$modelClass;
    const trx = await BaseModel.startTransaction();
    try {
      await this.$query(trx).patch(taskData);
      const currentLabels = await this.getLabelIds(trx)
      const labelsToDelete = currentLabels.filter((l) => !labels.includes(l));
      const labelsToAdd = labels.filter((l) => !currentLabels.includes(l));
      for (const l of labelsToDelete) {
        await Task.relatedQuery('labels', trx).for(this.id).unrelate()
          .where('labelId', l);
      }
      for (const l of labelsToAdd) {
        await Task.relatedQuery('labels', trx).for(this.id).relate(l);
      }
      await trx.commit();
    } catch (e) {
      await trx.rollback();
      throw e;
    }
  }
}

