import { useState, useEffect } from 'react';
import BlogCard from '../components/BlogCard';
import Newsletter from '../components/Newsletter';
import { supabase } from '../lib/supabase';
import './BlogList.css';

const CATEGORIES = ['All', 'Personal', 'Ideas', 'Lifestyle'];

export default function BlogList() {
  const [posts, setPosts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    supabase
      .from('posts')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => setPosts(data || []));
  }, []);

  const filtered = activeCategory === 'All'
    ? posts
    : posts.filter(p => p.category === activeCategory);

  return (
    <main className="blog-list">
      <div className="blog-list-header">
        <h1>All Articles</h1>
        <p>{posts.length} posts and counting</p>
      </div>

      <div className="category-filter">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="no-posts">Nothing here yet — check back soon.</p>
      ) : (
        <div className="posts-grid">
          {filtered.map(post => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      )}

      <div className="newsletter-wrapper">
        <Newsletter />
      </div>
    </main>
  );
}
