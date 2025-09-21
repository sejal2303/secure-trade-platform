import jwt from 'jsonwebtoken';
import { CONFIG } from './config.js';


export function authRequired(req,res,next){
const hdr = req.headers.authorization || '';
const token = hdr.startsWith('Bearer ')? hdr.slice(7) : null;
if(!token) return res.status(401).json({ error: 'missing token' });
try{ req.user = jwt.verify(token, CONFIG.JWT_SECRET); next(); }
catch{ return res.status(401).json({ error: 'invalid token' }); }
}


export async function audit(pool){
return async function(req,res,next){
const oldJson = JSON.stringify(res.locals.before || null);
const send = res.json.bind(res);
res.json = async (body)=>{
try{
const actor = req.user?.email || 'anonymous';
const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
if(res.locals.audit){
const rec = res.locals.audit; // {action, entity, entity_id}
await pool.query(
'insert into audit_log(actor_email, action, entity, entity_id, before_state, after_state, ip) values($1,$2,$3,$4,$5,$6,$7)',
[actor, rec.action, rec.entity, rec.entity_id||null, oldJson? JSON.parse(oldJson):null, body||null, ip]
);
}
}catch(e){ /* swallow audit errors */ }
return send(body);
};
next();
};
}