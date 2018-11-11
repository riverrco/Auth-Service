import knex from 'knex';
import knexCleaner from 'knex-cleaner';
import Model, {knexConfigEnv} from '../src/connectors/psql/Model';

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: Import END

const workingDB = Model.knex();
const postgressAccess = {
  ...knexConfigEnv,
  connection: {...knexConfigEnv.connection, database: 'postgres'}
};

const workingDBName = knexConfigEnv.connection.database;
const superUserDb = knex(postgressAccess);

export default {
  dbHooks({beforeAll, afterEach, afterAll}){
    beforeAll(async(t) => await this.prepareDB());
    afterEach((t) => this.clearDB());
    afterAll(async(t) => await this.dropDB());
  },

  clearDB(){
    return knexCleaner.clean(workingDB)
      .then(() => console.log(`${workingDBName} Cleaned`))
  },
  prepareDB(){
    return superUserDb
      .raw(`Create Database ${workingDBName}`)
      .then((result) => {
        console.log(`${workingDBName} created`);
        return this.migrate();
      })
  },
  migrate() {
    return workingDB.migrate.latest()
      .then(() => console.log(`${workingDBName} migrated`))
  },
  async dropDB(){
    const database = knexConfigEnv.connection.database;
    await workingDB.destroy();
    return superUserDb.raw(`DROP DATABASE ${database}`)
      .then((result) => {
        console.log(`${workingDBName} Dropped`)
        return result;
      });
  }
};

