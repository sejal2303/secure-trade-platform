import { Router } from 'express';
import { signToken, verifyUser, createUser } from '../auth.js';
import { ROLES } from '../rbac.js';


const r = Router();


// Seed admin (idempotent demo endpoint — remove in prod)
r.post('/seed-admin', async (req,res)=>{
const { email='admin@demo.io', password='admin123', role=ROLES.ADMIN } = req.body || {};
try{ const user = await createUser({ email, password, role }); return res.json(user); }
catch(e){ return res.status(409).json({ error: 'user exists' }); }
});


r.post('/login', async (req,res)=>{
const { email, password } = req.body || {};
const user = await verifyUser({ email, password });
if(!user) return res.status(401).json({ error: 'bad credentials' });
return res.json({ access_token: signToken(user), token_type: 'bearer', user });
});


export default r;