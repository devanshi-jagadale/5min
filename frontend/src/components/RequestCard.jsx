export default function RequestCard({ request, currentUserId, onAccept, onJoin }) {
  const isOwn = request.askedBy._id === currentUserId;
  const isMatched = request.status === 'matched';
  const isDone = request.status === 'done';
  const initials = request.askedBy.name?.slice(0, 2).toUpperCase() || '??';
  const tagColors = ['#A8E6CF', '#FFE566', '#D4B8E0', '#FFD3B6', '#B8D4E8'];

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <p className="request-topic">{request.topic}</p>
        {isOwn && (
          <span className={`status-pill ${isMatched ? 'matched' : isDone ? 'done' : 'waiting'}`}>
            {isMatched ? '🟢 matched' : isDone ? '✅ done' : '⏳ waiting'}
          </span>
        )}
      </div>
      {request.description && <p className="request-desc">{request.description}</p>}
      <div style={{ marginBottom: 12 }}>
        {request.tags?.filter(Boolean).map((t, i) => (
          <span key={t} className="tag" style={{ background: tagColors[i % tagColors.length] }}>#{t}</span>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="request-meta">
          <div className="avatar">{initials}</div>
          <span>{request.askedBy.name}</span>
          {request.askedBy.rating > 0 && <span>⭐ {request.askedBy.rating}</span>}
        </div>
        <div>
          {!isOwn && !isMatched && !isDone && (
            <button className="btn" onClick={() => onAccept(request._id)}>Teach this →</button>
          )}
          {isOwn && isMatched && (
            <button className="btn mint" onClick={() => onJoin(request.sessionId)}>Join session →</button>
          )}
          {!isOwn && (isMatched || isDone) && (
            <span style={{ fontSize: 12, color: '#aaa' }}>Already matched</span>
          )}
        </div>
      </div>
    </div>
  );
}