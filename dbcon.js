const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'mynode',
    password: 'mynode',
    database: 'todolist'
});

module.exports = pool;