import {Token as Model} from './Model';



// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: EXPORT DEFAULT
export const Repository = {
  insertToken(token) {
    return Model.query().insert(token)
  },

  deleteToken(accessToken){
    return Model.query().delete().where({accessToken});
  }
};