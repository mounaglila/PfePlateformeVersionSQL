const { MongoClient } = require("mongodb");
const mysql = require('mysql2/promise');

// Function to test MongoDB connection
const testMongoConnection = async (uri, dbName) => {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    await client.db(dbName).command({ ping: 1 });
    await client.close();
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error(`MongoDB connection failed: ${error.message}`);
  }
};

// Function to get collection names from a MongoDB database
const getCollectionNames = async (host, dbName, username, password) => {
  try {
    const auth = username && password ? `${username}:${password}@` : '';
    const uri = `mongodb+srv://${auth}${host}/${dbName}?retryWrites=true&w=majority`;
    const client = new MongoClient(uri);
    await client.connect();
    const collections = await client.db(dbName).listCollections().toArray();
    await client.close();
    return collections.map(collection => collection.name);
  } catch (error) {
    console.error('Error getting MongoDB collections:', error);
    throw new Error(`Failed to get MongoDB collections: ${error.message}`);
  }
};

// MySQL connection functions
const testMySQLConnection = async (host, port, dbName, username, password) => {
  try {
    const connection = await mysql.createConnection({
      host: host,
      port: port || 3306,
      user: username,
      password: password,
      database: dbName
    });
    await connection.connect();
    await connection.end();
    return true;
  } catch (error) {
    console.error('MySQL connection error:', error);
    throw new Error(`MySQL connection failed: ${error.message}`);
  }
};

const getMySQLTableNames = async (host, port, dbName, username, password) => {
  try {
    const connection = await mysql.createConnection({
      host: host,
      port: port || 3306,
      user: username,
      password: password,
      database: dbName
    });
    
    const [rows] = await connection.query('SHOW TABLES');
    await connection.end();
    
    return rows.map(row => Object.values(row)[0]);
  } catch (error) {
    console.error('Error getting MySQL tables:', error);
    throw new Error(`Failed to get MySQL tables: ${error.message}`);
  }
};

module.exports = { 
  testMongoConnection, 
  getCollectionNames,
  testMySQLConnection,
  getMySQLTableNames
};
