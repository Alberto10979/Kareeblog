import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import './Admin.css';

export default function AdminLogin() {
  const { signIn, user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  if (user && isAdmin) {
    navigate('/admin');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(form.email, form.password);
    if (error) {
      toast.error('Invalid credentials — check your email and password.');
      setLoading(false);
      return;
    }
    toast.success('Welcome back!');
    navigate('/admin');
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-logo">
          Kari Mash<span>.</span>
        </div>
        <h1>Admin Panel</h1>
        <p>Sign in to manage your blog</p>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              required
            />
          </div>
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <Link to="/" className="login-back-link">← Back to blog</Link>
      </div>
    </div>
  );
}
