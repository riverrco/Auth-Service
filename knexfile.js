const config = require('./src/config');



const {
  PG_HOST,
  PG_PORT,
  PG_USER,
  PG_PASSWORD,
  PG_DB
} = config;

module.exports = {
  /// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: DEVELOPMENT
  development: {
    client: 'pg',
    connection: {
      database: PG_DB,
      host: PG_HOST,
      user: PG_USER,
      port: PG_PORT,
      password:PG_PASSWORD,
      charset: 'utf8'
    },
    debug: false,
    migrations: {tableName: 'migrations'},
    seeds: {directory: './seeds'}
  },
  /// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: PRODUCTION
  production: {
    client: 'pg',
    connection: {
      database: PG_DB,
      host: PG_HOST,
      user: PG_USER,
      port: PG_PORT,
      password: PG_PASSWORD,
      charset: 'utf8'
    },
    migrations: {tableName: 'migrations'},
    seeds: {directory: 'seeds'}
  },
  /// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: TESTING
  test: {
    client: 'pg',
    connection: {
      database: PG_DB + '_' + process.pid,
      host: PG_HOST,
      user: PG_USER,
      port: PG_PORT,
      password: PG_PASSWORD,
      charset: 'utf8'
    },
    migrations: {tableName: 'migrations'},
    seeds: {directory: './seeds'}
  }
};