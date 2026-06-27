import { useState } from 'react';
import './Newsletter.css';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 800);
  };

  return (
    <section className="newsletter" id="newsletter">
      <div className="newsletter-inner">
        {status === 'success' ? (
          <div className="newsletter-success">
            <span className="success-icon">✦</span>
            <h3>You're in!</h3>
            <p>First to know when something new drops. See you on the other side.</p>
          </div>
        ) : (
          <>
            <div className="newsletter-text">
              <span className="newsletter-badge">Newsletter</span>
              <h2>Stay in the loop</h2>
              <p>New posts, new ideas, straight to your inbox. No spam — I promise. Unsubscribe anytime.</p>
            </div>
            <form className="newsletter-form" onSubmit={handleSubmit}>
              <div className="input-group">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  disabled={status === 'loading'}
                />
                <button type="submit" disabled={status === 'loading'}>
                  {status === 'loading' ? '...' : 'Subscribe'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </section>
  );
}
