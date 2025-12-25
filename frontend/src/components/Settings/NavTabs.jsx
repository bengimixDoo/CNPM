import React from "react";
import { Box } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import SecurityIcon from "@mui/icons-material/Security";
import TuneIcon from "@mui/icons-material/Tune";
import {
  PRIMARY_COLOR,
  TEXT_SECONDARY,
  BORDER_COLOR,
} from "./SettingsStyle";

export default function NavTabs({ activeTab, setActiveTab }) {
  const tabs = [
    { label: "Thông tin chung", icon: <PersonIcon />, id: "general" },
    { label: "Thông báo", icon: <NotificationsActiveIcon />, id: "notifications" },
    { label: "Phân quyền", icon: <SecurityIcon />, id: "permissions" },
    { label: "Cấu hình", icon: <TuneIcon />, id: "config" },
  ];

  return (
    <Box sx={{ mb: 0 }}>
      {/* Container for tabs and line */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-end",
          position: "relative", // Ensure z-index works
          zIndex: 10, // Sit on top of card
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <Box
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.25,
                px: 3,
                py: 2,
                cursor: "pointer",
                bgcolor: isActive ? "white" : "transparent",
                color: isActive ? PRIMARY_COLOR : TEXT_SECONDARY,
                fontWeight: 500,
                fontSize: "0.875rem",
                borderTopLeftRadius: "12px",
                borderTopRightRadius: "12px",
                borderTop: isActive ? ` ${BORDER_COLOR}` : "none",
                borderLeft: isActive ? ` ${BORDER_COLOR}` : "none",
                borderRight: isActive ? ` ${BORDER_COLOR}` : "none",
                borderBottom: isActive ? "white" : ` ${BORDER_COLOR}`,
                position: "relative",
                transition: "all 0.2s",
                "&:hover": {
                  bgcolor: !isActive ? "#f8fafc" : undefined,
                  color: !isActive ? "#334155" : undefined,
                },
              }}
            >
              {React.cloneElement(tab.icon, { sx: { fontSize: 20 } })}
              {tab.label}
              {isActive && (
                <Box
                  sx={{
                    position: "absolute",
                    bottom: -1,
                    left: 0,
                    right: 0,
                    height: 2,
                    bgcolor: "white",
                  }}
                />
              )}
            </Box>
          );
        })}

      </Box>
    </Box>
  );
}
