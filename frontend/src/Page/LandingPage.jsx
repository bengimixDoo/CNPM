import React from "react";
import { Link } from "react-router-dom";
import "../styles/LandingPage.css";

export default function LandingPage() {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className={`landing-nav ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-container">
          <div className="nav-brand">
            <span className="material-symbols-outlined nav-icon">
              apartment
            </span>
            BlueMoon
          </div>
          <div className="nav-links">
            <Link to="/login" className="btn-login-nav">
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">
            Your Future <span className="text-gradient">Home</span> Awaits.
          </h1>
          <p className="hero-subtitle">
            Experience the pinnacle of luxury living at BlueMoon Apartments.
            Smart technologies meet modern architecture for a lifestyle like no
            other.
          </p>
          <div className="hero-buttons">
            <Link to="/login" className="btn-primary">
              Resident Portal
            </Link>
            <a href="#showcase" className="btn-secondary">
              View Showcase
            </a>
          </div>
        </div>

        {/* Animated Background Elements */}
        <div className="hero-bg-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
        </div>
      </header>

      {/* Visual Showcase Section */}
      <section id="showcase" className="showcase-section">
        <div className="container">
          <div className="showcase-wrapper">
            <div className="showcase-image">
              <img
                src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=2000"
                alt="Modern Apartment Exterior"
              />
              <div className="showcase-overlay">
                <div className="glass-tag">Premium Architecture</div>
              </div>
            </div>
            <div className="showcase-info">
              <h2>Elegance in Every Detail</h2>
              <p>
                Our buildings are designed by award-winning architects to
                provide the perfect balance of aesthetics and functional living
                space.
              </p>
              <div className="showcase-stats">
                <div className="s-item">
                  <span>40+</span> Floors
                </div>
                <div className="s-item">
                  <span>Sky</span> Garden
                </div>
                <div className="s-item">
                  <span>Smart</span> Entry
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Luxury Redefined</h2>
            <p>
              We provide more than just a place to stay. We provide a lifestyle
              of excellence.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="icon-box">
                <span className="material-symbols-outlined">bolt</span>
              </div>
              <h3>Smart Home</h3>
              <p>
                Fully integrated smart control systems for lighting, climate,
                and security directly from your smartphone.
              </p>
            </div>

            <div className="feature-card">
              <div className="icon-box">
                <span className="material-symbols-outlined">verified_user</span>
              </div>
              <h3>Elite Security</h3>
              <p>
                Biometric access, 24/7 professional surveillance, and secure
                private parking for all residents.
              </p>
            </div>

            <div className="feature-card">
              <div className="icon-box">
                <span className="material-symbols-outlined">
                  fitness_center
                </span>
              </div>
              <h3>Wellness Center</h3>
              <p>
                Access to our world-class gym, infinity pool, and spa treatments
                exclusively for the BlueMoon community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div
          className="container"
          style={{
            display: "flex",
            justifyContent: "space-around",
            flexWrap: "wrap",
            gap: "3rem",
            textAlign: "center",
          }}
        >
          <div className="stat-item">
            <h3>500+</h3>
            <p>Current Residents</p>
          </div>
          <div className="stat-item">
            <h3>24/7</h3>
            <p>Active Support</p>
          </div>
          <div className="stat-item">
            <h3>100%</h3>
            <p>Modern Living</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <h3>BlueMoon</h3>
              <p>
                The standard of modern urban architecture and community-first
                living. Designed for those who seek excellence in every detail.
              </p>
              <p
                style={{
                  marginTop: "2rem",
                  fontSize: "0.8rem",
                  color: "#334155",
                }}
              >
                &copy; {new Date().getFullYear()} BlueMoon. All rights reserved.
              </p>
            </div>
            <div className="footer-social">
              <a href="#fb">Facebook</a>
              <a href="#ig">Instagram</a>
              <a href="#tw">Twitter</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
