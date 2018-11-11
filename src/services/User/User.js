import UserRepo from '../../models/User';

class User {
  constructor(model){
    this.model = model || UserRepo
  }
  ///:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: Add User
  /**
   * Send user as object check if user mail exist if save user to database
   */

  async addUser(user){
    try{
      const fetched = await this.model.findUserByEmail(user.email);
      if(fetched.length === 0){
        return await this.model.registerUser(user);
      }
      else{
        return ({error: 'Email already in use'})
      }
    }catch (e) {
      console.log(e)
    }
  }

  //:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::Find User
  //:::::::::::::::::::::::::::::::::::::::::::::::: Update OR Create new record

  /**
   * accepts a type such as facebook, github and user object, checks if user 
   * which belongs to type exists if does return fetched user, if email exists
   * if does check id exists if not update id with the realated type. 
   */

  async findUserUpdateOrCreate({type, user}){
    const id = {[type]: user[type]};
    const email = user.email;
    try{
      const fetched = await this.model.findByIdOrMail({id,email});
      if(fetched.length === 0) return this.model.registerUser(user);
      if(user.email && fetched[0].email === user.email) {
        await this.model.updateUser({email}, id);
        return await this.model.findByIdOrMail({id, email})
      }
      return fetched;
    }
    catch(e){
      console.log(e)
    }
  }

  ///::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: Delete User
  /**
   * Take id as imput and deletes the user.
   */

  async deleteUser(id){
    return await this.model.deleteRegistration(id);
  }

  ///:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: EDIT
  /**
   * Edit user takes user object and updates the user
   */

  async editUser(user){
    const {id} = user;
    await this.model.updateUser(id, user);
    return await this.model.findByIdOrMail({id, email: user.email})
  }

  // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: FIND USER
  /**
   * accepts id and email checks if user exisists
   */
  
  findUser({id, email} = {}){
    return this.model.findByIdOrMail({id, email});
  }

}

export {User}