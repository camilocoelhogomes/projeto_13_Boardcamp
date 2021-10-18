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
    postRental,
    returnRental,
    deleteRental,
    getRentals,
} from './dataBaseFunctions.js';
import { categorieSchema, customerSchema, gamesSchema, rentalSchema } from './validation.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get("/categories", (req, res) => {
    getAllFromTable({ table: 'categories' })
        .then(resDb => res.status(200).send(resDb.rows))
        .catch(() => res.status(500).send())
});

app.post('/categories', async (req, res) => {
    const { error } = categorieSchema.validate(req.body);
    if (!!error) return res.status(400).send();
    try {

        const { name } = req.body;
        const isName = await exist({ dataSearch: name, table: 'categories', collumn: 'name' });
        if (!!isName.rows.length) return res.status(409).send()

        await postCategories(name);
        res.status(201).send();

    } catch (error) {
        res.status(500).send()
    }

});

app.get("/games", (req, res) => {
    const { name } = req.query;
    if (!!name) {
        searchFromTable({ dataSearch: name, table: 'games', collumn: 'name' })
            .then(resDb => res.status(200).send(resDb.rows))
            .catch(() => res.status(500).send())
    } else {
        getAllFromTable({ table: 'games' })
            .then(resDb => res.status(200).send(resDb.rows))
            .catch(() => res.status(500).send())
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

        await postGames(req.body)
        res.status(201).send();
    } catch (error) {
        res.status(500).send()
    }
})

app.get('/customers', (req, res) => {
    const { cpf } = req.query;
    if (!!cpf) {
        searchFromTable({ dataSearch: cpf, table: 'customers', collumn: 'cpf' })
            .then(resDb => res.status(200).send(resDb.rows))
            .catch(() => res.status(500).send())
    } else {
        getAllFromTable({ table: 'customers' })
            .then(resDb => res.status(200).send(resDb.rows))
            .catch(() => res.status(500).send())
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

        await postCustomers(req.body)
        res.status(201).send();

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

        await putCustomers({ ...req.body, customerId: customerId })
        res.status(201).send();
    } catch (error) {
        res.status(500).send();
    }
})

app.post('/rentals', async (req, res) => {

    const { error } = rentalSchema.validate(req.body);
    if (!!error) return res.status(400).send();

    try {
        const customer = await exist({ dataSearch: req.body.customerId, table: 'customers', collumn: 'id' });
        const game = await exist({ dataSearch: req.body.gameId, table: 'games', collumn: 'id' });

        if (!customer.rows.length || !game.rows.length) return res.status(400).send();

        const rent = {
            ...req.body,
            rentDate: new Date(),
            returnDate: null,
            delayFee: null,
            originalPrice: game.rows[0].pricePerDay * req.body.daysRented,
        }
        await postRental(rent);
        res.status(201).send(rent);
    } catch (error) {
        res.status(500).send(error);
    }

})

app.post('/rentals/:rentalId/return', async (req, res) => {
    const { rentalId } = req.params;
    try {
        const isRental = await exist({ dataSearch: rentalId, table: 'rentals', collumn: 'id' });
        if (!isRental.rows.length) return res.status(404).send();
        if (!isRental.rows[0].returnDate) return res.sendStatus(400);
        const returnDate = new Date();
        const { rentDate, daysRented, originalPrice } = isRental.rows[0];
        const realDaysRented = Math.floor(Math.abs(returnDate - rentDate) / (8.64 * (10 ** 7)));
        let delayFee = 0;
        if (realDaysRented > daysRented) {
            delayFee = (realDaysRented - daysRented) * (originalPrice / daysRented);
        }
        await returnRental({ rentalId, returnDate, delayFee });
        res.sendStatus(200);
    } catch (error) {
        res.status(500).send(error);
    }
})

app.delete("/rentals/:rentalId", async (req, res) => {
    const { rentalId } = req.params;
    try {
        const isRental = await exist({ dataSearch: rentalId, table: 'rentals', collumn: 'id' });
        if (!isRental.rows.length) return res.status(404).send();
        if (!!isRental.rows[0].returnDate) return res.status(400).send();
        await deleteRental({ rentalId });
        res.sendStatus(200);
    } catch (error) {
        res.status(500).send(error);
    }
})

app.get('/rentals', async (req, res) => {
    const { customerId, gameId } = req.query;
    try {
        let rentals = await getRentals();
        rentals = rentals.rows;
        const rentalsToSend = rentals.map(
            rental => {
                return {
                    id: rental.id,
                    customerId: rental.customerId,
                    gameId: rental.gameId,
                    rentDate: rental.rentDate,
                    daysRented: rental.daysRented,
                    returnDate: rental.returnDate,
                    originalPrice: rental.originalPrice,
                    delayFee: rental.delayFee,
                    customer: {
                        id: rental.customers_id,
                        name: rental.customers_name,
                    },
                    game: {
                        id: rental.games_id,
                        name: rental.games_name,
                        categoryId: rental.games_category_id,
                        categoryName: rental.game_gategories_name,
                    }
                }
            }
        ).filter(rental => {
            if (!!customerId && !!gameId) {
                return rental.customerId === Number(customerId) && rental.gameId === Number(gameId)
            } else if (!!customerId) {
                return rental.customerId === Number(customerId)
            } else if (!!gameId) {
                return rental.gameId === Number(gameId)
            } else return true
        })

        res.status(200).send(rentalsToSend);
    } catch (error) {
        res.status(500).send(error);
    }
})

app.listen(4000);