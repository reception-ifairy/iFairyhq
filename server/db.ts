import './env';
import mysql from 'mysql2/promise';

export type DbConfig = {
  host: string;
  user: string;
  password: string;
  database: string;
  port?: number;
};

export const getDbConfigFromEnv = (): DbConfig => ({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || '',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
});

export const pool = mysql.createPool({
  host: getDbConfigFromEnv().host,
  user: getDbConfigFromEnv().user,
  password: getDbConfigFromEnv().password,
  database: getDbConfigFromEnv().database,
  port: getDbConfigFromEnv().port,
  waitForConnections: true,
  connectionLimit: 10,
  namedPlaceholders: true,
});

export const query = async <T = any>(sql: string, params?: Record<string, any>) => {
  const [rows] = await pool.query(sql, params);
  return rows as T;
};
