import jwt from 'jsonwebtoken';
import { CONFIG } from './config.js';
import { pool } from './db.js';
import crypto from 'crypto';


export function signToken(user){
return jwt.sign({ sub: user.id, email: user.email, role: user.role }, CONFIG.JWT_SECRET, { expiresIn: '1h' });
}


export async function createUser({ email, password, role }){
const hash = crypto.createHash('sha256').update(password).digest('hex');
const { rows } = await pool.query(
'insert into users(email, password_hash, role) values($1,$2,$3) returning id,email,role',
[email, hash, role]
);
return rows[0];
}


export async function verifyUser({ email, password }){
const { rows } = await pool.query('select * from users where email=$1', [email]);
if(!rows.length) return null;
const user = rows[0];
const hash = crypto.createHash('sha256').update(password).digest('hex');
if(user.password_hash !== hash) return null;
return { id: user.id, email: user.email, role: user.role };
}