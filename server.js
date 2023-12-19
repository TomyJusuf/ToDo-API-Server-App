import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import router from './router.js';

const app = express();
const PORT = 4000;

// Use cors middleware with the custom origin function
app.use(
  cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
  })
);

app.use(bodyParser.json());

// Endpoint to handle POST requests from the frontend
app.use('/api', router);

//localhost:4000/api/todo
app.listen(PORT, () => {
  console.log('Server listen on port ' + PORT);
});
