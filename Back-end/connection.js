const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE
  });

  connection.connect((err) =>{
    if (!err){
      console.log("Connected")
    } else {
      console.log(err)
    }
  });

  module.exports = connection;