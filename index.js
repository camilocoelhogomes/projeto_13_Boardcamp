import express from 'express';
import cors from 'cors';
import {
    exist,
    postCategories,
    postGames,
    searchFromTable,
    postCustomers,
    getAllFromTable,
    existWhenEditing,
    putCustomers,
} from './dataBaseFunctions.js';
import { categorieSchema, customerSchema, gamesSchema } from './validation.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get("/categories", (req, res) => {
    try {
        getAllFromTable({ table: 'categories' }).then(resDb => res.status(200).send(resDb.rows))
    }
    catch (error) {
        res.status(500).send()
    }
});

app.post('/categories', async (req, res) => {
    const { error } = categorieSchema.validate(req.body);
    if (!!error) return res.status(400).send();
    try {

        const { name } = req.body;
        const isName = await exist({ dataSearch: name, table: 'categories', collumn: 'name' });
        if (!!isName.rows.length) return res.status(409).send()

        postCategories(name).then(() => res.status(201).send())
    } catch (error) {
        res.status(500).send()
    }

});

app.get("/games", (req, res) => {
    const { name } = req.query;
    try {
        if (!!name) {
            searchFromTable({ dataSearch: name, table: 'games', collumn: 'name' }).then(resDb => res.status(200).send(resDb.rows))
        } else {
            getAllFromTable({ table: 'games' }).then(resDb => res.status(200).send(resDb.rows));
        }
    } catch (error) {
        res.status(500).send()
    }
});

app.post('/games', async (req, res) => {
    const { error } = gamesSchema.validate(req.body);
    if (!!error) return res.status(400).send();
    const {
        name,
        categoryId,
    } = req.body;
    try {
        const isCategorie = await exist({ dataSearch: categoryId, table: 'categories', collumn: 'id' });
        if (!isCategorie.rows.length) return res.status(400).send();

        const isGame = await exist({ dataSearch: name, table: 'games', collumn: 'name' });
        if (!!isGame.rows.length) return res.status(409).send();

        postGames(req.body).then(res.status(201).send())
    } catch (error) {
        res.status(500).send()
    }
})

app.get('/customers', (req, res) => {
    const { cpf } = req.query;
    try {
        if (!!cpf) {
            searchFromTable({ dataSearch: cpf, table: 'customers', collumn: 'cpf' })
                .then(resDb => res.status(200).send(resDb.rows));
        } else {
            getAllFromTable({ table: 'customers' })
                .then(resDb => res.status(200).send(resDb.rows));
        }
    } catch (error) {
        res.status(500).send();
    }
})

app.get('/customers/:customerId', async (req, res) => {
    const { customerId } = req.params;
    try {
        const client = await exist({ dataSearch: customerId, table: 'customers', collumn: 'id' });
        if (!client.rows.length) return res.status(404).send();
        res.status(200).send(client.rows[0])
    } catch (error) {
        res.status(500).send();
    }
})

app.post('/customers', async (req, res) => {
    const { error } = customerSchema.validate(req.body);
    if (!!error) return res.status(400).send(error);
    try {
        const isCpf = await exist({ dataSearch: req.body.cpf, table: 'customers', collumn: 'cpf' });
        if (!!isCpf.rows.length) return res.status(409).send();

        postCustomers(req.body).then(() => res.status(201).send())
    } catch (error) {
        res.status(500).send();
    }
})

app.put('/customers/:customerId', async (req, res) => {
    const { customerId } = req.params;
    try {
        const client = await exist({ dataSearch: customerId, table: 'customers', collumn: 'id' });
        if (!client.rows.length) return res.status(404).send();

        const { error } = customerSchema.validate(req.body);
        if (!!error) return res.status(400).send(error);

        const isCpf = await existWhenEditing({ dataSearch: req.body.cpf, table: 'customers', collumn: 'cpf', customerId: customerId });
        if (!!isCpf.rows.length) return res.status(409).send();

        putCustomers({ ...req.body, customerId: customerId }).then(() => res.status(201).send())
    } catch (error) {
        res.status(500).send();
    }
})

app.listen(4000);