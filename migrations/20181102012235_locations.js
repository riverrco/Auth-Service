
exports.up = function(knex, Promise) {
  return knex.schema.createTable('locations', function(tbl){
    tbl.increments('id').primary()
    tbl.string('region', 100)
    tbl.string('city', 100)
    tbl.string('country', 100)
    tbl.float('lng')
    tbl.float('lat')
    tbl.bigInteger('created_at').notNullable();
    tbl.bigInteger('updated_at').nullable();
    tbl.bigInteger('deleted_at').nullable();
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('locations')
};
