const express = require('express');
const userRoutes = express.Router();
const { responseGet, responsePost, responseError } = require('../src/response');

// get all users
userRoutes.get('', (req, res) => {
    responseGet(200, 'Success!', 1, 1, [{
        id: 1,
        name: 'John Doe',
        age: 20,
    },
    {
        id: 2,
        name: 'Jane Doe',
        age: 22,
    }
    ], res);
});

// get user by id
userRoutes.get('/:id', (req, res) => {
    responseGet(200, 'Success!', 1, 1, {
        id: 1,
        name: 'John Doe',
        age: 20,
    }, res);
});

// create new user
userRoutes.post('', (req, res) => {
    responsePost(200, 'Success!', {
        id: 1,
        name: 'John Doe',
        age: 20,
    }, res);
});

// if route not found
userRoutes.get('/*', (req, res) => {
    responseError(404, 'Not found!', 'Route not found!', res);
});

module.exports = userRoutes;