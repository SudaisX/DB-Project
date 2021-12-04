import knex from 'knex';

const sql = knex({
    client: 'pg',
    connection: {
        host: 'localhost',
        port: 5432,
        user: 'postgres',
        password: 'root',
        database: 'ecommerce',
    },
});

export default sql;

// console.log(
//     sql
//         .select('*')
//         .from('employees')
//         .then((data) => {
//             console.log(data);
//         })
// );
