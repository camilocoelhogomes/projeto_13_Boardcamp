import pg from 'pg';

const { Pool } = pg;

const connection = new Pool({
    user: 'bootcamp_role',
    password: 'senha_super_hiper_ultra_secreta_do_role_do_bootcamp',
    host: 'localhost',
    port: 5432,
    database: 'boardcamp'
});

const getCategories = connection.query('SELECT * from categories;');
const postCategories = (name) => connection.query('INSERT INTO categories (name) VALUES ($1);', [name]);
const isCategorie = (name) => connection.query('SELECT * from categories WHERE name = ($1);', [name])

const getGames = connection.query('SELECT * from games;');
const postGames = ({ name, image, stockTotal, categoryId, pricePerDay }) => {
    console.log(name, image, stockTotal, categoryId, pricePerDay);
    return connection.query("INSERT INTO games (name,image,stockTotal,categoryId,pricePerDay) VALUES ($1,$2,$3,$4,$5);", [name, image, stockTotal, categoryId, pricePerDay])
}
export {
    getCategories,
    postCategories,
    isCategorie,
    getGames,
    postGames,
};