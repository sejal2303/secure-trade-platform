import pg from 'pg';
import { readFileSync } from 'fs';
import { CONFIG } from './config.js';


export const pool = new pg.Pool({ connectionString: CONFIG.DATABASE_URL });


export async function init(){
const sql = readFileSync(new URL('./models.sql', import.meta.url));
await pool.query(sql.toString());
}