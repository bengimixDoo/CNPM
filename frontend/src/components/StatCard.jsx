import HomeFilledIcon from "@mui/icons-material/HomeFilled";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import HandymanIcon from "@mui/icons-material/Handyman";
import KeyOffIcon from "@mui/icons-material/KeyOff";
import PeopleIcon from "@mui/icons-material/People"; 
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
export default function StatCard({ title, value, colorBackground, typeCard }) {
  return (
    <div className="stat-card" style={{ "--card-color": colorBackground }}>
      <div className="stat-content">
        <div className="stat-title">{title}</div>
        <div className="stat-value">
          {typeCard === "Home" && (
            <HomeFilledIcon style={{ fontSize: "50px" }} />
          )}
          {typeCard === "Done" && <TaskAltIcon style={{ fontSize: "50px" }} />}
          {typeCard === "Empty" && <KeyOffIcon style={{ fontSize: "50px" }} />}
          {typeCard === "Fix" && <HandymanIcon style={{ fontSize: "50px" }} />}
          {typeCard === "Resident" && <PeopleIcon style={{ fontSize: "50px" }} />}
          {typeCard === "Vehicle" && <TwoWheelerIcon style={{ fontSize: "50px" }} />}
          {typeCard === "Fee" && <AttachMoneyIcon style={{ fontSize: "50px" }} />}
          <div style={{ fontSize: "40px" }}>
            {value}
          </div>
        </div>j
      </div>
    </div>
  );
}
