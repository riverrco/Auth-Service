import regUserDetail from '../../../utils/registerUserInfo'

export default (auth) => ({

  // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: SIGN UP HANDLER
  async signup(req, res) {
    try {      
      const { name, surname, password, email } = req.body;
      const user = await auth.signUp({ name, surname, password, email });
      if (user && user.error) return res.status(501).json({ ...user });
      await regUserDetail({ip: req.ip, userAgent: req.headers["user-agent"], tokenId: user.token.id})
      return res.json({ ...user });
    } catch (e) {
      res.status(500).json({ error: "Internal Server Error On Signup" });
    }
  },

  // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: LOGIN HANDLER
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await auth.login({ email, password });
      if(user && user.token) await regUserDetail({ip: req.ip, userAgent: req.headers["user-agent"], tokenId: user.token.id})
      return res.json({ ...user });
    } catch (e) {
      res.status(500).json({ error: "Internal Server Error On Login" });
    }
  },
  // ::::::::::::::::::::::::::::::::::::::::::::::::::: FORGET PASSWORD HANDLER
  async forgetPassword(req, res) {
    try {
      const { email } = req.body;
      const status = await auth.forgetPassword(email);
      return res.json({ status });
    } catch (e) {
      console.log(e);
      res
        .status(500)
        .json({ error: "Internal Server Error On ForgetPassword" });
    }
  },

  // ::::::::::::::::::::::::::::::::::::::::::::::::::::: RECOVERY CODE HANDLER
  async verifyRecoveryCode(req, res) {
    try {
      const { token } = req.params;
      const { password, email } = req.body;
      const status = await auth.verifyRecoveryCode(token, email);
      if(status && !status.isValid) return res.status(401).json({status: 'Invalid'});
      const passwordChange = await auth.changePassword({id: status.data.id, password});
      if(passwordChange && passwordChange.status === 'success') {
        await auth.deleteRecoveryCode({id: status.data.id});
        return res.json({...status});  
      }
      return res.status(401).json({status: 'Error occured while change password'});
    } catch (e) {
      console.log(e)
      res
        .status(500)
        .json({ error: "Internal Server Error On Verify Recovery Code" });
    }
  },

  // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: LOGOUT HANDLER

  async logout(req,res) {
    try{
      const {authorization} = req.headers;
      const status = await auth.logout(authorization.slice(7));
      if(!status) return res.json({status: 'failed'});
      return res.json({status: 'success'})
    } catch (e){
      res
      .status(500)
      .json({ error: "Internal Server Error On Logout" });

    }
  },

  // :::::::::::::::::::::::::::::::::::::::::::::::::::::: VERIFY TOKEN HANDLER

  async verifyToken(req,res) {
    try{
      const {token} = req.body;
      const result =  await auth.verifyToken({token});
      return res.json({...result})
    } catch(e){
      res
      .status(500)
      .json({ error: "Internal Server Error On verifyToken"});
    }
  }
});
