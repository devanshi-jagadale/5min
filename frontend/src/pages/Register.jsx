import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', skills: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        ...form, skills: form.skills.split(',').map(s => s.trim()).filter(Boolean)
      });
      login(data.user, data.token);
      navigate('/feed');
    } catch (err) {
      setError(err.response?.data?.message || 'Register failed');
    }
  };

  return (
    <div className="auth-wrap">
      <div style={{ position: 'fixed', top: -20, right: -10, fontFamily: 'Syne, sans-serif',
        fontWeight: 800, fontSize: 'clamp(80px,18vw,180px)', color: 'rgba(0,0,0,0.04)',
        lineHeight: 1, userSelect: 'none', pointerEvents: 'none', zIndex: 0 }}>
        teach.
      </div>
      <div className="auth-card" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>✨</div>
        <h1>Join 5Min</h1>
        <p className="tagline">Teach anything. Learn everything. In 5 minutes.</p>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleSubmit}>
          <label>Name</label>
          <input placeholder="Your name" value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })} required />
          <label>Email</label>
          <input type="email" placeholder="you@example.com" value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })} required />
          <label>Password</label>
          <input type="password" placeholder="••••••••" value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })} required />
          <label>What can you teach? <span style={{ color: '#aaa', fontWeight: 400 }}>(optional)</span></label>
          <input placeholder="e.g. react, os, dsa, calculus" value={form.skills}
            onChange={e => setForm({ ...form, skills: e.target.value })} />
          <button type="submit" className="btn full" style={{ marginTop: 8 }}>Create account →</button>
        </form>
        <p className="auth-switch">Already have an account? <Link to="/login">Log in</Link></p>
      </div>
    </div>
  );
}