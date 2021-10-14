import express from 'express';
import cors from 'cors';
import { getCategories } from './dataBaseFunctions.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get("/categories", (req, res) => {
    getCategories.then(resDb => res.status(200).send(resDb.rows))
});

app.listen(4000);