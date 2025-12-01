import React, { useState } from "react";
import "./styles/Login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// API
const API_URL = "https://50a34806fe70.ngrok-free.app/api/v1/auth/login/";

export default function LoginPage() {
  // 1. STATE: Quản lý dữ liệu form, lỗi và trạng thái tải
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // 2. LOGIC: Xử lý sự kiện đăng nhập và gọi API
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Gửi yêu cầu POST tới API (dữ liệu là username và password)
      const response = await axios.post(
        API_URL,
        {
          username: username,
          password: password,
        },
        {
          headers: {
            // THÊM DÒNG NÀY để bỏ qua cảnh báo của ngrok
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      // THÀNH CÔNG: Lưu token và chuyển hướng
      const { token } = response.data;
      localStorage.setItem("auth_token", token);
      console.log("Đăng nhập thành công! Token:", token);
      navigate("/admin/dashboard");
    } catch (err) {
      // THẤT BẠI: Hiển thị lỗi xác thực
      if (err.response && err.response.status === 401) {
        setError("Tên đăng nhập hoặc mật khẩu không chính xác!");
      } else {
        setError("Lỗi kết nối Server Backend. Vui lòng kiểm tra dịch vụ!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 3. UI: Giao diện Form (Tích hợp Template Bootstrap)
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-illustration">
          <div className="icon" aria-hidden>
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <rect
                x="3"
                y="3"
                width="7"
                height="7"
                rx="1"
                fill="white"
                opacity="0.12"
              />
              <rect
                x="14"
                y="3"
                width="7"
                height="7"
                rx="1"
                fill="white"
                opacity="0.12"
              />
              <rect
                x="3"
                y="14"
                width="7"
                height="7"
                rx="1"
                fill="white"
                opacity="0.12"
              />
              <rect
                x="14"
                y="14"
                width="7"
                height="7"
                rx="1"
                fill="white"
                opacity="0.12"
              />
              <path
                d="M7 3v18M17 3v18"
                stroke="rgba(255,255,255,0.9)"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <div className="login-form-wrap">
          <h3 className="login-title">Chung cư BlueMoon</h3>
          <p className="login-sub">Đăng nhập tài khoản</p>

          <form onSubmit={handleLogin}>
            {/* Hiển thị lỗi nếu có (Sử dụng state 'error') */}
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            {/* INPUT Tên đăng nhập */}
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                id="username"
                placeholder="Tên đăng nhập"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isLoading}
              />
              <label htmlFor="username">Tên đăng nhập</label>
            </div>

            {/* INPUT Mật khẩu */}
            <div className="form-floating mb-3">
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
              <label htmlFor="password">Mật khẩu</label>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <p style={{ fontSize: 12 }}>Quên mật khẩu?</p>
            </div>

            {/* Nút Đăng nhập */}
            <div className="d-grid mt-4">
              <button
                className="btn-primary"
                type="submit"
                disabled={isLoading}
              >
                {isLoading && (
                  <span
                    className="spinner-border"
                    role="status"
                    aria-hidden="true"
                  ></span>
                )}
                Đăng nhập
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="login-footer">© 2025 BlueMoon — Quản lý chung cư</div>
    </div>
  );
}
