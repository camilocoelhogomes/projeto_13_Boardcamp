import express from 'express';
import cors from 'cors';
import {
    getCategories,
    exist,
    postCategories,
    getGames,
    postGames,
} from './dataBaseFunctions.js';
import { categorieSchema, gamesSchema } from './validation.js';


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
    exist({ dataName: name, table: 'categories', collumn: 'name' }).then(resDb =>
        resDb.rows.length > 0 ?
            res.status(409).send() :
            postCategories(name).then(() => res.status(201).send())
    );
});

app.get("/games", (req, res) => {
    getGames.then(resDb => res.status(200).send(resDb.rows));
});

app.post('/games', (req, res) => {
    const { error } = gamesSchema.validate(req.body);
    console.log(error);
    if (!!error) return res.status(400).send();
    const {
        name,
        categoryId,
    } = req.body;
    exist({ dataName: categoryId, table: 'categories', collumn: 'id' }).then(resDb =>
        resDb.rows.length === 0 ?
            res.status(400).send() :
            exist({ dataName: name, table: 'games', collumn: 'name' }).then(resDb =>
                resDb.rows.length > 0 ?
                    res.status(409).send() :
                    exist({ dataName: name, table: 'games', collumn: 'name' }).then(resDb =>
                        resDb.rows.length > 0 ?
                            res.status(409).send() :
                            postGames(req.body).then(res.status(201).send())
                    )
            )
    );
})

app.listen(4000);