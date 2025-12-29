import React, { useState } from "react";
import "../styles/AdminDashboard.css";
import { useNavigate } from "react-router-dom";
import LockOutlineIcon from "@mui/icons-material/LockOutline";
import { authService } from "../api/services";

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
      // 1. Gửi yêu cầu POST tới API để lấy token
      await authService.login(username, password);

      // 2. Lấy thông tin user hiện tại để biết Role
      const user = await authService.getMe();

      // THÀNH CÔNG: Chuyển hướng theo role dựa trên Route trong App.jsx
      console.log("Đăng nhập thành công! Role:", user.role);

      if (user.role === "CU_DAN") {
        navigate("/resident/home");
      } else {
        // ADMIN, QUAN_LY, KE_TOAN đều vào dashboard admin
        navigate("/dashboard");
      }
    } catch (err) {
      // THẤT BẠI: Hiển thị lỗi xác thực
      if (err.response && err.response.status === 401) {
        setError("Tên đăng nhập hoặc mật khẩu không chính xác!");
      } else {
        setError("Lỗi kết nối Server Backend. Vui lòng kiểm tra dịch vụ!");
        console.error("Login Error:", err);
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
