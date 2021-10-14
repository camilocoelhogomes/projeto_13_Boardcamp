import express from 'express';
import cors from 'cors';
import {
    getCategories,
    isCategorie,
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
    const { error } = categorieSchema.validate(req.body);
    if (!!error) return res.status(400).send();
    const { name } = req.body;
    isCategorie(name).then(resDb =>
        resDb.rows.length > 0 ?
            res.status(409).send() :
            postCategories(name).then(() => res.status(201).send())
    );
});

app.listen(4000);