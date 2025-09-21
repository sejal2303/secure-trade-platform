import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api';


export default function Login(){
const [email, setEmail] = useState('admin@demo.io');
const [password, setPassword] = useState('admin123');
const [error, setError] = useState('');
const navigate = useNavigate();


async function submit(e){
e.preventDefault(); setError('');
try{ const res = await login(email, password); localStorage.setItem('token', res.access_token); navigate('/'); }
catch(e){ setError(e.message); }
}


return (
<form onSubmit={submit} style={{maxWidth:420, margin:'40px auto', display:'grid', gap:12}}>
<h3>Login</h3>
<input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" />
<input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" />
{error && <div style={{color:'crimson'}}>{error}</div>}
<button type="submit">Sign In</button>
<p>Demo: admin@demo.io / admin123</p>
</form>
);
}