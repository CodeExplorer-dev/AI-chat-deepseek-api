const mysql = require('mysql');
require('dotenv').config()

const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3360,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ai_chat',
  waitForConnections: true,
  connectionLimit: 10
})

module.exports = db