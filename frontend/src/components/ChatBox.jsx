import { useState, useRef, useEffect } from 'react';

export default function ChatBox({ messages, currentUserId, onSend }) {
  const [text, setText] = useState('');
  const bottomRef = useRef();

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = () => {
    if (!text.trim()) return;
    onSend(text.trim());
    setText('');
  };

  return (
    <div>
      <div style={{ border: '1px solid #ccc', borderRadius: 8, height: 300, overflowY: 'auto', padding: 12, marginBottom: 8 }}>
        {messages.map((m, i) => {
          const isMe = m.sender === currentUserId || m.sender?._id === currentUserId;
          return (
            <div key={i} style={{ textAlign: isMe ? 'right' : 'left', marginBottom: 8 }}>
              <span style={{ background: isMe ? '#0070f3' : '#eee', color: isMe ? '#fff' : '#000',
                padding: '6px 12px', borderRadius: 16, display: 'inline-block', fontSize: 14 }}>
                {m.text}
              </span>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input style={{ flex: 1 }} value={text} placeholder="Type a message..."
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()} />
        <button onClick={send}>Send</button>
      </div>
    </div>
  );
}

