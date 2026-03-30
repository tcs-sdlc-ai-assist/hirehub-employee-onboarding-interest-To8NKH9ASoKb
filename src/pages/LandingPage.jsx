import { Link } from 'react-router-dom';
import './LandingPage.css';

export default function LandingPage() {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="landing-hero">
        <div className="landing-hero-container">
          <h1 className="landing-hero-title">Welcome to HireHub</h1>
          <p className="landing-hero-subtitle">
            Join a company that values innovation, collaboration, and personal growth.
            Discover opportunities that align with your passion and help shape the future
            of our organization.
          </p>
          <div className="landing-hero-actions">
            <Link to="/apply" className="landing-hero-btn landing-hero-btn-primary">
              Express Your Interest
            </Link>
            <Link to="/admin" className="landing-hero-btn landing-hero-btn-secondary">
              Admin Portal
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="landing-features">
        <div className="landing-features-header">
          <h2 className="landing-features-title">Why Join Us?</h2>
          <p className="landing-features-subtitle">
            We offer a workplace where talent thrives, ideas flourish, and every team
            member makes a meaningful impact.
          </p>
        </div>

        <div className="landing-features-grid">
          <div className="landing-feature-card">
            <div className="landing-feature-icon">💡</div>
            <h3 className="landing-feature-card-title">Innovation</h3>
            <p className="landing-feature-card-desc">
              Work on cutting-edge projects that push boundaries and challenge the status
              quo. We encourage creative thinking and bold ideas at every level.
            </p>
          </div>

          <div className="landing-feature-card">
            <div className="landing-feature-icon">📈</div>
            <h3 className="landing-feature-card-title">Career Growth</h3>
            <p className="landing-feature-card-desc">
              Accelerate your career with mentorship programs, learning opportunities,
              and clear pathways for advancement within the organization.
            </p>
          </div>

          <div className="landing-feature-card">
            <div className="landing-feature-icon">🤝</div>
            <h3 className="landing-feature-card-title">Great Culture</h3>
            <p className="landing-feature-card-desc">
              Be part of a diverse, inclusive team that celebrates collaboration and
              supports each other. Our culture is built on trust, respect, and shared success.
            </p>
          </div>

          <div className="landing-feature-card">
            <div className="landing-feature-icon">🌍</div>
            <h3 className="landing-feature-card-title">Global Impact</h3>
            <p className="landing-feature-card-desc">
              Contribute to projects that make a difference across the globe. Your work
              here will reach communities and industries worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="landing-cta">
        <div className="landing-cta-container">
          <h2 className="landing-cta-title">Ready to Start Your Journey?</h2>
          <p className="landing-cta-desc">
            Take the first step toward an exciting career. Submit your interest and our
            team will be in touch with you soon.
          </p>
          <Link to="/apply" className="landing-cta-btn">
            Apply Now
          </Link>
        </div>
      </section>
    </div>
  );
}