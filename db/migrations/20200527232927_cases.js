const { onUpdateTrigger } = require('../../knexfile');

exports.up = function(knex) {
  return knex.schema.createTable('cases', function (table) {
    table.uuid('id').notNull().primary();
    table.boolean('consent');
    table.timestamp('updated_at').defaultTo(knex.fn.now())
    table.timestamp('created_at').defaultTo(knex.fn.now())
  }).then(() => knex.raw(onUpdateTrigger('cases')));
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('cases');
};
