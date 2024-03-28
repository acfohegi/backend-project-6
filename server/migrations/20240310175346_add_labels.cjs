/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .createTable('labels', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
    .createTable('tasks_labels', (table) => {
      table.increments('id').primary();
      table.integer('task_id').notNullable().references('tasks.id').onDelete('CASCADE');
      table.integer('label_id').notNullable().references('labels.id').onDelete('RESTRICT');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
 return knex.schema
  .dropTable('tasks_labels')
  .dropTable('labels');
};
