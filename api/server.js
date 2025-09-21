import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import client from 'prom-client';
import { CONFIG } from './config.js';
import { init, pool } from './db.js';
import authRoutes from './routes/auth.js';
import tradeRoutes from './routes/trades.js';
import settlementRoutes from './routes/settlements.js';
import auditRoutes from './routes/audit.js';
import { audit } from './middleware.js';


const app = express();
app.use(helmet());
app.use(cors({ origin: CONFIG.CORS_ORIGIN }));
app.use(express.json());


// metrics
client.collectDefaultMetrics({ prefix: 'trade_api_' });
app.get('/metrics', async (_req, res) => {
res.set('Content-Type', client.register.contentType);
res.end(await client.register.metrics());
});


app.get('/health', (_req,res)=> res.json({ status:'ok' }));


// attach audit middleware
app.use(await audit(pool));


// routes
app.use('/auth', authRoutes);
app.use('/trades', tradeRoutes);
app.use('/settlements', settlementRoutes);
app.use('/audit', auditRoutes);


init().then(()=>{
app.listen(CONFIG.PORT, ()=> console.log(`API on :${CONFIG.PORT}`));
}).catch(e=>{ console.error('DB init failed', e); process.exit(1); });