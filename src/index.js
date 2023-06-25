const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

const port = process.env.PORT;
const router = express.Router();
const apiRouter = express.Router();
const userRoutes = require('../routes/user');
const authRoutes = require('../routes/auth');
const { responseGet, responsePost, responseError } = require('./response');

const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');

require('../database/connect');

// use json and urlencoded middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// use cookie parser middleware
app.use(cookieParser());
app.use(cookieSession({
    secret: 'asdasdasdasdad',
    resave: false,
    saveUninitialized: true,
}));

// create simple logging middleware
const logging = (req, res, next) => {
    console.log(`Request: ${req.method} ${req.originalUrl}`);
    next();
}

app.use(logging);

app.use('/api/auth', authRoutes);

// use middleware to check if user is logged in or not
app.use((req, res, next) => {
    if (req.session.username) next();
    else responseError(401, 'Unauthorized!', 'You are not authorized!', res);
})

app.use('/api/user', userRoutes);

// if route not found
apiRouter.get('/*', (req, res) => {
    responseError(404, 'Not found!', 'Route not found!', res);
});

app.use('/api', apiRouter);

// if route not found
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
