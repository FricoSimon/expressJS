const express = require('express');
const userRoutes = express.Router();
const { responseGet, responsePost, responseError } = require('../src/response');
const University = require('../database/schema/university');

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

userRoutes.post('/register/university', async (req, res) => {
    const { major, year } = req.body;
    if (major && year) {
        const newUniversity = await University.create({ major, year });
        responsePost(200, 'Success!', newUniversity, res);
    } else {
        responseError(400, 'Bad Request!', 'Major and year are required!', res);
    }
});

// if route not found
userRoutes.get('/*', (req, res) => {
    responseError(404, 'Not found!', 'Route not found!', res);
});

module.exports = userRoutes;