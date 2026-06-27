import { Link } from 'react-router-dom';
import './BlogCard.css';

export default function BlogCard({ post }) {
  const { slug, title, excerpt, category, date, readTime, tags, cover_image } = post;

  const formattedDate = new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <article className="blog-card">
      {cover_image && (
        <div className="card-cover">
          <img src={cover_image} alt={title} className="card-cover-img" />
        </div>
      )}
      <div className="card-meta-top">
        <span className="card-category">{category}</span>
        <span className="card-read-time">{readTime}</span>
      </div>

      <h2 className="card-title">
        <Link to={`/blog/${slug}`}>{title}</Link>
      </h2>

      <p className="card-excerpt">{excerpt}</p>

      <div className="card-footer">
        <span className="card-date">{formattedDate}</span>
        <Link to={`/blog/${slug}`} className="card-read-more">
          Read more
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {tags && (
        <div className="card-tags">
          {tags.map(tag => (
            <span key={tag} className="card-tag">#{tag}</span>
          ))}
        </div>
      )}
    </article>
  );
}
