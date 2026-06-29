export default function OutcomeModal({ onSubmit }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: 12, padding: 32, textAlign: 'center' }}>
        <h2>Did you get it?</h2>
        <p style={{ color: '#666', marginBottom: 24 }}>Rate how the session went</p>
        <div style={{ display: 'flex', gap: 16 }}>
          <button onClick={() => onSubmit('got_it')}
            style={{ background: '#22c55e', color: '#fff', padding: '10px 24px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 16 }}>
            Got it!
          </button>
          <button onClick={() => onSubmit('didnt_get_it')}
            style={{ background: '#ef4444', color: '#fff', padding: '10px 24px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 16 }}>
            Didn't get it
          </button>
        </div>
      </div>
    </div>
  );
}
