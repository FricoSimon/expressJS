const express = require('express');
const authRoutes = express.Router();
const { responseGet, responsePost, responseError } = require('../src/response');
const User = require('../database/schema/user');

authRoutes.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username && password) {
        if (req.session.username) {
            responsePost(200, 'Successful!', { username, password }, res);
        } else {
            req.session.username = username;
            responsePost(200, 'Success!', { username, password }, res);
        }
    } else {
        responseError(400, 'Bad Request!', 'Username and password are required!', res);
    }
});
authRoutes.post('/register', async (req, res) => {
    const { username, password, email } = req.body;
    const userDB = await User.findOne({ $or: [{ username }, { email }] });
    if (userDB) {
        responseError(400, 'Bad Request!', 'Username or email already exists!', res);
    } else {
        const newUser = await User.create({ username, password, email });
        responsePost(200, 'Success!', newUser, res);
    }
});

// if route not found
authRoutes.get('/*', (req, res) => {
    responseError(404, 'Not found!', 'Route not found!', res);
});

module.exports = authRoutes;