// Database connection utility
// You'll need to install your preferred SQL client (pg for PostgreSQL, mysql2 for MySQL, etc.)

interface DatabaseConfig {
  host: string
  port: number
  database: string
  username: string
  password: string
}

// Example configuration - replace with your actual database credentials
const dbConfig: DatabaseConfig = {
  host: process.env.DB_HOST || "localhost",
  port: Number.parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "business_management",
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "password",
}

// For PostgreSQL (install: npm install pg @types/pg)
import { Pool } from "pg"

const pool = new Pool({
  host: dbConfig.host,
  port: dbConfig.port,
  database: dbConfig.database,
  user: dbConfig.username,
  password: dbConfig.password,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

export { pool }

// For MySQL (install: npm install mysql2)
// import mysql from 'mysql2/promise';
//
// const pool = mysql.createPool({
//   host: dbConfig.host,
//   port: dbConfig.port,
//   database: dbConfig.database,
//   user: dbConfig.username,
//   password: dbConfig.password,
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// });
//
// export { pool };
