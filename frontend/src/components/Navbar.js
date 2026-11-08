import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">CreatorHub</Link>
        <div className="nav-links">
          <Link to="/">Viewer Portal</Link>
          {token ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <button onClick={handleLogout} className="login-btn" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'white' }}>Logout</button>
            </>
          ) : (
            <Link to="/login" className="login-btn">Creator Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;