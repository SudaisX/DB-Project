const express = require('express');
const cors = require('cors');

const knex = require('knex');

const sql = knex({
    client: 'pg',
    connection: {
        host: 'localhost',
        port: 5432,
        user: 'postgres',
        password: 'root',
        database: 'Employees',
    },
});

console.log(
    sql
        .select('*')
        .from('employees')
        .then((data) => {
            console.log(data);
        })
);

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('hello');
});

app.listen(3000, () => {
    console.log('app is running on port 3000');
});
