import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">karee<span>.</span></Link>
          <p className="footer-tagline">Thoughts, ideas & everything in between.</p>
        </div>

        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/about">About</Link>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Karee. All rights reserved.</span>
        <span className="footer-credit">Made with care & too much tea.</span>
      </div>
    </footer>
  );
}
