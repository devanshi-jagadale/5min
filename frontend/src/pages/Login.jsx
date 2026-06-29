import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, form);
      login(data.user, data.token);
      navigate('/feed');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-wrap">
      <div style={{ position: 'fixed', bottom: -20, left: -10, fontFamily: 'Syne, sans-serif',
        fontWeight: 800, fontSize: 'clamp(80px,18vw,180px)', color: 'rgba(0,0,0,0.04)',
        lineHeight: 1, userSelect: 'none', pointerEvents: 'none', zIndex: 0 }}>
        learn.
      </div>
      <div className="auth-card" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>👋</div>
        <h1>Welcome back</h1>
        <p className="tagline">Pick up where you left off</p>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input type="email" placeholder="you@example.com" value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })} required />
          <label>Password</label>
          <input type="password" placeholder="••••••••" value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })} required />
          <button type="submit" className="btn full" style={{ marginTop: 8 }}>Log in →</button>
        </form>
        <p className="auth-switch">No account? <Link to="/register">Sign up free</Link></p>
      </div>
    </div>
  );
}