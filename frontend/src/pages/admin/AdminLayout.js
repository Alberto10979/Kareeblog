import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import './Admin.css';

const NAV = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/posts', label: 'All Posts' },
];

export default function AdminLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out');
    navigate('/admin/login');
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          Kari Mash<span>.</span>
        </div>
        <div className="admin-sidebar-label">Blog Admin</div>

        {NAV.map(n => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.end}
            className={({ isActive }) => `admin-nav-link${isActive ? ' active' : ''}`}
          >
            {n.label}
          </NavLink>
        ))}

        <div className="admin-sidebar-footer">
          <Link to="/" target="_blank" className="admin-nav-link">
            View Blog ↗
          </Link>
          <div className="admin-sidebar-user">{user?.email}</div>
          <button className="admin-sign-out" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
