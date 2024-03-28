// @ts-check

const { Model } = require('objection');

module.exports = class BaseModel extends Model {
  static get modelPaths() {
    return [__dirname];
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

