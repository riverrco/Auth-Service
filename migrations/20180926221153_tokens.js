
exports.up = function(knex, Promise) {
  return knex.schema.createTable('tokens', function(tbl){
    tbl.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    tbl.uuid('user_id').notNullable()
      .references('id').inTable('users').onDelete('CASCADE');
    tbl.string('accessToken',600).notNullable()
    tbl.bigInteger('created_at').notNullable();
    tbl.bigInteger('updated_at').nullable();
    tbl.bigInteger('deleted_at').nullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('tokens')
};
