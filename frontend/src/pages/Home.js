import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BlogCard from '../components/BlogCard';
import Newsletter from '../components/Newsletter';
import { supabase } from '../lib/supabase';
import './Home.css';

export default function Home() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    supabase
      .from('posts')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(3)
      .then(({ data }) => setFeatured(data || []));
  }, []);

  return (
    <main className="home">
      <section className="hero">
        <div className="hero-inner">
          <span className="hero-label">A personal blog</span>
          <h1 className="hero-title">
            Thoughts, ideas &<br />
            <span className="hero-accent">everything in between</span>
          </h1>
          <p className="hero-subtitle">
            I write about the things that keep me up at night — the good kind.
            Crazy ideas, real experiences, and the occasional 2am revelation.
          </p>
          <div className="hero-actions">
            <Link to="/blog" className="btn-primary">Start Reading</Link>
            <Link to="/about" className="btn-ghost">About me</Link>
          </div>
        </div>

        <div className="hero-decoration">
          <div className="blob blob-1" />
          <div className="blob blob-2" />
        </div>
      </section>

      <section className="latest-posts">
        <div className="section-header">
          <h2>Latest Posts</h2>
          <Link to="/blog" className="see-all">
            See all
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="posts-grid">
          {featured.map(post => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      <div className="newsletter-wrapper">
        <Newsletter />
      </div>
    </main>
  );
}
