import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import './Admin.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total: 0, published: 0, drafts: 0, views: 0, comments: 0 });
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [{ data }, { count: commentCount }] = await Promise.all([
        supabase
          .from('posts')
          .select('id, title, published, created_at, views')
          .order('created_at', { ascending: false }),
        supabase
          .from('comments')
          .select('*', { count: 'exact', head: true }),
      ]);

      if (data) {
        setStats({
          total: data.length,
          published: data.filter(p => p.published).length,
          drafts: data.filter(p => !p.published).length,
          views: data.reduce((sum, p) => sum + (p.views || 0), 0),
          comments: commentCount || 0,
        });
        setRecentPosts(data.slice(0, 5));
      }
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Dashboard</h1>
        <Link to="/admin/posts/new" className="btn-admin-primary">+ New Post</Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Posts</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.published}</div>
          <div className="stat-label">Published</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.drafts}</div>
          <div className="stat-label">Drafts</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.views.toLocaleString()}</div>
          <div className="stat-label">Total Views</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.comments}</div>
          <div className="stat-label">Comments</div>
        </div>
      </div>

      <div className="admin-section">
        <h2>Recent Posts</h2>
        {loading ? (
          <p className="admin-state-msg">Loading...</p>
        ) : recentPosts.length === 0 ? (
          <p className="admin-state-msg">
            No posts yet.{' '}
            <Link to="/admin/posts/new">Write your first one →</Link>
          </p>
        ) : (
          <div className="recent-posts-list">
            {recentPosts.map(post => (
              <div key={post.id} className="recent-post-item">
                <div className="recent-post-left">
                  <span className="recent-post-title">{post.title}</span>
                  <span className={`post-badge ${post.published ? 'badge-published' : 'badge-draft'}`}>
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <Link to={`/admin/posts/${post.id}`} className="btn-admin-ghost">Edit</Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
