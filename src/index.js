const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

const port = process.env.PORT;
const apiRouter = express.Router();
const userRoutes = require('../routes/user');
const { responseGet, responsePost, responseError } = require('./response');

// use json and urlencoded middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// create simple logging middleware
const logging = (req, res, next) => {
    console.log(`Request: ${req.method} ${req.originalUrl}`);
    next();
}

// use logging middleware
app.use(logging);

// if route not found
apiRouter.get('/*', (req, res) => {
    responseError(404, 'Not found!', 'Route not found!', res);
});

// error handler
apiRouter.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(404).send('Error Occured!');
})

app.use('/api/user', userRoutes);
app.use('/api', apiRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})
