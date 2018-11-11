import passport from 'passport';
import {Strategy} from 'passport-google-oauth20';
import {UserService} from '../../User';
import {TokenService} from '../../Token'
import tokenRepo from '../../../models/Token';
import config from '../../../config';

const {GOOGLEAPPID, GOOGLEAPPSECRET, GOOGLECBURL, DEFAULTPP } = config;

class Google {
  constructor ({clientId, clientSecret, callbackUrl} = {}){
    this.clientId = clientId || GOOGLEAPPID;
    this.clientSecret = clientSecret || GOOGLEAPPSECRET;
    this.callBackUrl = callbackUrl || GOOGLECBURL
    this._strategy();
  }
  _strategy(){
    return passport.use(new Strategy({
      clientID: this.clientId,
      clientSecret: this.clientSecret,
      callbackURL: this.callBackUrl
    }, async (accessToken, refreshToken, profile, done) =>{
  

      const {id, name: {familyName, givenName}, emails, photos} = profile;
      
      const userInfo = {
        google: id,
        name: givenName,
        surname: familyName,
        email: emails[0].value,
        profilePic: photos ? photos[0].value : DEFAULTPP,
      };
      const userService = new UserService();
      
     userService.findUserUpdateOrCreate({
        type: 'google',
        user: userInfo
      }).then( async (user) => {
        const token = new TokenService({payload: {id: user[0].id}});
        const tokenInfo = await tokenRepo.insertToken({
          user_id: user[0].id,
          accessToken: token.accessToken
        })
        done(null, {...user, ...tokenInfo})
      })
    }))
  }

  authenticate(){
    return passport.authenticate('google', {session: false, scope: ['openid', 'email' ,'profile'] });
  }

  authCallback(){
    return passport.authenticate('google', {
      session: false,
      authType: 'rerequest',
    })
  }
}

export {Google};