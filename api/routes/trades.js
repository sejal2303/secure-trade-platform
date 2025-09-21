import { Router } from 'express';
import { pool } from '../db.js';
import { ROLES, allow } from '../rbac.js';
import { authRequired } from '../middleware.js';


const r = Router();


// List trades
r.get('/', authRequired, async (_req,res)=>{
const { rows } = await pool.query('select t.*, u.email as created_by_email from trades t left join users u on u.id=t.created_by order by trade_ts desc');
res.json(rows);
});


// Create trade (TRADER, ADMIN)
r.post('/', authRequired, allow(ROLES.TRADER, ROLES.ADMIN), async (req,res)=>{
const { symbol, side, qty, price, counterparty } = req.body || {};
const { rows } = await pool.query(
`insert into trades(symbol, side, qty, price, counterparty, created_by) values($1,$2,$3,$4,$5,$6) returning *`,
[symbol, side, qty, price, counterparty, req.user.sub]
);
res.locals.audit = { action: 'TRADE_CREATE', entity: 'trade', entity_id: rows[0].id };
res.json(rows[0]);
});


// Confirm trade
r.put('/:id/confirm', authRequired, allow(ROLES.TRADER, ROLES.ADMIN), async (req,res)=>{
const id = Number(req.params.id);
const { rows: before } = await pool.query('select * from trades where id=$1', [id]);
if(!before.length) return res.status(404).json({ error: 'not found' });
res.locals.before = before[0];
const { rows } = await pool.query('update trades set status=\'CONFIRMED\', trade_ts=trade_ts where id=$1 returning *', [id]);
res.locals.audit = { action: 'TRADE_CONFIRM', entity: 'trade', entity_id: id };
res.json(rows[0]);
});


// Cancel trade
r.put('/:id/cancel', authRequired, allow(ROLES.TRADER, ROLES.ADMIN), async (req,res)=>{
const id = Number(req.params.id);
const { rows: before } = await pool.query('select * from trades where id=$1', [id]);
if(!before.length) return res.status(404).json({ error: 'not found' });
res.locals.before = before[0];
const { rows } = await pool.query('update trades set status=\'CANCELLED\' where id=$1 returning *', [id]);
res.locals.audit = { action: 'TRADE_CANCEL', entity: 'trade', entity_id: id };
res.json(rows[0]);
});


export default r;