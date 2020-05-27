exports.up = function(knex) {
  return knex.schema.createTable('access_codes', function (table) {
    table.string('id', 6).primary();
    table.uuid('case_id').notNull().references('cases.id').onDelete('CASCADE');
    table.timestamp('invalidated_at').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('access_codes');
};
