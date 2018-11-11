import passport from 'passport';
import {Strategy} from 'passport-github';
import {UserService} from '../../User';
import {TokenService} from '../../Token'
import tokenRepo from '../../../models/Token';

import config from '../../../config';

const {GITHUBAPPID, GITHUBAPPSECRET, GITHUBCBURL, DEFAULTPP} = config;

class Github {
  constructor({clientId, clientSecret, callbackUrl} = {}) {
    this.clientId = clientId || GITHUBAPPID;
    this.clientSecret = clientSecret || GITHUBAPPSECRET;
    this.callbackUrl = callbackUrl || GITHUBCBURL;
    this._strategy();
  }
  _strategy(){
    return passport.use(new Strategy({
      clientID: this.clientId,
      clientSecret: this.clientSecret,
      callbackURL: this.callbackUrl
    }, async(accessToken, refreshToken, profile, done) => {
      const {id, photos, displayName, emails} = profile;
      const userInfo = {
        github: id,
        name: displayName,
        email: emails ? emails[0].value : '',
        profilePic: photos ? photos[0].value : DEFAULTPP
      };

      const userService = new UserService();

      userService.findUserUpdateOrCreate({
        type: 'github',
        user: userInfo
      }).then(async (user) => {
        const token = new TokenService({payload: {
          id: user[0].id,
        }});
        const tokenInfo = await tokenRepo.insertToken({
          user_id: user[0].id,
          accessToken: token.accessToken
        });
  
        done(null, {...user, ...tokenInfo})
      });

    }))
  }

  authenticate(){
    return passport.authenticate('github', {session:false});
  }

  authCallback(){
    return passport.authenticate('github', {session:false})
  }
}

export {Github}