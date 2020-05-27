const { onUpdateTrigger } = require('../../knexfile');

exports.up = function(knex) {
  return knex.schema.createTable('trails', function (table) {
    table.increments('id').notNull().primary();
    table.uuid('case_id').notNull().references('cases.id').onDelete('CASCADE');
    table.specificType('coordinates', 'geometry(point, 4326)');
    table.timestamp('time');
    table.string('hash');
    table.timestamp('updated_at').defaultTo(knex.fn.now())
    table.timestamp('created_at').defaultTo(knex.fn.now())
  }).then(() => knex.raw(onUpdateTrigger('trails')));
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('trails');
};
