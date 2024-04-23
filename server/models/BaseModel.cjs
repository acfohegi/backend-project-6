// @ts-check

const { Model } = require('objection');

module.exports = class BaseModel extends Model {
  static get modelPaths() {
    return [__dirname];
  }

  $beforeUpdate() {
    // on a model level because knex can't do it for postgres on schema level
    // https://github.com/knex/knex/issues/1928
    this.updated_at = new Date().toISOString();
  }

  static async find(id, db) {
    return await this.query(db).findById(id);
  }

  static async index(db) {
    return await this.query(db);
  }

  static async delete(id, db) {
    await this.query(db).deleteById(id);
  }
}

