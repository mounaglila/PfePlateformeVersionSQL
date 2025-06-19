const { connect } = require('./dbConnection.js'); // import connect function

// Fetch all data from all tables  
async function fetchData() { 
      const conn = await connect({ host:'$DB_URI', port: '$PORT' , dbName: '$DB_NAME', });  
    const [tables] = await conn.query("SHOW TABLES");  
  const data = {}; 
  for (const row of tables) { 
    const tableName = Object.values(row)[0]; 
    const [rows] = await conn.query(`SELECT * FROM \`${tableName}\``); 
    const formattedRows = rows.map(item => {  
      if ('id' in item) {  
        const { id, ...rest } = item; 
        return { ...rest, _id: id };  
      }  
      return item;  
    }); 
    data[tableName] = formattedRows;  
  }  
  return data;   
} 

// Fetch all table names 
async function getTableNames() { 
  const conn = await connect({ host:'$DB_URI', port: '$PORT', dbName: '$DB_NAME', });
  const [results] = await conn.query('SHOW TABLES'); 
  return results.map(row => Object.values(row)[0]); 
}  

// Fetch a single item by its ID from a specific table  
async function getItemById(table, id) { 
  const conn = await connect({ host:'$DB_URI', port: '$PORT' , dbName: '$DB_NAME', });
  const [rows] = await conn.query(`SELECT * FROM \`${table}\` WHERE id = ?`, [id]);  
  if (rows[0]) {  
     const { id, ...rest } = rows[0];  
     return { ...rest, _id: id }; 
  }  
  return null;  
} 

// Update a specific item by its ID 
async function updateItemById(table, id, updateFields) {  
  const conn = await connect({ host:'$DB_URI', port: '$PORT', dbName: '$DB_NAME', });
  const keys = Object.keys(updateFields); 
  const values = Object.values(updateFields); 
  const cleanKeys = [];  
  const cleanValues = []; 
  for (let i = 0; i < keys.length; i++) { 
    let key = keys[i]; 
    let value = values[i]; 
    if (key === '_id') key = 'id'; 
      cleanKeys.push(key);  
      cleanValues.push(value); 
    } 
  if (cleanKeys.length === 0) return null; 
  const setClause = cleanKeys.map(key => `\`${key}\` = ?`).join(', '); 
  const sql = `UPDATE \`${table}\` SET ${setClause} WHERE id = ?`;  
  const [result] = await conn.query(sql, [...cleanValues, id]);               
  return result;  
} 

// Delete an item by its ID  
async function deleteItemById(table, id) {  
  const conn = await connect({ host:'$DB_URI', port: '$PORT', dbName: '$DB_NAME', });
  const [result] = await conn.query(`DELETE FROM \`${table}\` WHERE id = ?`, [id]); 
  return result;   
} 

// Drop a complete table from the database 
async function deleteTableByName(tableName) { 
  const conn = await connect({ host:'$DB_URI', port: '$PORT', dbName: '$DB_NAME', });
  const [result] = await conn.query(`DROP TABLE \`${tableName}\``);
  return result;  
} 

module.exports = {
  fetchData,
  getTableNames,
  getItemById,
  updateItemById,
  deleteItemById,
  deleteTableByName
};
