import {Router} from 'express';

const router = Router();
const OauthRoutes = (auth) => {
  
  router.get('/facebookauth', auth.loginWithOAuth('facebook').authenticate());
  router.get('/facebook/return', 
    auth.loginWithOAuth('facebook').authCB(), (req,res) => {
      res.redirect('/auth/token')
  });

  router.get('/googleauth', auth.loginWithOAuth('google').authenticate());
  router.get('/google/return', 
    auth.loginWithOAuth('google').authCB(), (req,res) => {
      res.redirect('/auth/token')
  });

  router.get('/githubauth', auth.loginWithOAuth('github').authenticate());
  router.get('/github/callback', auth.loginWithOAuth('github').authCB(),
    (req,res) => res.redirect('/auth/token'));

  return router;
}

export {OauthRoutes};

