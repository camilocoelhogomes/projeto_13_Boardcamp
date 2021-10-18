import pg from 'pg';

const { Pool } = pg;

const connection = new Pool({
    user: 'bootcamp_role',
    password: 'senha_super_hiper_ultra_secreta_do_role_do_bootcamp',
    host: 'localhost',
    port: 5432,
    database: 'boardcamp'
});

const exist = ({ dataSearch, table, collumn }) => connection.query(`SELECT * from "${table}" WHERE "${collumn}" = ($1);`, [dataSearch]);
const getAllFromTable = ({ table }) => connection.query(`SELECT * from ${table};`);
const searchFromTable = ({ dataSearch, table, collumn }) => connection.query(`SELECT * from "${table}" WHERE LOWER(${collumn}) LIKE LOWER($1);`, [dataSearch + '%']);
const postCategories = (name) => connection.query('INSERT INTO categories (name) VALUES ($1);', [name]);
const postGames = ({ name, image, stockTotal, categoryId, pricePerDay }) => connection.query('INSERT INTO games (name,image,"stockTotal","categoryId","pricePerDay") VALUES ($1,$2,$3,$4,$5);', [name, image, stockTotal, categoryId, pricePerDay]);
const postCustomers = ({ name, phone, cpf, birthday }) => connection.query('INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1,$2,$3,$4);', [name, phone, cpf, birthday]);
const putCustomers = ({ name, phone, cpf, birthday, customerId }) => connection.query('UPDATE customers SET name=($2), phone=($3), cpf=($4), birthday=($5) WHERE id=($1);', [customerId, name, phone, cpf, birthday]);
const existWhenEditing = ({ dataSearch, table, collumn, customerId }) => connection.query(`SELECT * from "${table}" WHERE ("${collumn}" = ($1) AND id <> ($2));`, [dataSearch, customerId]);
const postRental = ({ customerId, gameId, rentDate, daysRented, returnDate, originalPrice, delayFee }) => connection.query('INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented","returnDate","originalPrice","delayFee" ) VALUES ($1,$2,$3,$4,$5,$6,$7);', [customerId, gameId, rentDate, daysRented, returnDate, originalPrice, delayFee]);
const returnRental = ({ returnDate, delayFee, rentalId }) => connection.query('UPDATE rentals SET "returnDate"=($2), "delayFee"=($3) WHERE id=($1);', [rentalId, returnDate, delayFee]);
const deleteRental = ({ rentalId }) => connection.query('DELETE from rentals WHERE id = ($1)', [rentalId]);
const getRentals = () => connection.query(`
    SELECT 
        rentals.*,
        customers.id AS customers_id,
        customers.name AS customers_name,
        games.id AS games_id,
        games.name AS games_name,
        games."categoryId" AS games_category_id,
        categories.name AS game_gategories_name
    FROM 
        rentals
    JOIN 
        customers 
    ON
        rentals."customerId" = customers.id
    JOIN
        games
    ON
        rentals."gameId" = games.id
    JOIN
        categories
    ON
        categories.id = games."categoryId";
`)
export {
    postCategories,
    exist,
    postGames,
    searchFromTable,
    postCustomers,
    getAllFromTable,
    putCustomers,
    existWhenEditing,
    postRental,
    returnRental,
    deleteRental,
    getRentals
};