import Auth from '../services/Auth';
import {OauthRoutes} from './Oauth';
import {Core} from './Core';
import express, {Router} from 'express';

const auth = new Auth();
const router = express();

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::  COMBINED ROUTES

const routes = () => {

  router.use('/',OauthRoutes(auth));
  router.use('/', Core(auth));
  
  return router;
};

export default routes;

