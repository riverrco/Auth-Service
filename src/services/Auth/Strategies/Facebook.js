import passport from 'passport';
import {Strategy} from 'passport-facebook';
import {UserService} from '../../User';
import {TokenService} from '../../Token'
import tokenRepo from '../../../models/Token';
import config from '../../../config';


const {FBAPPSECRET, FBAPPID, FBCBURL,DEFAULTPP} = config;
const fields = ['id', 'displayName', 'emails', 'first_name', 'middle_name', 'last_name', 'picture.type(large)'];
const defaultPermissions =['user_friends', 'emails', 'public_profile'];


class Facebook {
  constructor({callbackUrl, clientId, clientSecret, permissions, profileFields} = {}){
    this.clientId = clientId || FBAPPID;
    this.clientSecret= clientSecret || FBAPPSECRET;
    this.callbackUrl = callbackUrl || FBCBURL;
    this.profileFields = profileFields || fields;
    this.permissions = permissions || defaultPermissions;
    this._strategy();
  }

  _strategy(){
    passport.use(new Strategy({
      clientID: this.clientId,
      clientSecret: this.clientSecret,
      callbackURL: this.callbackUrl,
      enableProof: true,
      profileFields: this.profileFields
    }, async(accessToken, refreshToken, profile, done) => {
     try{
      const {id, name:{familyName, givenName}, email} = profile;

      const userService = new UserService();
      const userInfo = { 
        facebook: id,
        name: givenName, 
        surname: familyName,
        profilePic: profile.photos ? profile.photos[0].value : DEFAULTPP,
        email: email
      };
      
      userService.findUserUpdateOrCreate({
        type: 'facebook',
        user: userInfo
      }).then(async (user) => {
        const token = new TokenService({payload: {id: user[0].id}});
        const tokenInfo = await tokenRepo.insertToken({
          user_id: user[0].id,
          accessToken: token.accessToken
        });
        done(null, {...userInfo, ... tokenInfo})
      })

     }catch(e){
       console.log(e)
     }
    }))
  }

  authenticate(){
    return passport.authenticate('facebook', {session: false});
  }

  authCallback(){
    return passport.authenticate('facebook', {
      session: false,
      authType: 'rerequest',
      scope: this.permissions
    })
  }
}

export {Facebook}