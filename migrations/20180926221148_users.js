
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(tbl){
    tbl.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()')).unique();
    tbl.string('email', 60).unique();
    tbl.string('password', 60).nullable();
    tbl.string('name', 60).notNullable();
    tbl.string('surname', 60).nullable();
    tbl.string('google').nullable();
    tbl.string('facebook').nullable();
    tbl.string('github').nullable();
    tbl.string('profilePic').nullable();
    tbl.string('recoveryCode').nullable();
    tbl.bigInteger('created_at').notNullable();
    tbl.bigInteger('updated_at').nullable();
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users')
};
