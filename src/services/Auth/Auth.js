import userRepo from '../../models/User';
import tokenRepo from '../../models/Token';
import {FacebookStrategy, GoogleStrategy, GithubStrategy} from './Strategies';
import AuthRepository from './Repository';
import {TokenService} from '../Token';
import {UserService} from '../User';


class Auth {
  constructor({user, token, auth, userService} = {}) {
    this.userRepo = user || userRepo;
    this.tokenRepo = token || tokenRepo;
    this.AuthRepository = auth || AuthRepository
    this.userService = userService || new UserService();
  }
  // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: SIGN UP

  /**
   * takes user informations and controls if all necessery fields are exists. 
   * if does hashes password and saves to db. and if no error occure, creates a 
   * token, saves to token db and returns.
   */

  async signUp({name, surname, email, password}){
    
    try{
      const isValid = this.AuthRepository.fieldControl({name, surname, email, password});
      
      
      if(isValid){
        const hashedPassword = await this.AuthRepository.hashPassword(password);
        const user = await this.userService.addUser({name, surname, email, password: hashedPassword});
        

        if(user && user.error) return ({error: user.error})
        const token = new TokenService({payload: user});

        const tokenInf = await this.tokenRepo.insertToken({
          user_id: user.id,
          accessToken: token.accessToken
        })

        return {user, token: tokenInf};
      }

      else {
        return ({error: 'Fields are invalid'})
      }
      
    } catch (e) {
      console.log(e);
    }
  }

  // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::  LOGIN

  /**
   * Login handler, takes email and password, checks if user exist, if true, 
   * compares passwords if true creates a token from token service and saves to
   * db.
   */

  async login({email, password}){
    const user = await this.userService.findUser({email});
    if(user.length === 0) return ({error: 'Invalid Credentials'});
    else {
      const {id,name, email, surname} = user[0];
      const isValidPassword = await this.AuthRepository.comparePassword(password, user[0].password);
      if(!isValidPassword) return ({error: 'Invalid Credentials'});
      else {
        const token = new TokenService({payload: {id,name,email,surname}});
        const tokenInf = await this.tokenRepo.insertToken({
          user_id: id,
          accessToken: token.accessToken
        })
        return {user:{id, name, surname, email,}, token: tokenInf};
      }
    }
  }

  // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: OAUTH HANDLERS

  /**
   * Takes the oauth type such as facebook, google etc. and returns strategies
   */

  loginWithOAuth(type){
    switch(type){
      case 'facebook':
        const facebook = new FacebookStrategy();
        return ({authenticate: facebook.authenticate, authCB: facebook.authCallback});
      case 'google':
        const google = new GoogleStrategy();
        return ({authenticate: google.authenticate, authCB: google.authCallback});
      case 'github': 
        const github = new GithubStrategy();
        return ({authenticate: github.authenticate, authCB: github.authCallback});
    }
  }

  // ::::::::::::::::::::::::::::::::::::::::::::::::::  FORGET PASSWORD HANDLER

  /**
   * Takes email, checks if email exist, if does, creates 24h valid token and 
   * saves to db and returns to true;
   */

  async forgetPassword(email){
    const user = await this.userService.findUser({email});
    if(user.length === 0) return false;
    else {
      const {id} = user[0];
      const code = new TokenService({payload: {id},ttl: '24h'});
      const status = await this.userRepo.updateUser({id}, {recoveryCode: code.accessToken});
      if(status === 1 ) return true;
      return false;
    }
  }

  // :::::::::::::::::::::::::::::::::::::::::::::: VERIFY RECOVERY CODE HANDLER

  /**
   * Takes recovery code and email, checks if user exisist, if does takes 
   * recoveryCode from the database which assigned to user, checks if code is 
   * exactly same if it is, also checks if it is validated within 24h. if it is 
   * returns decoded token with verified flag
   */

  async verifyRecoveryCode(code, email){
    const user = await this.userService.findUser({email});
    if(user.length === 0) return ({isValid:false});
    else {
      const {recoveryCode} = user[0];
      if(recoveryCode !== code) return ({isValid:false});
      const token = new TokenService({token: code});
      const status = await token.isValid();
      if(!status.isValid) return  ({isValid:false});
      return status;
    }
  }

  // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: CHANGE PASSWORD
  /**
   * takes id and password, first hashes the oasswird and updates the users pass
   */


  async changePassword({id, password}) {
    const hashedPassword = await this.AuthRepository.hashPassword(password);
    const status = await this.userRepo.updateUser({id}, {password: hashedPassword});
    if(status === 1 ) return ({status: 'success'})
    return ({status: 'failed'}) 
  }

  // ::::::::::::::::::::::::::::::::::::::::::::::::: DELETE USED RECOVERY CODE
  /**
   * takes id, and deletes the recoveryCode belongs to that id. 
   */

  async deleteRecoveryCode({id}){
    const status =  await this.userRepo.updateUser({id}, {recoveryCode: ''});
    if(status === 1 ) return ({process: 'success'});
    return ({process: 'failed'})
  }

  // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: LOGOUT
  /**
   * Takes access token and deletes from the database
   */
  async logout(accessToken){
    const status = await this.tokenRepo.deleteToken(accessToken);
    if (status === 1) return true;
    return false;
  }

  // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: VERIFY TOKEN

  /**
   * Takes token and checks if token is valid
   */

   verifyToken(token) {
     const tokenService = new TokenService({token});
     return tokenService.isValid();
   }
}

export {Auth}