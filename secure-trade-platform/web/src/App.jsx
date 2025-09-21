import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Trades from './pages/Trades';
import Settlements from './pages/Settlements';


export default function App(){
const navigate = useNavigate();
const token = localStorage.getItem('token');
return (
<div style={{fontFamily:'system-ui', maxWidth:1100, margin:'0 auto', padding:24}}>
<header style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
<h2>Secure Trade Settlement</h2>
<nav style={{display:'flex', gap:12}}>
<Link to="/">Trades</Link>
<Link to="/settlements">Settlements</Link>
{token ? (
<button onClick={()=>{localStorage.removeItem('token'); navigate('/login')}}>Logout</button>
) : (<Link to="/login">Login</Link>)}
</nav>
</header>
<Routes>
<Route path="/" element={<Trades/>} />
<Route path="/settlements" element={<Settlements/>} />
<Route path="/login" element={<Login/>} />
</Routes>
</div>
);
}