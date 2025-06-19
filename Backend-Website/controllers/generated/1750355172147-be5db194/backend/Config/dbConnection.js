const mysql = require('mysql2/promise');
// Use environment variables
const USER = 'root';
const PASS = 'root1234';
const HOST = 'localhost';
const DB_NAME = 'ecommerce_db';
const PORT = 3306;

let connection;

async function connect() {
  try {
    if (connection && connection.connection && connection.connection.state !== 'disconnected') {
      return connection;
    }

    console.log();

    connection = await mysql.createConnection({
      host: HOST,
      port: PORT,
      user: USER,
      password: PASS,
      database: DB_NAME
    });

    console.log('→ MySQL connection established');
    return connection;
  } catch (err) {
    console.error('Connection failed:', err);
  }
}

module.exports = { connect };

