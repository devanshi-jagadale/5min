import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import RequestCard from '../components/RequestCard';
import Navbar from '../components/Navbar';

export default function Feed() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState({ topic: '', description: '', tags: '' });
  const [posting, setPosting] = useState(false);

  const fetchRequests = async () => {
    if (!token) { navigate('/login'); return; }
    const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/requests`,
      { headers: { Authorization: `Bearer ${token}` } });
    setRequests(data);
  };

  useEffect(() => { fetchRequests(); }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    setPosting(true);
    await axios.post(`${import.meta.env.VITE_API_URL}/api/requests`,
      { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) },
      { headers: { Authorization: `Bearer ${token}` } });
    setForm({ topic: '', description: '', tags: '' });
    setPosting(false);
    fetchRequests();
  };

  const handleAccept = async (requestId) => {
    const { data } = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/requests/${requestId}/accept`, {},
      { headers: { Authorization: `Bearer ${token}` } });
    navigate(`/session/${data.sessionId}`);
  };

  const handleJoin = (sessionId) => navigate(`/session/${sessionId}`);

  const openRequests = requests.filter(r => r.status === 'open' && r.askedBy._id !== user.id);
  const myRequests = requests.filter(r => r.askedBy._id === user.id && r.status !== 'done');

  return (
    <>
      <Navbar />
      <div className="page">
        <div style={{ marginBottom: 32, position: 'relative' }}>
          <div style={{ position: 'absolute', top: -16, right: 0, fontFamily: 'Syne, sans-serif',
            fontWeight: 800, fontSize: 'clamp(60px,12vw,100px)', color: 'rgba(0,0,0,0.05)',
            lineHeight: 1, userSelect: 'none', pointerEvents: 'none' }}>5:00</div>
          <h1 className="display-heading">got a <span className="accent">question?</span></h1>
          <p className="subheading">someone will explain it in 5 minutes ⚡</p>
        </div>

        <div className="form-card">
          <h3>📬 ask something</h3>
          <form onSubmit={handlePost}>
            <input placeholder="What do you want to understand? (e.g. What is a mutex?)"
              value={form.topic} onChange={e => setForm({ ...form, topic: e.target.value })} required />
            <textarea placeholder="More context — what have you tried, where are you stuck? (optional)"
              value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            <input placeholder="Tags — os, react, dsa, math... (comma separated)"
              value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} />
            <button type="submit" className="btn" disabled={posting}>
              {posting ? 'Posting...' : 'Post request →'}
            </button>
          </form>
        </div>

        {myRequests.length > 0 && (
          <>
            <p className="section-label">your requests</p>
            {myRequests.map(r => (
              <RequestCard key={r._id} request={r} currentUserId={user.id}
                onAccept={handleAccept} onJoin={handleJoin} />
            ))}
          </>
        )}

        <p className="section-label" style={{ marginTop: myRequests.length ? 24 : 0 }}>
          open requests — help someone out
        </p>
        {openRequests.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">🌱</div>
            <p>No open requests right now.<br />Be the first to ask something!</p>
          </div>
        ) : (
          openRequests.map(r => (
            <RequestCard key={r._id} request={r} currentUserId={user.id}
              onAccept={handleAccept} onJoin={handleJoin} />
          ))
        )}
      </div>
    </>
  );
}