import React, { useEffect, useState } from 'react';
import { listTrades, createTrade, confirmTrade, cancelTrade } from '../api';
import TradeForm from '../components/TradeForm';


export default function Trades(){
const [items, setItems] = useState([]);
const [show, setShow] = useState(false);


async function refresh(){ setItems(await listTrades()); }
useEffect(()=>{ refresh(); },[]);


async function onCreate(data){ await createTrade(data); setShow(false); refresh(); }


return (
<div>
<div style={{display:'flex', justifyContent:'space-between', alignItems:'center', margin:'16px 0'}}>
<h3>Trades</h3>
<button onClick={()=>setShow(true)}>New Trade</button>
</div>


{show && (
<div style={{border:'1px solid #ddd', padding:12, borderRadius:8, marginBottom:16}}>
<TradeForm onSubmit={onCreate} onCancel={()=>setShow(false)} />
</div>
)}


<table width="100%" cellPadding="8" style={{borderCollapse:'collapse'}}>
<thead>
<tr style={{textAlign:'left', borderBottom:'1px solid #eee'}}>
<th>Symbol</th><th>Side</th><th>Qty</th><th>Price</th><th>Counterparty</th><th>Status</th><th>Time</th><th></th>
</tr>
</thead>
<tbody>
{items.map(t=> (
<tr key={t.id} style={{borderBottom:'1px solid #f1f1f1'}}>
<td>{t.symbol}</td>
<td>{t.side}</td>
<td>{t.qty}</td>
<td>{t.price}</td>
<td>{t.counterparty}</td>
<td>{t.status}</td>
<td>{new Date(t.trade_ts).toLocaleString()}</td>
<td style={{textAlign:'right'}}>
<button onClick={()=>confirmTrade(t.id).then(refresh)} style={{marginRight:8}}>Confirm</button>
<button onClick={()=>cancelTrade(t.id).then(refresh)}>Cancel</button>
</td>
</tr>
))}
</tbody>
</table>
</div>
);
}