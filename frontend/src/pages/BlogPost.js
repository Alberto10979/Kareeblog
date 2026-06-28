import { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import Newsletter from '../components/Newsletter';
import CommentSection from '../components/CommentSection';
import { supabase } from '../lib/supabase';
import './BlogPost.css';

function getVisitorId() {
  let id = localStorage.getItem('kareeblog_vid');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('kareeblog_vid', id);
  }
  return id;
}

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(undefined);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [liking, setLiking] = useState(false);

  useEffect(() => {
    supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single()
      .then(({ data }) => setPost(data || null));
  }, [slug]);

  useEffect(() => {
    if (!post) return;

    // Increment view count once per browser session
    const sessionKey = `kareeblog_viewed_${post.id}`;
    if (!sessionStorage.getItem(sessionKey)) {
      sessionStorage.setItem(sessionKey, '1');
      supabase.rpc('increment_views', { p_post_id: post.id });
    }

    // Load likes count
    supabase
      .from('post_likes')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', post.id)
      .then(({ count }) => setLikes(count || 0));

    // Check if this visitor already liked
    const vid = getVisitorId();
    supabase
      .from('post_likes')
      .select('id')
      .eq('post_id', post.id)
      .eq('fingerprint', vid)
      .maybeSingle()
      .then(({ data }) => setLiked(!!data));
  }, [post]);

  const handleLike = async () => {
    if (liking) return;
    setLiking(true);
    const vid = getVisitorId();
    if (liked) {
      await supabase.from('post_likes').delete().eq('post_id', post.id).eq('fingerprint', vid);
      setLiked(false);
      setLikes(l => Math.max(0, l - 1));
    } else {
      await supabase.from('post_likes').insert({ post_id: post.id, fingerprint: vid });
      setLiked(true);
      setLikes(l => l + 1);
    }
    setLiking(false);
  };

  if (post === undefined) return null;
  if (post === null) return <Navigate to="/blog" replace />;

  const { title, content, category, date, readTime, tags, cover_image } = post;

  const formattedDate = new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <main className="blog-post-page">
      <div className="post-container">
        <Link to="/blog" className="back-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          All articles
        </Link>

        <header className="post-header">
          <div className="post-meta">
            <span className="post-category">{category}</span>
            <span className="post-dot">·</span>
            <span>{formattedDate}</span>
            <span className="post-dot">·</span>
            <span>{readTime}</span>
            {post.views > 0 && (
              <>
                <span className="post-dot">·</span>
                <span>{post.views.toLocaleString()} {post.views === 1 ? 'view' : 'views'}</span>
              </>
            )}
          </div>
          <h1 className="post-title">{title}</h1>
        </header>

        {cover_image && (
          <img src={cover_image} alt={title} className="post-cover-image" />
        )}

        <div
          className="post-body"
          dangerouslySetInnerHTML={{ __html: content }}
        />

        {tags && (
          <div className="post-tags">
            {tags.map(tag => (
              <span key={tag} className="post-tag">#{tag}</span>
            ))}
          </div>
        )}

        <div className="post-like-row">
          <button
            className={`like-btn${liked ? ' liked' : ''}`}
            onClick={handleLike}
            disabled={liking}
            aria-label={liked ? 'Unlike this post' : 'Like this post'}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill={liked ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
            <span>{likes} {likes === 1 ? 'like' : 'likes'}</span>
          </button>
        </div>

        <div className="post-divider" />

        <div className="post-author-card">
          <div className="author-avatar">K</div>
          <div className="author-info">
            <strong>Kari Mash</strong>
            <span>Writer, overthinker, enthusiast of late-night ideas.</span>
          </div>
        </div>

        <div className="post-divider" />

        <CommentSection postId={post.id} />
      </div>

      <div className="newsletter-wrapper post-newsletter">
        <Newsletter />
      </div>
    </main>
  );
}
