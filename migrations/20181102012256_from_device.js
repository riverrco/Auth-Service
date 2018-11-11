
exports.up = function(knex, Promise) {
  return knex.schema.createTable('from_device', function(tbl) {
    tbl.increments("id").primary()
    tbl.uuid('token_id').unsigned().notNullable()
      .references('id').inTable('tokens').onDelete('CASCADE').index()
    
    tbl.integer('device_id').unsigned().notNullable()
      .references('id').inTable('device_info').onDelete('CASCADE').index()
    tbl.bigInteger('created_at').notNullable();
    tbl.bigInteger('updated_at').nullable();
    tbl.bigInteger('deleted_at').nullable();
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('from_device')
};
