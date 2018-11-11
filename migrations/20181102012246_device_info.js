
exports.up = function(knex, Promise) {
  return knex.schema.createTable('device_info', function(tbl){
    tbl.increments('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
    tbl.string('user_agent',600)
    tbl.string('ip', 30)
    tbl.integer('addres_id').references('id').inTable('locations').onDelete('CASCADE').index()
    tbl.bigInteger('created_at').notNullable();
    tbl.bigInteger('updated_at').nullable();
    tbl.bigInteger('deleted_at').nullable();
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('device_info')
};
