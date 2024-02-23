const mysql = require('mysql2')

import dotenv from 'dotenv'

dotenv.config()

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
})

connection.getConnection(async (err, connection) => {
  if (err) {
    console.error('Error connecting to database:', err)

    return

    // } else {
  }
  console.log('Connection To database Established Successfully!')
  connection.release()
})

export default connection
