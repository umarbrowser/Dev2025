import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/expenses" className="nav-brand">
          Expenses Tracker
        </Link>
        <div className="nav-links">
          <Link to="/expenses" className="nav-link">
            Expenses
          </Link>
          <Link to="/stats" className="nav-link">
            Statistics
          </Link>
          <span className="nav-user">Welcome, {user.name}</span>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}


