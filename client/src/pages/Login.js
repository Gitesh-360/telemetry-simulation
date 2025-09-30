import React, { useState } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function Login({ onLogin }) {
    const [email, setEmail] = useState('demo@example.com');
    const [password, setPassword] = useState('password123');
    const [err, setErr] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        setErr('');
        try {
            const res = await axios.post(`${API}/api/auth/login`, { email, password });
            onLogin(res.data.token);
        } catch (error) {
            setErr(error.response?.data?.message || 'Login failed');
        }
    }

    return (
        <div style={{ maxWidth: 420 }}>
            <h3>Login</h3>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email</label><br />
                    <input value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div>
                    <label>Password</label><br />
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                <div className="controls">
                    <button type="submit">Login</button>
                </div>
                {err && <div style={{ color: 'red' }}>{err}</div>}
            </form>
            <div style={{ marginTop: 12, fontSize: 13 }}>
                Demo: <b>demo@example.com / password123</b>
            </div>
        </div>
    );
}
