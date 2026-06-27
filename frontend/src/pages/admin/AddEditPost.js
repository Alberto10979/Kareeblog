import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import './Admin.css';

const CATEGORIES = ['Personal', 'Ideas', 'Lifestyle'];

const EMPTY = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  category: 'Personal',
  tags: '',
  read_time: '',
  published: false,
  cover_image: '',
};

function toSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export default function AddEditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = id !== 'new';

  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single()
        .then(({ data }) => {
          if (data) setForm({ ...data, tags: (data.tags || []).join(', ') });
        });
    }
  }, [id, isEdit]);

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split('.').pop();
    const path = `covers/${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from('blog-images')
      .upload(path, file, { upsert: true });
    if (error) {
      toast.error('Image upload failed: ' + error.message);
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from('blog-images').getPublicUrl(path);
    set('cover_image', data.publicUrl);
    setUploading(false);
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setForm(f => ({
      ...f,
      title,
      slug: isEdit ? f.slug : toSlug(title),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      title: form.title,
      slug: form.slug,
      excerpt: form.excerpt,
      content: form.content,
      category: form.category,
      read_time: form.read_time,
      published: form.published,
      cover_image: form.cover_image || null,
      tags: form.tags
        ? form.tags.split(',').map(t => t.trim()).filter(Boolean)
        : [],
      updated_at: new Date().toISOString(),
    };

    let error;
    if (isEdit) {
      ({ error } = await supabase.from('posts').update(payload).eq('id', id));
    } else {
      ({ error } = await supabase.from('posts').insert([payload]));
    }

    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success(isEdit ? 'Post updated!' : 'Post created!');
    navigate('/admin/posts');
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <Link to="/admin/posts" className="admin-back-link">← Posts</Link>
        <h1>{isEdit ? 'Edit Post' : 'New Post'}</h1>
        <button
          type="button"
          className="btn-admin-ghost"
          onClick={() => setPreview(p => !p)}
        >
          {preview ? 'Back to Editor' : 'Preview'}
        </button>
      </div>

      {preview ? (
        <div className="post-preview">
          {form.cover_image && (
            <img src={form.cover_image} alt="Cover" className="preview-cover" />
          )}
          <p className="preview-category">{form.category}</p>
          <h2 className="preview-title">{form.title || 'Untitled'}</h2>
          {form.excerpt && <p className="preview-excerpt">{form.excerpt}</p>}
          <div
            className="preview-body"
            dangerouslySetInnerHTML={{ __html: form.content }}
          />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="post-form">
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={handleTitleChange}
              placeholder="Your article title"
              required
            />
          </div>

          <div className="form-group">
            <label>Slug *</label>
            <input
              type="text"
              value={form.slug}
              onChange={e => set('slug', e.target.value)}
              placeholder="url-friendly-slug"
              required
            />
            <span className="form-hint">/blog/{form.slug || 'your-slug'}</span>
          </div>

          <div className="form-row two-col">
            <div className="form-group">
              <label>Category</label>
              <select value={form.category} onChange={e => set('category', e.target.value)}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Read Time</label>
              <input
                type="text"
                value={form.read_time}
                onChange={e => set('read_time', e.target.value)}
                placeholder="5 min read"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Excerpt</label>
            <textarea
              value={form.excerpt}
              onChange={e => set('excerpt', e.target.value)}
              placeholder="A short description shown on blog cards..."
              rows={3}
            />
          </div>

          <div className="form-group">
            <label>Cover Image</label>
            {form.cover_image ? (
              <div className="image-preview-wrap">
                <img src={form.cover_image} alt="Cover preview" className="image-preview" />
                <button
                  type="button"
                  className="btn-remove-image"
                  onClick={() => set('cover_image', '')}
                >
                  Remove image
                </button>
              </div>
            ) : (
              <label className={`image-upload-area${uploading ? ' uploading' : ''}`}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  hidden
                />
                {uploading ? (
                  <span className="upload-status">Uploading…</span>
                ) : (
                  <>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                    </svg>
                    <span>Click to upload a cover image</span>
                    <span className="form-hint">JPG, PNG, WebP · recommended 1200×630</span>
                  </>
                )}
              </label>
            )}
          </div>

          <div className="form-group">
            <label>
              Content
              <span className="form-hint-inline"> — HTML supported: &lt;p&gt; &lt;h3&gt; &lt;strong&gt; &lt;em&gt; &lt;ol&gt; &lt;ul&gt; &lt;li&gt;</span>
            </label>
            <textarea
              value={form.content}
              onChange={e => set('content', e.target.value)}
              placeholder="<p>Start writing your article here...</p>&#10;&#10;<p>Each paragraph in its own &lt;p&gt; tag.</p>"
              rows={20}
              className="content-editor"
            />
          </div>

          <div className="form-group">
            <label>
              Tags
              <span className="form-hint-inline"> — comma separated</span>
            </label>
            <input
              type="text"
              value={form.tags}
              onChange={e => set('tags', e.target.value)}
              placeholder="ideas, personal, lifestyle"
            />
          </div>

          <div className="form-publish-row">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={form.published}
                onChange={e => set('published', e.target.checked)}
              />
              <span className="toggle-text">
                {form.published
                  ? 'Published — visible to readers'
                  : 'Draft — only you can see this'}
              </span>
            </label>
            <button type="submit" className="btn-admin-primary" disabled={loading}>
              {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Post'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
