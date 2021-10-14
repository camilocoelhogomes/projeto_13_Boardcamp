import express from 'express';
import cors from 'cors';
import {
    getCategories,
    postCategories,
} from './dataBaseFunctions.js';
import { categorieSchema } from './validation.js';


const app = express();
app.use(cors());
app.use(express.json());

app.get("/categories", (req, res) => {
    getCategories.then(resDb => res.status(200).send(resDb.rows))
});

app.post('/categories', (req, res) => {
    const { error, value } = categorieSchema.validate(req.body);
    //const { name } = req.body
    //  postCategories(name).then(() => res.status(201).send());
    if (!!error) return res.send(400);

    res.send({ error, value, })
});

app.listen(4000);