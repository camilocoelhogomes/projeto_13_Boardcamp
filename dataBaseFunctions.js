import pg from 'pg';

const { Pool } = pg;

const connection = new Pool({
    user: 'bootcamp_role',
    password: 'senha_super_hiper_ultra_secreta_do_role_do_bootcamp',
    host: 'localhost',
    port: 5432,
    database: 'boardcamp'
});

const exist = ({ dataName, table, collumn }) => connection.query(`SELECT * from "${table}" WHERE "${collumn}" = ($1);`, [dataName])
const getCategories = connection.query('SELECT * from categories;');
const postCategories = (name) => connection.query('INSERT INTO categories (name) VALUES ($1);', [name]);

const getGames = connection.query('SELECT * from games;');
const searchGames = (name) => connection.query(`SELECT * from games WHERE name LIKE ($1);`, [name]);

const postGames = ({ name, image, stockTotal, categoryId, pricePerDay }) => {
    return connection.query('INSERT INTO games (name,image,"stockTotal","categoryId","pricePerDay") VALUES ($1,$2,$3,$4,$5);', [name, image, stockTotal, categoryId, pricePerDay])
}
export {
    getCategories,
    postCategories,
    exist,
    getGames,
    postGames,
    searchGames
};