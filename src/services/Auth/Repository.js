import bcrypt from "bcryptjs";


export default {
  // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: HASH PASSWORD
  async hashPassword(password) {
    try {
      const salt = await bcrypt.genSalt(10);
      return await bcrypt.hash(password, salt);
    } catch (e) {
      console.log(e);
    }
  },
  // ::::::::::::::::::::::::::::::::::::: COMPARE PLAIN TEXT PASS TO HASHED ONE
  async comparePassword(password, compared){
    try{
      return await bcrypt.compare(password, compared)
    } catch (e) {
      console.log(e)
    }
  },

  // ::::::::::::::::::::::::::::::::::::::::::::::: CHECK ALL FIELDS ARE TRUTHY
  fieldControl(fieldsObj){
    return Object.values(fieldsObj).every(item => item);
  },

};
