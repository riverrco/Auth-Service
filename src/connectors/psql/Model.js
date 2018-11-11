import knexConfig from '../../../knexfile';
import {BaseModel} from './BaseModel';

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: KNEX ENV SETUP

const environment = process.env.NODE_ENV || 'development';
const knexConfigEnv = knexConfig[environment];
const knex = require('knex')({ ...knexConfigEnv, debug: false });

BaseModel.knex(knex);


export {
  BaseModel as default,
  knexConfigEnv,
};
