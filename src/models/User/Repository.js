import { User as Model } from "./Model";

const returnedFields = ["id", "email", "name", "password", "surname", "recoveryCode"];
// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: EXPORT DEFAULT
export const Repository = {
  // :::::::::::::::::::::::::::::::::::::::::::::::::::::::: FIND USER BY EMAIL
  findUserByEmail(email) {
    return Model.query().where("email", email);
  },

  // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: REGISTER USER
  registerUser(user) {
    return Model.query().insertAndFetch(user).pick(["id", "email", "name", "surname"])
  },

  updateUser(predicate, data) {
    return Model.query()
      .patch(data)
      .where(predicate);
  },

  findByIdOrMail({ id, email }) {
    return Model.query()
      .where(id ? id : false)
      .orWhere(email ? { email } : false)
      .select(returnedFields);
  },

  findUserById(id) {
    return Model.query().findById(id);
  },

  deleteRegistration(id) {
    return Model.query().deleteById(id);
  }
};
