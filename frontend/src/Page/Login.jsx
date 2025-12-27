import React, { useState } from "react";
import "../styles/AdminDashboard.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LockOutlineIcon from "@mui/icons-material/LockOutline";
// API
const API_URL = "https://50a34806fe70.ngrok-free.app/api/v1/auth/login/";
export default function LoginPage() {
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
      const response = await axios.post(API_URL, {
        username: username,
        password: password,
      });

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

  return (
    <>
      <div className="login-container">
        <div className="login-card-wrapper">
          <div className="column illustration-section"></div>
          <div className="column form-section">
            <div className="form-content">
              <div className="sign-in-header">
                <LockOutlineIcon className="lock-icon" />
                <h2>Đăng nhập</h2>
              </div>

              <form onSubmit={handleLogin}>
                {error && (
                  <div
                    role="alert"
                    aria-live="assertive"
                    style={{ color: "#1cb98fff", marginBottom: 12 }}
                  >
                    {error}
                  </div>
                )}

                <div className="input-group">
                  <label htmlFor="username">Tên đăng nhập *</label>
                  <input
                    type="text"
                    id="username"
                    placeholder="Nhập tên đăng nhập"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="password">Mật khẩu *</label>
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
                </div>

                <div className="options-group">
                  <div className="remember-me">
                    <input type="checkbox" id="remember" />
                    <label htmlFor="remember">Ghi nhớ đăng nhập</label>
                  </div>
                  <a href="#" className="forgot-password">
                    Quên mật khẩu?
                  </a>
                </div>
                <button
                  type="submit"
                  className="sign-in-button"
                  disabled={isLoading}
                >
                  {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                </button>
              </form>

              <div className="create-account">
                <p>
                  Not registered yet? <a href="#">Create an Account</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      ;
    </>
  );
}
