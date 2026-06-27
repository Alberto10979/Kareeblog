import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import './Admin.css';

export default function AdminPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPosts = async () => {
    const { data } = await supabase
      .from('posts')
      .select('id, title, slug, category, published, created_at')
      .order('created_at', { ascending: false });
    setPosts(data || []);
    setLoading(false);
  };

  useEffect(() => { loadPosts(); }, []);

  const togglePublish = async (post) => {
    const { error } = await supabase
      .from('posts')
      .update({ published: !post.published })
      .eq('id', post.id);
    if (error) { toast.error('Failed to update'); return; }
    toast.success(post.published ? 'Moved to drafts' : 'Published!');
    loadPosts();
  };

  const deletePost = async (id) => {
    if (!window.confirm('Delete this post? This cannot be undone.')) return;
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) { toast.error('Failed to delete'); return; }
    toast.success('Post deleted');
    loadPosts();
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>All Posts</h1>
        <Link to="/admin/posts/new" className="btn-admin-primary">+ New Post</Link>
      </div>

      {loading ? (
        <p className="admin-state-msg">Loading...</p>
      ) : posts.length === 0 ? (
        <p className="admin-state-msg">
          No posts yet. <Link to="/admin/posts/new">Write your first one →</Link>
        </p>
      ) : (
        <div className="posts-table">
          <div className="table-header">
            <span>Title</span>
            <span>Category</span>
            <span>Status</span>
            <span>Actions</span>
          </div>
          {posts.map(post => (
            <div key={post.id} className="table-row">
              <span className="table-title">{post.title}</span>
              <span className="table-category">{post.category || '—'}</span>
              <button
                className={`post-badge clickable ${post.published ? 'badge-published' : 'badge-draft'}`}
                onClick={() => togglePublish(post)}
                title="Click to toggle publish status"
              >
                {post.published ? 'Published' : 'Draft'}
              </button>
              <div className="table-actions">
                <Link to={`/admin/posts/${post.id}`} className="btn-admin-ghost">Edit</Link>
                <button className="btn-admin-danger" onClick={() => deletePost(post.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
