const express = require('express');
const authRoutes = express.Router();
const { responseGet, responsePost, responseError } = require('../src/response');
const User = require('../database/schema/user');
const { hashPassword, comparePassword } = require('../utils/hash');

authRoutes.post('/login', (req, res) => {
    const { username, password } = req.body;

});

authRoutes.post('/register', async (req, res) => {
    const { username, email } = req.body;
    const userDB = await User.findOne({ email });
    if (userDB) {
        responseError(400, 'Bad Request!', 'Username or email already exists!', res);
    } else {
        const password = await hashPassword(req.body.password);
        const newUser = await User.create({ username, password, email });
        responsePost(200, 'Success!', newUser, res);
    }
});

// if route not found
authRoutes.get('/*', (req, res) => {
    responseError(404, 'Not found!', 'Route not found!', res);
});

module.exports = authRoutes;