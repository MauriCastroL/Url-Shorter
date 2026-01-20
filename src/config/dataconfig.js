import pg from 'pg';
import 'dotenv/config';

const { Pool } = pg;

// Configutación del pooling
export const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    
    max: 20, 
    idleTimeoutMillis: 30000, 
    connectionTimeoutMillis: 2000, 
});

export const query = (consulta, parametros) => {
    return pool.query(consulta, parametros);
};