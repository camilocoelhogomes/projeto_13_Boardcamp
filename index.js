import express from 'express';
import cors from 'cors';
import { query } from './dataBaseFunctions.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    query.then(resDb => res.send(resDb.rows))
});

app.listen(4000);