const passport = require('passport');
const { Strategy } = require('passport-local');
const User = require('../database/schema/user');
const { comparePassword } = require('../utils/hash');

// use passport 0.5 because ver 6 had an error with cookie session
// so be careful when using this since ver 0.5 had a lot of vulnerabilities
passport.serializeUser((user, done) => {
    console.log('serialize user');
    done(null, user.id);
})

passport.deserializeUser(async (id, done) => {
    console.log('deserialize user');
    console.log(id);
    try {
        const user = await User.findById(id)
        if (!user) return done(null, false);
        done(null, user);
    } catch (err) {
        console.log(err);
        done(err);
    }
})

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