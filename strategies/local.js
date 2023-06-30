const passport = require('passport');
const { Strategy } = require('passport-local');
const User = require('../database/schema/user');
const { comparePassword } = require('../utils/hash');

passport.use(new Strategy({
    usernameField: 'email'
},
    async (email, password, done) => {
        try {
            if (!email || !password) return done(null, false, { message: 'Username or password is required!' });
            const userDB = await User.findOne({ email: email });

            if (!userDB) return done(null, false, { message: 'Username is incorrect!' });
            const isMatch = await comparePassword(password, userDB.password);

            if (isMatch) {
                console.log(email, password);
                return done(null, userDB);
            } else {
                console.log('invalid password');
                return done(null, false, { message: 'Password is incorrect!' });
            }
        } catch (err) {
            return done(err);
        }
    }
))