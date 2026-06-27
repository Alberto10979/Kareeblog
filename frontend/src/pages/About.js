import { Link } from 'react-router-dom';
import Newsletter from '../components/Newsletter';
import './About.css';

export default function About() {
  return (
    <main className="about-page">
      <div className="about-container">
        <div className="about-avatar-wrap">
          <div className="about-avatar">K</div>
        </div>

        <div className="about-content">
          <h1>Hey, I'm Karee.</h1>
          <p className="about-lead">
            I write about the things that live rent-free in my head — ideas I can't shake,
            experiences I'm still processing, observations that probably only matter to me
            (but maybe also to you?).
          </p>

          <p>
            Some context: I'm the kind of person who has three voice notes from last night
            and a notes app full of 2am thoughts. I believe in dark mode, purple everything,
            and the power of writing things down before they disappear.
          </p>

          <p>
            This blog started as a way to get thoughts out of my head and onto something
            more permanent than a Notes app. It's partly for me — a place to think out loud.
            But if something here lands with you, resonates, or makes you feel a little less
            alone in the weirdness of being alive — that's the whole point.
          </p>

          <p>
            I write about personal experiences, random ideas, lifestyle things, and probably
            whatever else I happen to be obsessed with that week. With time, this will grow
            into more. But for now, this is the starting point.
          </p>

          <h2>What you'll find here</h2>
          <ul className="about-list">
            <li>
              <strong>Ideas</strong> — the 2am ones, the probably-terrible ones, and occasionally the ones worth pursuing
            </li>
            <li>
              <strong>Personal</strong> — reflections, experiences, observations from the daily experience of being a person
            </li>
            <li>
              <strong>Lifestyle</strong> — rest, productivity (and the case against it), and figuring out how to actually live well
            </li>
          </ul>

          <div className="about-cta">
            <Link to="/blog" className="btn-primary">Read the blog</Link>
            <Link to="/#newsletter" className="btn-ghost">Subscribe</Link>
          </div>
        </div>
      </div>

      <div className="newsletter-wrapper">
        <Newsletter />
      </div>
    </main>
  );
}
