import passport from 'passport';
import { User } from '../database/models/user.model';
import  passportLocal from 'passport-local';


const LocalStrategy = passportLocal.Strategy;


passport.use(new LocalStrategy({

    // Strategy is based on username & password.  Substitute email for username.
    usernameField: 'user[email]',
    passwordField: 'user[password]'
  },

  async (email, password, done) => {
    try {
      const user = await User.findOne({email});
      if (!user) {
        return done(null, false, {message: 'Incorrect email.'});
      }
      const isValid = await user.validPassword(password);
      if (!isValid) {
        return done(null, false, {message: 'Incorrect password.'});
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }));
