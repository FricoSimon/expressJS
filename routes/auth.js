const express = require('express');
const authRoutes = express.Router();
const { responseGet, responsePost, responseError } = require('../src/response');
const User = require('../database/schema/user');
const { hashPassword, comparePassword } = require('../utils/hash');

// require('../strategies/local')
require('../strategies/discord')

const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const passport = require('passport');

// limit request
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 15 minutes
    max: 2 // limit each IP to 5 requests
})

// sanitize request
authRoutes.use(mongoSanitize());

// login route
// authRoutes.post('/login', limiter, async (req, res) => {
//     const { email, password } = req.body;
//     if (!email || !password) responseError(400, 'Bad Request!', 'Username or password is required!', res);
//     if (email && password) {
//         const userDB = await User.findOne({ email: email });
//         if (!userDB) {
//             responseError(400, 'Bad Request!', 'Username is incorrect!', res);
//         } else {
//             const isMatch = await comparePassword(password, userDB.password);
//             if (isMatch) {
//                 req.session.user = userDB;
//                 responsePost(200, 'Login Successful!', userDB, res);
//             } else {
//                 responseError(400, 'Bad Request!', 'Password is incorrect!', res);
//             }
//         }
//     }
// });

// login route with passport
authRoutes.post('/login', limiter, passport.authenticate('local'), (req, res) => {
    console.log('logged in');
});

// register route
authRoutes.post('/register', limiter, async (req, res) => {
    const email = req.body.email;
    const userDB = await User.findOne({ email });
    if (userDB) {
        responseError(400, 'Bad Request!', 'Username or email already exists!', res);
    } else {
        const password = await hashPassword(req.body.password);
        const newUser = await User.create({ email, password });
        responsePost(200, 'Success!', newUser, res);
    }
});

authRoutes.get('/discord', passport.authenticate('discord'), (req, res) => {
    responsePost(200, 'Success!', 'ok', res);
});

authRoutes.get('/discord/redirect', passport.authenticate('discord'), (req, res) => {
    responsePost(200, 'Success!', 'ok', res);
});

// if route not found
authRoutes.get('/*', (req, res) => {
    responseError(404, 'Not found!', 'Route not found!', res);
});

module.exports = authRoutes;