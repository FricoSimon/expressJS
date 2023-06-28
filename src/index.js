const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

// routes
const port = process.env.PORT;
const router = express.Router();
const apiRouter = express.Router();
const userRoutes = require('../routes/user');
const authRoutes = require('../routes/auth');
const { responseGet, responsePost, responseError } = require('./response');

const cookieSession = require('cookie-session');
const passport = require('passport');

require('../database/connect');

// use json and urlencoded middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// use cookie session middleware
app.use(cookieSession({
    name: 'saved-Sessions',
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: true,
    domain: 'localhost', // domain: 'localhost' for development
    path: '/api', // path: '/api' for development
    secure: false, // secure: false for development
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

// create simple logging middleware
const logging = (req, res, next) => {
    console.log(`Request: ${req.method} ${req.originalUrl}`);
    next();
}

app.use(logging);

app.use(passport.initialize());
app.use(passport.session());

// check auth route first
app.use('/api/auth', authRoutes);

// use middleware to check if user is logged in or not
app.use((req, res, next) => {
    if (req.session.username) next();
    else responseError(401, 'Unauthorized!', 'You are not authorized!', res);
})

// user route after auth
app.use('/api/user', userRoutes);

// if route not found for api/
apiRouter.get('/*', (req, res) => {
    responseError(404, 'Not found!', 'Route not found!', res);
});
app.use('/api', apiRouter);

// if route not found for /
router.get('/*', (req, res) => {
    responseError(404, 'Not found!', 'Route not found!', res);
});
app.use('', router);

// error handler
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(404).send('Error Occured!');
}

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})
