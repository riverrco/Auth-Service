import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import UserRepo from "../../../models/User";
import config from "../../../config";

const { JWT_SECRET } = config;

class JWT {
  constructor({ secret, model } = {}) {
    this.secret = secret || JWT_SECRET;
    this.model = model || UserRepo;
    this._strategy();
  }
  _strategy() {
    return passport.use(
      Strategy(
        {
          secretOrKey: this.secret,
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          passReqToCallback: true
        },
        async (payload, done) => {
          try {
            const { id } = payload;
            const user = await this.model.findUserById(id);
            if (user) return done(null, user);
            return done(null, false);
          } catch (e) {
            done(e, false);
          }
        }
      )
    );
  }
  authenticate() {
    return passport.authenticate("jwt", {
      session: false,
      secret: this.secret
    });
  }
}

export {JWT}