import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Endpoint Backend Python của Django (Cần được nhóm Backend tạo)
const API_URL = "https://50a34806fe70.ngrok-free.app/api/v1/auth/login/";

const LoginPage = () => {
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
      const response = await axios.post(API_URL, {
        username: username,
        password: password,
      },
        {
          headers: {
            // THÊM DÒNG NÀY để bỏ qua cảnh báo của ngrok
            'ngrok-skip-browser-warning': 'true'
          }
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

  // 3. UI: Giao diện Form (Tích hợp Template Bootstrap)
  return (
    <div
      className="login-container d-flex justify-content-center align-items-center vh-100"
      style={{ backgroundColor: "#f8f9fa" }}
    >
      <div className="row justify-content-center w-100">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-lg border-0 rounded-3">
            <div className="card-body p-4 p-sm-5">
              <div className="row">

                {/* CỘT 1: ICON */}
                <div className="col-md-5 d-none d-md-flex align-items-center justify-content-center">
                  <i
                    className="bi bi-buildings-fill text-primary"
                    style={{ fontSize: "8rem" }}
                  ></i>
                </div>

                {/* CỘT 2: FORM */}
                <div className="col-md-7">
                  <h3 className="card-title text-center mb-4 fw-light">
                    Chung cư BlueMoon
                  </h3>
                  <p className="text-center text-muted mb-4">
                    Đăng nhập tài khoản
                  </p>

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
                        className="btn btn-primary btn-lg fw-bold"
                        type="submit"
                        disabled={isLoading}
                      >
                        {/* Hiển thị spinner khi đang tải */}
                        {isLoading && (
                          <span
                            className="spinner-border spinner-border-sm me-2"
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
