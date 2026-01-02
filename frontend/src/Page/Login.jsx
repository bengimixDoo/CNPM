import React, { useState } from "react";
import "../styles/AdminDashboard.css";
import { useNavigate } from "react-router-dom";
import LockOutlineIcon from "@mui/icons-material/LockOutline";
import { authService } from "../api/services"; // Dùng lại service của nhóm bạn

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // 1. Dùng service cũ để gọi API (An toàn nhất)
      const res = await authService.login(username, password);
      
      // 2. LOGIC QUAN TRỌNG: Kiểm tra và Lưu Token đúng cách
      // Backend Django thường trả về { access: "...", refresh: "..." }
      // Hoặc đôi khi trả về { token: "..." }
      const accessToken = res.access || res.token || res.data?.access || res.data?.token;

      if (accessToken) {
        localStorage.setItem("auth_token", accessToken); // Lưu token để các trang khác dùng
      } else {
        // Nếu service không trả về token trực tiếp, có thể nó đã lưu ngầm?
        // Nhưng ta cứ check localStorage xem có chưa
        const storedToken = localStorage.getItem("auth_token");
        if (!storedToken) {
           console.warn("Cảnh báo: Không tìm thấy Token sau khi đăng nhập!");
        }
      }

      // 3. Lấy thông tin User
      const user = await authService.getMe();
      
      // Lưu thông tin
      localStorage.setItem("user_info", JSON.stringify(user));
      localStorage.setItem("currentUser", JSON.stringify(user)); // Lưu thêm cái này cho chắc

      console.log("Đăng nhập thành công! Role:", user.role);

      // 4. Chuyển hướng
      if (user.role === "CU_DAN") {
        navigate("/resident/home");
      } else {
        navigate("/dashboard");
      }

    } catch (err) {
      console.error("Lỗi đăng nhập:", err);
      // Xử lý lỗi hiển thị
      if (err.response && err.response.status === 401) {
        setError("Tên đăng nhập hoặc mật khẩu không chính xác!");
      } else {
        setError("Lỗi kết nối hoặc lỗi Server Backend.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
                <div role="alert" style={{ color: "#f43f5e", marginBottom: 12, fontWeight: 600 }}>
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
                <a href="#" className="forgot-password">Quên mật khẩu?</a>
              </div>
              <button type="submit" className="sign-in-button" disabled={isLoading}>
                {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>
            </form>

            <div className="create-account">
              <p>Not registered yet? <a href="#">Create an Account</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}