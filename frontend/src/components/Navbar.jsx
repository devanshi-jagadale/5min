import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav className="nav">
      <div className="nav-logo">
        <span>5Min</span> — teach anything
      </div>
      {user && (
        <div className="nav-links">
          <span style={{ fontSize: 13, color: '#666' }}>hey, {user.name.split(' ')[0]} 👋</span>
          <button className="nav-btn" onClick={handleLogout}>Log out</button>
        </div>
      )}
    </nav>
  );
}