const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT;
const apiRouter = express.Router();
const { responseGet, responsePost, responseError } = require('./response');

apiRouter.get('/user', (req, res) => {
    responseGet(200, 'Success!', 1, 1, {
        name: 'John Doe',
        age: 20,
    }, res);
});

apiRouter.post('/user', (req, res) => {
    responsePost(200, 'Success!', {
        name: 'John Doe',
        age: 20,
    }, res);
});

// if route not found
apiRouter.get('/*', (req, res) => {
    responseError(404, 'Not found!', 'Route not found!', res);
});

// router /api/* will be handled by apiRouter
app.use('/api', apiRouter);

// error handler
apiRouter.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(404).send('Error Occured!');
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})
