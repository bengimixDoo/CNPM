import React, { useState } from "react";
import { Box, Fade } from "@mui/material";

// Import components
import NavTabs from "../components/Settings/NavTabs";
import GeneralTab from "../components/Settings/GeneralTab";
import NotificationsTab from "../components/Settings/NotificationsTab";
import PermissionsTab from "../components/Settings/PermissionsTab";
import ConfigTab from "../components/Settings/ConfigTab";

// Import constants
import { BG_COLOR } from "../components/Settings/SettingsStyle";

export default function Setting() {
  const [activeTab, setActiveTab] = useState("general");

  const renderContent = () => {
    switch (activeTab) {
      case "general":
        return <GeneralTab />;
      case "notifications":
        return <NotificationsTab />;
      case "permissions":
        return <PermissionsTab />;
      case "config":
        return <ConfigTab />;
      default:
        return <GeneralTab />;
    }
  };

  return (
    <Box sx={{ width: "100%", bgcolor: BG_COLOR, minHeight: "100vh"}}>
      <Box sx={{ maxWidth: 1200, mx: "auto"}}>
        <NavTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <Box sx={{ position: "relative", minHeight: 200 }}>
          <Fade in={true} key={activeTab} timeout={300}>
            <div>{renderContent()}</div>
          </Fade>
        </Box>
      </Box>
    </Box>
  );
}
