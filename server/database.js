const mysql = require('mysql2/promise');

const dbConfig = {
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'soft_engr_inventory_management'
};

const pool = mysql.createPool(dbConfig);
module.exports.pool = pool;