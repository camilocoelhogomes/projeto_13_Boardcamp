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

export {
    getCategories,
    postCategories,
    isCategorie
};