import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import Navbar from '../components/Navbar';

function Timer({ remaining }) {
  const m = String(Math.floor(remaining / 60)).padStart(2, '0');
  const s = String(remaining % 60).padStart(2, '0');
  return (
    <div className={`timer-display ${remaining <= 60 ? 'urgent' : ''}`}>{m}:{s}</div>
  );
}

function ChatBox({ messages, currentUserId, onSend }) {
  const [text, setText] = useState('');
  const bottomRef = useRef();
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = () => {
    if (!text.trim()) return;
    onSend(text.trim());
    setText('');
  };

  return (
    <div className="chat-card">
      <div className="chat-messages">
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', color: '#bbb', fontSize: 13, marginTop: 40 }}>
            Session started — say hi! 👋
          </div>
        )}
        {messages.map((m, i) => {
          const isMe = m.sender === currentUserId || m.sender?._id === currentUserId;
          return (
            <div key={i} className={`msg-row ${isMe ? 'me' : ''}`}>
              <div className={`bubble ${isMe ? 'me' : 'them'}`}>{m.text}</div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
      <div className="chat-input-row">
        <input value={text} placeholder="Type a message..."
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()} />
        <button className="btn" style={{ whiteSpace: 'nowrap' }} onClick={send}>Send →</button>
      </div>
    </div>
  );
}

function OutcomeModal({ onSubmit }) {
  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div style={{ fontSize: 40, marginBottom: 12 }}>⏰</div>
        <h2>Time's up!</h2>
        <p>Did you understand the explanation?</p>
        <div className="outcome-btns">
          <button className="btn mint" onClick={() => onSubmit('got_it')}>✅ Got it!</button>
          <button className="btn secondary" onClick={() => onSubmit('didnt_get_it')}>😕 Not quite</button>
        </div>
      </div>
    </div>
  );
}

export default function Session() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const socketRef = useSocket();
  const [session, setSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [remaining, setRemaining] = useState(300);
  const [showOutcome, setShowOutcome] = useState(false);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/sessions/${id}`,
      { headers: { Authorization: `Bearer ${token}` } })
      .then(({ data }) => { setSession(data); setMessages(data.messages || []); });
  }, [id]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !session) return;
    socket.emit('join-session', { sessionId: id, userId: user.id });
    socket.on('tick', ({ remaining }) => setRemaining(remaining));
    socket.on('timer-end', () => setShowOutcome(true));
    socket.on('receive-message', (msg) => setMessages(prev => [...prev, msg]));
    return () => { socket.off('tick'); socket.off('timer-end'); socket.off('receive-message'); };
  }, [session]);

  const sendMessage = (text) => {
    socketRef.current.emit('send-message', { sessionId: id, sender: user.id, text });
  };

  const submitOutcome = async (outcome) => {
    await axios.post(`${import.meta.env.VITE_API_URL}/api/sessions/${id}/outcome`,
      { outcome }, { headers: { Authorization: `Bearer ${token}` } });
    setShowOutcome(false);
    navigate('/feed');
  };

  if (!session) return (
    <>
      <Navbar />
      <div className="page" style={{ textAlign: 'center', paddingTop: 80 }}>
        <p style={{ color: '#aaa' }}>Loading session...</p>
      </div>
    </>
  );

  const isLearner = session.learner._id === user.id || session.learner === user.id;
  const otherName = isLearner ? session.teacher?.name : session.learner?.name;

  return (
    <>
      <Navbar />
      <div className="session-wrap">
        <div className="session-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 4 }}>
                {isLearner ? '🎓 learning from' : '📖 teaching'} {otherName}
              </p>
              <p className="session-topic">{session.requestId?.topic}</p>
            </div>
            <Timer remaining={remaining} />
          </div>
          {remaining <= 60 && (
            <p style={{ fontSize: 12, color: '#c0392b', marginTop: 8, fontWeight: 600 }}>
              ⚠️ Wrapping up soon!
            </p>
          )}
        </div>

        <ChatBox messages={messages} currentUserId={user.id} onSend={sendMessage} />

        <div style={{ textAlign: 'center' }}>
          {isLearner && (
            <button className="btn secondary" style={{ fontSize: 13 }}
              onClick={() => setShowOutcome(true)}>
              End session early
            </button>
          )}
        </div>
      </div>
      {showOutcome && isLearner && <OutcomeModal onSubmit={submitOutcome} />}
    </>
  );
}