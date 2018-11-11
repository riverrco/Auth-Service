import {Router} from 'express';
import handlers from './handlers';
import AuthService from "../../services/Auth";


const auth = new AuthService();
const router = Router();


const Core = () => {
  const handler = handlers(auth);
  // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: SIGNUP 
  // (POST) auth/signup ::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  // name, surname, password, email REQUIRED :::::::::::::::::::::::::::::::::::

  router.post('/signup', handler.signup);

  // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: LOGIN 
  // (POST) auth/login :::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  // email, password REQUIRED ::::::::::::::::::::::::::::::::::::::::::::::::::

  router.post('/login', handler.login);
  
  // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: FORGET PASSWORD 
  // (POST) auth/forgetpassword ::::::::::::::::::::::::::::::::::::::::::::::::
  // email REQUIRED ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

  router.post('/forgetpassword', handler.forgetPassword);
  
  // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::  ACCOUNT RECOVERY 
  // (POST) auth/forgetpassword/:recoveryToken :::::::::::::::::::::::::::::::::
  // recoveryToken as param, email, password as new password REQUIRED ::::::::::
  router.post('/forgetpassword/:token', handler.verifyRecoveryCode)
  
  // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::  LOGOUT 
  // (GET) auth/logout :::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  // token REQUIRED ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

  router.get('/logout', handler.logout)
  
  // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::  VERIFY TOKEN 
  // (POST) auth/verify :::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  // token REQUIRED ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

  router.post('/verify', handler.verifyToken);

  return router;
}

export {Core};

