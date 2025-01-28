import express from 'express';
import dotenv from 'dotenv';
import { promptProcessor } from './controller/information.js';
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/', promptProcessor);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
