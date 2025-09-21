const API = import.meta.env.VITE_API_URL || 'http://localhost:8080';


export async function login(email, password){
const r = await fetch(`${API}/auth/login`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({email,password}) });
if(!r.ok) throw new Error('Login failed'); return r.json();
}


export async function listTrades(){ const r = await fetch(`${API}/trades/`, auth()); if(!r.ok) throw new Error('Load trades failed'); return r.json(); }
export async function createTrade(payload){ const r = await fetch(`${API}/trades/`, {method:'POST', headers:{'Content-Type':'application/json', ...auth().headers}, body: JSON.stringify(payload)}); if(!r.ok) throw new Error('Create trade failed'); return r.json(); }
export async function confirmTrade(id){ const r = await fetch(`${API}/trades/${id}/confirm`, {method:'PUT', headers: auth().headers}); if(!r.ok) throw new Error('Confirm failed'); return r.json(); }
export async function cancelTrade(id){ const r = await fetch(`${API}/trades/${id}/cancel`, {method:'PUT', headers: auth().headers}); if(!r.ok) throw new Error('Cancel failed'); return r.json(); }


export async function listSettlements(){ const r = await fetch(`${API}/settlements/`, auth()); if(!r.ok) throw new Error('Load settlements failed'); return r.json(); }
export async function createSettlement(payload){ const r = await fetch(`${API}/settlements/`, {method:'POST', headers:{'Content-Type':'application/json', ...auth().headers}, body: JSON.stringify(payload)}); if(!r.ok) throw new Error('Create settlement failed'); return r.json(); }
export async function markSettled(id){ const r = await fetch(`${API}/settlements/${id}/settle`, {method:'PUT', headers: auth().headers}); if(!r.ok) throw new Error('Settle failed'); return r.json(); }


export async function listAudit(){ const r = await fetch(`${API}/audit/`, auth()); if(!r.ok) throw new Error('Load audit failed'); return r.json(); }


function auth(){ const t = localStorage.getItem('token'); return { headers: t? { 'Authorization': `Bearer ${t}` } : {} } }