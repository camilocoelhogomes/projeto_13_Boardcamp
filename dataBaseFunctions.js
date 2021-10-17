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

export {
    postCategories,
    exist,
    postGames,
    searchFromTable,
    postCustomers,
    getAllFromTable,
    putCustomers,
    existWhenEditing,
    postRental
};