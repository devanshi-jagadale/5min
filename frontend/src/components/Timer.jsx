export default function Timer({ remaining }) {
  const m = String(Math.floor(remaining / 60)).padStart(2, '0');
  const s = String(remaining % 60).padStart(2, '0');
  const urgent = remaining <= 60;
  return (
    <div style={{ fontSize: 28, fontWeight: 700, color: urgent ? 'crimson' : 'inherit', marginBottom: 16 }}>
      {m}:{s}
    </div>
  );
}

