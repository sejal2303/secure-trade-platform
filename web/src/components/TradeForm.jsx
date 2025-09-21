import React, { useState } from 'react';


export default function TradeForm({ onSubmit, onCancel }){
const [form, setForm] = useState({ symbol:'AAPL', side:'BUY', qty:100, price:200.25, counterparty:'Counterparty LLC' });
function change(e){ const {name, value} = e.target; setForm({...form, [name]: value}); }
function submit(e){ e.preventDefault(); onSubmit({...form, qty:+form.qty, price:+form.price}); }
return (
<form onSubmit={submit} style={{display:'grid', gap:8}}>
<input name="symbol" value={form.symbol} onChange={change} placeholder="Symbol" required />
<select name="side" value={form.side} onChange={change}><option>BUY</option><option>SELL</option></select>
<input name="qty" type="number" step="1" value={form.qty} onChange={change} placeholder="Quantity" required />
<input name="price" type="number" step="0.0001" value={form.price} onChange={change} placeholder="Price" required />
<input name="counterparty" value={form.counterparty} onChange={change} placeholder="Counterparty" required />
<div style={{display:'flex', gap:8}}>
<button type="submit">Save Trade</button>
<button type="button" onClick={onCancel}>Cancel</button>
</div>
</form>
);
}