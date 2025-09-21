import React, { useEffect, useState } from 'react';
import { listSettlements, createSettlement, markSettled, listTrades } from '../api';


export default function Settlements(){
const [items, setItems] = useState([]);
const [trades, setTrades] = useState([]);
const [form, setForm] = useState({ trade_id:'', settlement_date:'', cash_amount:'', custodian:'' });


async function refresh(){ setItems(await listSettlements()); setTrades(await listTrades()); }
useEffect(()=>{ refresh(); },[]);


function change(e){ const {name,value} = e.target; setForm({...form, [name]: value}); }
async function submit(e){ e.preventDefault(); await createSettlement({...form, trade_id:+form.trade_id, cash_amount:+form.cash_amount}); setForm({ trade_id:'', settlement_date:'', cash_amount:'', custodian:'' }); refresh(); }


return (
<div>
<h3>Settlements</h3>
<form onSubmit={submit} style={{display:'grid', gap:8, maxWidth:500, margin:'12px 0'}}>
<select name="trade_id" value={form.trade_id} onChange={change} required>
<option value="">Select trade</option>
{trades.map(t=> <option key={t.id} value={t.id}>{t.id} — {t.symbol} {t.side} {t.qty}@{t.price}</option>)}
</select>
<input type="date" name="settlement_date" value={form.settlement_date} onChange={change} required />
<input name="cash_amount" type="number" step="0.0001" value={form.cash_amount} onChange={change} placeholder="Cash Amount" required />
<input name="custodian" value={form.custodian} onChange={change} placeholder="Custodian" required />
<button type="submit">Create Settlement</button>
</form>


<table width="100%" cellPadding="8" style={{borderCollapse:'collapse'}}>
<thead>
<tr style={{textAlign:'left', borderBottom:'1px solid #eee'}}>
<th>Trade</th><th>Date</th><th>Status</th><th>Cash</th><th>Custodian</th><th>Created</th><th></th>
</tr>
</thead>
<tbody>
{items.map(s=> (
<tr key={s.id} style={{borderBottom:'1px solid #f1f1f1'}}>
<td>{s.trade_id}</td>
<td>{s.settlement_date}</td>
<td>{s.status}</td>
<td>{s.cash_amount}</td>
<td>{s.custodian}</td>
<td>{new Date(s.created_at).toLocaleString()}</td>
<td style={{textAlign:'right'}}>
<button onClick={()=>markSettled(s.id).then(refresh)}>Mark Settled</button>
</td>
</tr>
))}
</tbody>
</table>
</div>
);
}