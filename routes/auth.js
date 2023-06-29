const express = require('express');
const authRoutes = express.Router();
const { responseGet, responsePost, responseError } = require('../src/response');
const User = require('../database/schema/user');
const { hashPassword, comparePassword } = require('../utils/hash');

const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 15 minutes
    max: 2 // limit each IP to 5 requests
})

// login route
authRoutes.post('/login', limiter, async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) responseError(400, 'Bad Request!', 'Username or password is required!', res);
    if (email && password) {
        const userDB = await User.findOne({ email: email });
        if (!userDB) {
            responseError(400, 'Bad Request!', 'Username is incorrect!', res);
        } else {
            const isMatch = await comparePassword(password, userDB.password);
            if (isMatch) {
                req.session.user = userDB;
                responsePost(200, 'Login Successful!', userDB, res);
            } else {
                responseError(400, 'Bad Request!', 'Password is incorrect!', res);
            }
        }
    }
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

// if route not found
authRoutes.get('/*', (req, res) => {
    responseError(404, 'Not found!', 'Route not found!', res);
});

module.exports = authRoutes;