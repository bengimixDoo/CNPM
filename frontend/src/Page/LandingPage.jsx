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
            <span className="text-gradient">BlueMoon</span> Apartments
          </h1>
          <p className="hero-subtitle">
            Experience the pinnacle of luxury living. A perfect blend of
            comfort, security, and modern architecture.
          </p>
          <div className="hero-buttons">
            <Link to="/login" className="btn-primary">
              Access Resident Portal
            </Link>
            <button className="btn-secondary">Explore Amenities</button>
          </div>
        </div>

        {/* Animated Background Elements */}
        <div className="hero-bg-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </header>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose BlueMoon?</h2>
            <p>Redefining standards for modern urban living.</p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="icon-box">
                <span className="material-symbols-outlined">security</span>
              </div>
              <h3>Top-Tier Security</h3>
              <p>
                24/7 surveillance and smart control access to ensure your peace
                of mind.
              </p>
            </div>

            <div className="feature-card">
              <div className="icon-box">
                <span className="material-symbols-outlined">spa</span>
              </div>
              <h3>Premium Amenities</h3>
              <p>
                Infinity pool, state-of-the-art gym, and lush green parks for
                residents.
              </p>
            </div>

            <div className="feature-card">
              <div className="icon-box">
                <span className="material-symbols-outlined">groups</span>
              </div>
              <h3>Vibrant Community</h3>
              <p>
                Regular events and spacious community halls to connect with
                neighbors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section
        className="stats-section"
        style={{
          padding: "4rem 1.5rem",
          background: "linear-gradient(to right, #1e1b4b, #312e81)",
          position: "relative",
          zIndex: 10,
          borderTop: "1px solid rgba(255,255,255,0.1)",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            justifyContent: "space-around",
            flexWrap: "wrap",
            gap: "2rem",
            textAlign: "center",
          }}
        >
          <div className="stat-item">
            <h3
              style={{
                fontSize: "3rem",
                fontWeight: "800",
                color: "#818cf8",
                marginBottom: "0.5rem",
              }}
            >
              500+
            </h3>
            <p style={{ color: "#cbd5e1" }}>Happy Residents</p>
          </div>
          <div className="stat-item">
            <h3
              style={{
                fontSize: "3rem",
                fontWeight: "800",
                color: "#818cf8",
                marginBottom: "0.5rem",
              }}
            >
              50
            </h3>
            <p style={{ color: "#cbd5e1" }}>World-Class Amenities</p>
          </div>
          <div className="stat-item">
            <h3
              style={{
                fontSize: "3rem",
                fontWeight: "800",
                color: "#818cf8",
                marginBottom: "0.5rem",
              }}
            >
              100%
            </h3>
            <p style={{ color: "#cbd5e1" }}>Secure Environment</p>
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
                &copy; {new Date().getFullYear()} BlueMoon Apartments. All
                rights reserved.
              </p>
            </div>
            <div className="footer-social">
              <a href="#">Facebook</a>
              <a href="#">Instagram</a>
              <a href="#">Twitter</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
