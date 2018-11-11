import jwt from 'jsonwebtoken';
import config from '../../config';
import diffrenceInSeconds from 'date-fns/difference_in_seconds';
import isAfter from 'date-fns/is_after'

const {JWT_SECRET} = config;

/**
 * @Payload: Object
 * @Token: string
 * @type: string
 */
class Token {
  constructor({payload, token, type, ttl} = {}){
    this._now = new Date()
    this.jwtSecret = JWT_SECRET;
    this.ttl = ttl || '30d';
    this._payload = {...payload, type: type || 'user' }
    this._token = !token ? this._createToken({...this._payload}, JWT_SECRET) : token;
    this._expires = this._calculateTimeLeft(this._token)
  }

  // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: DECODE TOKEN
  /**
   * takes token as param, and decodes the info out of it. Does not need to 
   * initialize object as a static method
   */

  static decodeToken(token){
    return jwt.decode(token);
  }

  // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: ISVALID?
  /**
   * Takes token from constructor and returns an promise, checks if token exists
   * if does checks isExpired if not returns and object contains data and validity
   * 
   */

  isValid(){
    const {_token} = this;
    return new Promise((resolve,reject) => {
      if(!_token || this._isExpired()){
        return resolve({isValid: false})
      };
      jwt.verify(_token, JWT_SECRET, (err, data) => {
        if (err) return reject(err);
        resolve({isValid: true, data});
      });
    })
  }
  // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: GETTERS

  // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::GET ACCESS TOKEN
  get accessToken() {return this._token}

  // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: GET EXPIRES IN
  get expiresIn() {return this._expires}

  // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: TIME LEFT
  /**
   * INTERNAL METHOD
   * takes token as an argument and decodes it, if decoded returns null, function
   * execution stops. Else calls _timeHelper function with exp property of token
   * EXECUTION HAPPENS IN constructor
   */

  _calculateTimeLeft(token){
    const decoded = Token.decodeToken(token);
    if(!decoded) return null;
    return this._timeHelper(decoded.exp)
  }

  // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: TIME CALCULATER
  /**
   * INTERNAL METHOD
   * takes a timestamp, calculate the time diffrences in seconds, and converts 
   * to mins, hours, days and returns an object which includes days, hours, mins
   * seconds left also exact date of expiration.
   * EXECUTION HAPPENS IN _calculateTimeLeft
   */

  _timeHelper(exp){
    const seconds = diffrenceInSeconds(new Date(exp * 1000), this._now);
    const secondsLeft = Math.floor(seconds % 60);
    const mins = Math.floor(seconds/60);
    const minsLeft = Math.floor(mins % 60);
    const hours = Math.floor(mins / 60);
    const hoursLeft = Math.floor(hours % 24);
    const daysLeft = Math.floor(hours / 24);
    return ({
      days: daysLeft < 0 ? 0 : daysLeft, 
      hours: hoursLeft < 0 ? 0 : hoursLeft, 
      mins: minsLeft < 0 ? 0 : minsLeft, 
      seconds: secondsLeft < 0 ? 0 : secondsLeft,
      exactDate: new Date(exp * 1000)
    });
  }

  // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: CREATE TOKEN
  /**
   * INTERNAL METHOD
   * Takes payload and signs token. 
   * EXECUTION HAPPENS IN constructor
   */

  _createToken(payload){
    return jwt.sign(payload, this.jwtSecret, {expiresIn: this.ttl});
  }


  // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: ISEXPIRED?
  /**
   * INTERNAL METHOD
   * Takes no argument, takes expire time from constructor and checks if it is
   * after than now. 
   * EXECUTION HAPPENS IN isValid
   */
  _isExpired(){
    if(this._expires){
      const {exactDate} = this._expires;
      return isAfter(this._now, exactDate);
    }
    return true;
  }
}


export {Token};

