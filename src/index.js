const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT;
const apiRouter = express.Router();

apiRouter.get('/*', (req, res) => {
    res.status(404).send('Not found!');
});

app.use('/api', apiRouter);

apiRouter.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(404).send('Error Occured!');
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})
