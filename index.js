import express from 'express';
import dotenv from 'dotenv';
import { model } from './config/model.js';
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/', async (req, res) => {
    const { prompt } = req.body;
    const result = await model.generateContent(prompt);
    console.log(result.response.text());
    res.json({ result: result.response.text() });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

