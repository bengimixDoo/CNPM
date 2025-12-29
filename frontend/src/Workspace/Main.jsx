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
export default function Main() {
  const [stats, setStats] = useState({
    apartments: 0,
    residents: 0,
    vehicles: 0,
    totalFees: 0,
  });
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Vì backend chưa có endpoint dashboard tổng hợp, ta gọi đồng thời các API cơ bản
      const [apts, reds, vehicles, hist] = await Promise.all([
        residentsService.getApartments(),
        residentsService.getResidents(),
        utilitiesService.getVehicles(),
        residentsService.getHistory({ limit: 4 })
      ]);

      setStats({
        apartments: apts.length,
        residents: reds.length,
        vehicles: vehicles.length,
        totalFees: 0 // Mock for now
      });

      setHistory(hist.slice(0, 4)); // Chỉ lấy 4 dòng mới nhất
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu dashboard:", error);
    } finally {
      setLoading(false);
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
                <h3 className="card-title">Biến động cư dân</h3>
              </div>
              <select className="select-input">
                <option value="">Tất cả</option>
                <option value="">Tạm trú</option>
                <option value="">Tạm vắng</option>
              </select>
            </div>
            <div className="table-wrapper">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Tên cư dân</th>
                    <th>Căn hộ</th>
                    <th>Loại biến động</th>
                    <th style={{ textAlign: "right" }}>Thời gian</th>
                  </tr>
                </thead>
                <tbody>
                  {history.length > 0 ? history.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <div className="user-info">
                          <div className="avatar-circle bg-blue-light">
                            {item.cu_dan_info?.ho_ten?.charAt(0) || "C"}
                          </div>
                          <span className="font-medium">{item.cu_dan_info?.ho_ten || "Cư dân"}</span>
                        </div>
                      </td>
                      <td>{item.can_ho_info?.ma_can_ho || "N/A"}</td>
                      <td>
                        <span className={`status-badge ${item.loai_bien_dong === 'TAM_TRU' ? 'badge-temp-res' : 'badge-temp-abs'}`}>
                          <span className={`dot ${item.loai_bien_dong === 'TAM_TRU' ? 'dot-blue' : 'dot-orange'}`}></span>
                          {item.loai_bien_dong_display || item.loai_bien_dong}
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>{item.ngay_bat_dau}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>Không có biến động mới</td>
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
