import { Router } from 'express';
import { pool } from '../db.js';
import { ROLES, allow } from '../rbac.js';
import { authRequired } from '../middleware.js';


const r = Router();


// List settlements
r.get('/', authRequired, async (_req,res)=>{
const { rows } = await pool.query('select * from settlements order by created_at desc');
res.json(rows);
});


// Create settlement (COMPLIANCE, ADMIN)
r.post('/', authRequired, allow(ROLES.COMPLIANCE, ROLES.ADMIN), async (req,res)=>{
const { trade_id, settlement_date, cash_amount, custodian } = req.body || {};
const { rows } = await pool.query(
`insert into settlements(trade_id, settlement_date, cash_amount, custodian) values($1,$2,$3,$4) returning *`,
[trade_id, settlement_date, cash_amount, custodian]
);
res.locals.audit = { action: 'SETTLEMENT_CREATE', entity: 'settlement', entity_id: rows[0].id };
res.json(rows[0]);
});


// Mark settled
r.put('/:id/settle', authRequired, allow(ROLES.COMPLIANCE, ROLES.ADMIN), async (req,res)=>{
const id = Number(req.params.id);
const { rows: before } = await pool.query('select * from settlements where id=$1', [id]);
if(!before.length) return res.status(404).json({ error: 'not found' });
res.locals.before = before[0];
const { rows } = await pool.query('update settlements set status=\'SETTLED\', updated_at=now() where id=$1 returning *', [id]);
res.locals.audit = { action: 'SETTLED', entity: 'settlement', entity_id: id };
res.json(rows[0]);
});


export default r;