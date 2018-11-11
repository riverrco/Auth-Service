import 'babel-polyfill';
import 'core-js/es6/map';
import 'core-js/es6/set';

import db from './db'

global.db = db;