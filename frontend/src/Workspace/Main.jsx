import StatCard from "../components/StatCard.jsx";
import "../styles/AdminDashboard.css";
import "../styles/MainDashboard.css";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import CampaignIcon from "@mui/icons-material/Campaign";
import BuildIcon from "@mui/icons-material/Build";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
export default function Main() {
  return (
    <div className="dashboard-wrapper">
      {/* Stats Row (unchanged as requested) */}
      <div className="stats-row">
        <StatCard
          title="Tổng số căn hộ"
          value="1234"
          colorBackground="var(--background-blue)"
          typeCard={"Home"}
        />
        <StatCard
          title="Cư dân"
          value="567,890"
          colorBackground="var(--background-green)"
          typeCard={"Resident"}
        />
        <StatCard
          title="Phương tiện"
          value="345"
          colorBackground="var(--background-yellow)"
          typeCard={"Vehicle"}
        />
        <StatCard
          title="Tổng khoản thu"
          value="78"
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
                <div
                  className="chart-bar-group"
                  key={index}
                >
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
                <h3 className="card-title">Biến động cư dân tháng hiện tại</h3>
                <p className="card-subtitle">
                  Danh sách chi tiết tạm trú và tạm vắng
                </p>
              </div>
              <button className="btn-link">Xem tất cả</button>
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
                  <tr>
                    <td>
                      <div className="user-info">
                        <div className="avatar-circle bg-blue-light">NB</div>
                        <span className="font-medium">Nguyễn Văn B</span>
                      </div>
                    </td>
                    <td>P.1205</td>
                    <td>
                      <span className="status-badge badge-temp-res">
                        <span className="dot dot-blue"></span> Tạm trú
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>01/11 - 30/11/2023</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="user-info">
                        <div className="avatar-circle bg-orange-light">TC</div>
                        <span className="font-medium">Trần Thị C</span>
                      </div>
                    </td>
                    <td>P.0802</td>
                    <td>
                      <span className="status-badge badge-temp-abs">
                        <span className="dot dot-orange"></span> Tạm vắng
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>15/11 - 20/11/2023</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="user-info">
                        <div className="avatar-circle bg-purple-light">LH</div>
                        <span className="font-medium">Lê Hùng</span>
                      </div>
                    </td>
                    <td>A.0501</td>
                    <td>
                      <span className="status-badge badge-temp-res">
                        <span className="dot dot-blue"></span> Tạm trú
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>20/11 - 20/05/2024</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="user-info">
                        <div className="avatar-circle bg-green-light">PM</div>
                        <span className="font-medium">Phạm Minh</span>
                      </div>
                    </td>
                    <td>B.1102</td>
                    <td>
                      <span className="status-badge badge-temp-abs">
                        <span className="dot dot-orange"></span> Tạm vắng
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>22/11 - 25/11/2023</td>
                  </tr>
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
                style={{ display: "flex", gap: "8px", alignItems: "center", color: "blue"}}
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
