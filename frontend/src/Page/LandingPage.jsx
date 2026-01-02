import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
} from "@mui/material";

import DarkModeIcon from "@mui/icons-material/DarkMode";
import PoolIcon from "@mui/icons-material/Pool";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import ParkIcon from "@mui/icons-material/Park";
import "../styles/LandingPage.css";
export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* 1. NAVBAR */}
      <nav className="landing-navbar">
        <div className="brand-logo">
          <DarkModeIcon sx={{ fontSize: 32, mr: 1 }} />
          BlueMoon
        </div>
        <div className="nav-links">
          <a href="#about">Dự án</a>
          <a href="#amenities">Tiện ích</a>
          <a href="#gallery">Hình ảnh</a>
          <Button
            variant="contained"
            sx={{
              bgcolor: "white",
              color: "black",
              fontWeight: "bold",
              ml: 2,
              "&:hover": { bgcolor: "#eee" },
            }}
            onClick={() => navigate("/login")}
          >
            Đăng nhập cư dân
          </Button>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <header className="hero-section">
        <div className="hero-bg-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
        </div>
        <div className="hero-particles"></div>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <span className="tag-line">✨ ĐẲNG CẤP THƯỢNG LƯU</span>
          <h1 className="hero-title">
            Nâng tầm <span className="text-gradient">chuẩn sống</span>
          </h1>
          <p className="hero-subtitle">
            Kiến trúc xanh giữa lòng đô thị. Nơi khởi đầu cho cuộc sống thịnh
            vượng
            <br />
            và không gian sống hoàn hảo, tiện nghi đẳng cấp 5 sao quốc tế.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary btn-small">Đăng ký tham quan</button>
            <button className="btn-secondary btn-small">Tìm hiểu thêm →</button>
          </div>
          <div className="hero-stats">
            <div className="stat-pill">
              <span className="stat-number">40</span>
              <span className="stat-label">Tầng cao</span>
            </div>
            <div className="stat-pill">
              <span className="stat-number">360°</span>
              <span className="stat-label">View toàn cảnh</span>
            </div>
            <div className="stat-pill">
              <span className="stat-number">50+</span>
              <span className="stat-label">Tiện ích</span>
            </div>
          </div>
        </div>
      </header>

      {/* 3. ABOUT SECTION */}
      <section id="about" className="about-section">
        <div className="landing-container">
          <div className="section-header">
            <span className="section-badge">Về chúng tôi</span>
            <h2>
              Vị thế <span className="text-gradient">độc tôn</span>
            </h2>
            <p className="section-subtitle">
              Tọa lạc tại trung tâm Quận 1, BlueMoon sở hữu vị trí vàng kết nối
              đa chiều
            </p>
          </div>

          <div className="about-grid">
            <div className="about-image-wrapper">
              <div className="about-image">
                <img
                  src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2070&auto=format&fit=crop"
                  alt="View Căn hộ"
                />
                <div className="image-overlay">
                  <div className="play-button">▶</div>
                </div>
              </div>
            </div>

            <div className="about-content">
              <div className="about-text">
                <p>
                  Thiết kế tối ưu hóa ánh sáng tự nhiên và tầm nhìn panorama bao
                  quát toàn thành phố, mang lại trải nghiệm sống khác biệt.
                  BlueMoon không chỉ là nơi an cư mà còn là biểu tượng của phong
                  cách sống đẳng cấp.
                </p>
              </div>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">🏢</div>
                  <h4>40 tầng</h4>
                  <p>Cao vút giữa trời</p>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🌅</div>
                  <h4>360°</h4>
                  <p>View toàn cảnh</p>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">⭐</div>
                  <h4>50+</h4>
                  <p>Tiện ích đẳng cấp</p>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🌳</div>
                  <h4>2000m²</h4>
                  <p>Công viên xanh</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. AMENITIES SECTION */}
      <section id="amenities" className="amenities-section">
        <div className="landing-container">
          <div className="section-header">
            <span className="section-badge">Tiện ích</span>
            <h2>
              Tiện ích <span className="text-gradient">đặc quyền</span>
            </h2>
            <p className="section-subtitle">
              Tận hưởng hệ sinh thái tiện ích đẳng cấp 5 sao dành riêng cho cư
              dân
            </p>
          </div>

          <div className="amenities-grid">
            <div className="amenity-card">
              <div className="amenity-image-wrapper">
                <img
                  className="amenity-img"
                  src="https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=2070&auto=format&fit=crop"
                  alt="Hồ bơi"
                />
                <div className="amenity-overlay">
                  <div className="icon-box">
                    <PoolIcon sx={{ fontSize: 40 }} />
                  </div>
                </div>
              </div>
              <div className="amenity-content">
                <h3>Hồ bơi vô cực</h3>
                <p>
                  Trải nghiệm bơi lội giữa mây trời với tầm nhìn vô tận ra thành
                  phố. Không gian thư giãn hoàn hảo.
                </p>
                <a href="#" className="amenity-link">
                  Khám phá →
                </a>
              </div>
            </div>

            <div className="amenity-card">
              <div className="amenity-image-wrapper">
                <img
                  className="amenity-img"
                  src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop"
                  alt="Gym"
                />
                <div className="amenity-overlay">
                  <div className="icon-box">
                    <FitnessCenterIcon sx={{ fontSize: 40 }} />
                  </div>
                </div>
              </div>
              <div className="amenity-content">
                <h3>Gym & Yoga Studio</h3>
                <p>
                  Phòng tập tiêu chuẩn quốc tế với trang thiết bị Technogym hiện
                  đại. Huấn luyện viên chuyên nghiệp.
                </p>
                <a href="#" className="amenity-link">
                  Khám phá →
                </a>
              </div>
            </div>

            <div className="amenity-card">
              <div className="amenity-image-wrapper">
                <img
                  className="amenity-img"
                  src="https://images.unsplash.com/photo-1519331379826-f10be5486c6f?q=80&w=2070&auto=format&fit=crop"
                  alt="Công viên"
                />
                <div className="amenity-overlay">
                  <div className="icon-box">
                    <ParkIcon sx={{ fontSize: 40 }} />
                  </div>
                </div>
              </div>
              <div className="amenity-content">
                <h3>Công viên nội khu</h3>
                <p>
                  Không gian xanh mát rộng 2000m², lá phổi xanh giữa lòng dự án.
                  Khu vui chơi trẻ em an toàn.
                </p>
                <a href="#" className="amenity-link">
                  Khám phá →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. GALLERY SECTION */}
      <section id="gallery" className="gallery-section">
        <div className="landing-container">
          <div className="section-header">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                marginBottom: "3rem",
              }}
            >
              <div>
                <span className="section-badge">Hình ảnh</span>
                <h2>
                  Thư viện <span className="text-gradient">hình ảnh</span>
                </h2>
              </div>
              <a href="#" className="view-all-link">
                Xem tất cả →
              </a>
            </div>
          </div>

          <div className="gallery-grid">
            <div className="gallery-item gallery-large">
              <img
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop"
                alt="Phòng khách"
              />
              <div className="gallery-overlay">
                <span className="gallery-label">Phòng khách sang trọng</span>
              </div>
            </div>
            <div className="gallery-item">
              <img
                src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070&auto=format&fit=crop"
                alt="Phòng ngủ"
              />
              <div className="gallery-overlay">
                <span className="gallery-label">Phòng ngủ master</span>
              </div>
            </div>
            <div className="gallery-item">
              <img
                src="https://images.unsplash.com/photo-1604014237800-1c9102c219da?q=80&w=2070&auto=format&fit=crop"
                alt="Phòng tắm"
              />
              <div className="gallery-overlay">
                <span className="gallery-label">Phòng tắm cao cấp</span>
              </div>
            </div>
            <div className="gallery-item">
              <img
                src="https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?q=80&w=2070&auto=format&fit=crop"
                alt="Bếp"
              />
              <div className="gallery-overlay">
                <span className="gallery-label">Bếp hiện đại</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CTA / FOOTER FORM */}
      <section className="cta-section">
        <div className="cta-background"></div>
        <div className="landing-container">
          <div className="cta-content">
            <span className="cta-badge">✨ Ưu đãi đặc biệt</span>
            <h2 className="cta-title">
              Sở hữu căn hộ mơ ước{" "}
              <span className="text-gradient">ngay hôm nay</span>
            </h2>
            <p className="cta-subtitle">
              Để lại thông tin để nhận bảng giá chi tiết và ưu đãi đặc biệt.
              <br />
              Chúng tôi sẽ liên hệ trong vòng 24h.
            </p>

            <div className="form-box">
              <div className="input-group">
                <input
                  type="text"
                  className="custom-input"
                  placeholder="Họ và tên của bạn"
                />
                <input
                  type="tel"
                  className="custom-input"
                  placeholder="Số điện thoại"
                />
                <input
                  type="email"
                  className="custom-input"
                  placeholder="Email"
                />
              </div>
              <button className="submit-btn">
                Nhận tư vấn ngay
                <span style={{ marginLeft: "8px" }}>→</span>
              </button>
            </div>

            <div className="contact-info">
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <span>
                  Hotline: <strong>1900 6868</strong>
                </span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📧</span>
                <span>
                  Email: <strong>sales@bluemoon.com</strong>
                </span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <span>
                  Địa chỉ: <strong>Quận 1, TP.HCM</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "1rem",
              }}
            >
              <DarkModeIcon sx={{ fontSize: 32, color: "#4099ff" }} />
              <h3>BlueMoon</h3>
            </div>
            <p>Nâng tầm chuẩn sống. Kiến trúc xanh giữa lòng đô thị.</p>
          </div>
          <div className="footer-links">
            <h4>Liên kết</h4>
            <a href="#about">Về chúng tôi</a>
            <a href="#amenities">Tiện ích</a>
            <a href="#gallery">Hình ảnh</a>
          </div>
          <div className="footer-social">
            <h4>Kết nối</h4>
            <a href="#">Facebook</a>
            <a href="#">Instagram</a>
            <a href="#">YouTube</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 BlueMoon Luxury. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
