import StatCard from "../components/StatCard.jsx";
import "../styles/AdminDashboard.css";
import "../styles/MainDashboard.css";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import CampaignIcon from "@mui/icons-material/Campaign";
import BuildIcon from "@mui/icons-material/Build";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useState, useEffect } from "react";
import { residentsService, utilitiesService } from "../api/services";
import { Select, MenuItem } from "@mui/material"; 
import axios from "axios";
const API_BASE = "http://localhost:8000/api";
export default function Main() {
  const [stats, setStats] = useState({
    apartments: 0,
    residents: 0,
    vehicles: 0,
    totalFees: 0,
  });
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Vì backend chưa có endpoint dashboard tổng hợp, ta gọi đồng thời các API cơ bản
      const [apts, reds, vehicles, reqs] = await Promise.all([
        residentsService.getApartments(),
        residentsService.getResidents(),
        utilitiesService.getVehicles(),
        utilitiesService.getSupportTickets()
      ]);

      setStats({
        apartments: apts.length,
        residents: reds.length,
        vehicles: vehicles.length,
        totalFees: 0 // Mock for now
      });

      setRequests(reqs.slice(0, 5)); // Chỉ lấy 5 dòng mới nhất
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu dashboard:", error);
    } finally {
      setLoading(false);
    }
  };
  // --- THÊM HÀM NÀY ĐỂ XỬ LÝ ĐỔI TRẠNG THÁI ---
  const handleUpdateStatus = async (ticketId, newStatus) => {
    try {
      const token = localStorage.getItem("auth_token");
      await axios.patch(
        `${API_BASE}/v1/support-tickets/${ticketId}/`,
        { trang_thai: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Load lại dữ liệu sau khi sửa xong
      fetchDashboardData();
      alert("Cập nhật trạng thái thành công!");
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      alert("Không thể cập nhật trạng thái.");
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="dashboard-wrapper">
      {/* Stats Row (unchanged as requested) */}
      <div className="stats-row">
        <StatCard
          title="Tổng số căn hộ"
          value={stats.apartments}
          colorBackground="var(--background-blue)"
          typeCard={"Home"}
        />
        <StatCard
          title="Cư dân"
          value={stats.residents}
          colorBackground="var(--background-green)"
          typeCard={"Resident"}
        />
        <StatCard
          title="Phương tiện"
          value={stats.vehicles}
          colorBackground="var(--background-yellow)"
          typeCard={"Vehicle"}
        />
        <StatCard
          title="Thông báo mới"
          value="12"
          colorBackground="var(--background-red)"
          typeCard={"Fee"}
        />
      </div>

      <div className="main-content-grid">
        {/* Left Column: Chart & Table */}
        <div className="left-column">
          {/* Chart Section */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">Thống kê thu phí</h3>
              <select className="select-input">
                <option>Theo tháng</option>
                <option>Theo quý</option>
                <option>Theo năm</option>
              </select>
            </div>

            <div className="chart-body">
              {[
                {
                  label: "T1",
                  val: 1.2,
                  total: 3,
                  percent: 60,
                  heightColor: 180,
                },
                {
                  label: "T2",
                  val: 1.5,
                  total: 3.5,
                  percent: 75,
                  heightColor: 200,
                },
                {
                  label: "T3",
                  val: 0.9,
                  total: 2.5,
                  percent: 45,
                  heightColor: 160,
                },
                {
                  label: "T4",
                  val: 1.6,
                  total: 3.6,
                  percent: 80,
                  heightColor: 220,
                },
                {
                  label: "T5",
                  val: 1.8,
                  total: 3.8,
                  percent: 90,
                  heightColor: 210,
                },
                {
                  label: "T6",
                  val: 1.1,
                  total: 2.8,
                  percent: 55,
                  heightColor: 190,
                },
              ].map((item, index) => (
                <div className="chart-bar-group" key={index}>
                  <div
                    className="bar-container"
                    style={{ height: `${item.heightColor}px` }}
                  >
                    {" "}
                    {/* Height simulator */}
                    <div
                      className="bar-fill"
                      style={{ height: `${item.percent}%` }}
                    ></div>
                    <div className="bar-tooltip">{item.val} Tỷ</div>
                  </div>
                  <span className="bar-label">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Table Section */}
          <div className="dashboard-card">
            <div className="card-header">
              <div>
                <h3 className="card-title">Yêu cầu từ cư dân</h3>
              </div>
              <select className="select-input">
                <option value="">Tất cả</option>
                <option value="W">Chờ xử lý</option>
                <option value="P">Đang xử lý</option>
              </select>
            </div>
            <div className="table-wrapper">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Người gửi</th>
                    <th>Tiêu đề</th>
                    <th>Trạng thái</th>
                    <th style={{ textAlign: "right" }}>Ngày gửi</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.length > 0 ? (
                    requests.map((item, index) => {
                      const statusMap = {
                        'W': { label: 'Chờ Xử Lý', class: 'badge-temp-res', dot: 'dot-orange' },
                        'P': { label: 'Đang Xử Lý', class: 'badge-temp-res', dot: 'dot-blue' },
                        'A': { label: 'Đã Xử Lý', class: 'badge-perm', dot: 'dot-green' },
                        'C': { label: 'Đã Hủy', class: 'badge-temp-abs', dot: 'dot-red' },
                      };
                      const status = statusMap[item.trang_thai] || { label: item.trang_thai, class: '', dot: '' };
                      
                      return (
                        <tr key={index}>
                          <td>
                            <div className="user-info">
                              <div className="avatar-circle bg-blue-light">
                                {item.ten_cu_dan ? item.ten_cu_dan.charAt(0) : "C"}
                              </div>
                              <div style={{display: 'flex', flexDirection: 'column'}}>
                                <span className="font-medium">{item.ten_cu_dan || "Cư dân"}</span>
                                <span style={{fontSize: '11px', color: '#666'}}>{item.ma_can_ho || ""}</span>
                              </div>
                            </div>
                          </td>
                          <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {item.tieu_de}
                          </td>
                          {/* --- TÌM CỘT TRẠNG THÁI CŨ VÀ THAY BẰNG ĐOẠN NÀY --- */}
                          <td>
                            <Select
                              size="small"
                              value={item.trang_thai}
                              onChange={(e) => handleUpdateStatus(item.ma_yeu_cau, e.target.value)}
                              sx={{
                                height: 30,
                                fontSize: "12px",
                                fontWeight: 600,
                                borderRadius: "8px",
                                bgcolor: item.trang_thai === 'A' ? '#ecfdf5' : item.trang_thai === 'W' ? '#fffbeb' : '#eff6ff',
                                color: item.trang_thai === 'A' ? '#059669' : item.trang_thai === 'W' ? '#d97706' : '#1d4ed8',
                                "& fieldset": { border: "none" }
                              }}
                            >
                              <MenuItem value="W">Chờ xử lý</MenuItem>
                              <MenuItem value="P">Đang xử lý</MenuItem>
                              <MenuItem value="A">Đã xử lý</MenuItem>
                              <MenuItem value="C">Đã hủy</MenuItem>
                            </Select>
                          </td>
                          <td style={{ textAlign: "right" }}>
                            {new Date(item.ngay_gui).toLocaleDateString('vi-VN')}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>
                        Không có yêu cầu mới
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Notifications */}
        <div className="right-column">
          <div className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">Thông báo</h3>
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  alignItems: "center",
                  color: "blue",
                }}
              >
                <AddCircleOutlineIcon />
              </div>
            </div>
            <div className="notify-container">
              <div className="notify-item unread">
                <div className="notify-icon icon-red">
                  <WarningAmberIcon />
                </div>
                <div className="notify-text">
                  <h4>Công nợ quá hạn - P.1205</h4>
                  <p>
                    Căn hộ 1205 chưa thanh toán phí quản lý tháng 11/2023. Tổng
                    nợ 1.500.000đ.
                  </p>
                  <span className="notify-time">2 giờ trước</span>
                </div>
              </div>

              <div
                className="notify-item"
                style={{ backgroundColor: "rgba(37, 99, 235, 0.05)" }}
              >
                <div className="notify-icon icon-blue">
                  <GroupAddIcon />
                </div>
                <div className="notify-text">
                  <h4>Yêu cầu tạm trú mới</h4>
                  <p>
                    Cư dân Nguyễn Văn B (P.0802) đã gửi yêu cầu đăng ký tạm trú
                    cho người thân.
                  </p>
                  <span className="notify-time">5 giờ trước</span>
                </div>
              </div>

              <div className="notify-item">
                <div className="notify-icon icon-orange">
                  <CampaignIcon />
                </div>
                <div className="notify-text">
                  <h4>Thông báo từ BQL</h4>
                  <p>
                    Lịch bảo trì thang máy tòa A sẽ diễn ra vào ngày 25/12 từ
                    08:00 đến 12:00.
                  </p>
                  <span className="notify-time">1 ngày trước</span>
                </div>
              </div>

              <div className="notify-item">
                <div className="notify-icon icon-green">
                  <BuildIcon />
                </div>
                <div className="notify-text">
                  <h4>Hoàn thành sửa chữa</h4>
                  <p>
                    Yêu cầu sửa chữa điện tại sảnh B đã được kỹ thuật viên xử lý
                    xong.
                  </p>
                  <span className="notify-time">2 ngày trước</span>
                </div>
              </div>
            </div>
            <div className="card-footer">
              <button className="btn-link" style={{ width: "100%" }}>
                Xem tất cả thông báo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
