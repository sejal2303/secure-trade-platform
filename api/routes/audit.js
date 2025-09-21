import { Router } from 'express';
import { pool } from '../db.js';
import { ROLES, allow } from '../rbac.js';
import { authRequired } from '../middleware.js';


const r = Router();


r.get('/', authRequired, allow(ROLES.ADMIN, ROLES.COMPLIANCE), async (_req,res)=>{
const { rows } = await pool.query('select * from audit_log order by created_at desc limit 500');
res.json(rows);
});


export default r;