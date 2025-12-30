import React from "react";
import {
  Paper,
  Box,
  Typography,
  Grid,
  Select,
  MenuItem,
  Switch,
} from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import LanguageIcon from "@mui/icons-material/Language";
import PaletteIcon from "@mui/icons-material/Palette";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import {
  cardStyle,
  TEXT_PRIMARY,
  BORDER_COLOR,
  labelStyle,
} from "./SettingsStyle";

export default function ConfigTab() {
  return (
    <Paper
      sx={{
        ...cardStyle,
        mt: "-1px",
        borderTopLeftRadius: 0,
        zIndex: 5,
        position: "relative",
      }}
    >
      <Box display="flex" alignItems="center" gap={1.5} mb={4}>
        <Box
          sx={{
            p: 1,
            bgcolor: "#ffedd5",
            borderRadius: "8px",
            color: "#ea580c",
            display: "flex",
          }}
        >
          <TuneIcon />
        </Box>
        <Typography variant="h6" fontWeight={700} color={TEXT_PRIMARY}>
          Cấu hình chung
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              bgcolor: "#f8fafc",
              borderRadius: "12px",
              border: `1px solid ${BORDER_COLOR}`,
              p: 4,
              height: "100%",
              transition: "all 0.2s",
              "&:hover": { borderColor: "#cbd5e1" },
            }}
          >
            <Typography
              variant="subtitle2"
              fontWeight={700}
              color={TEXT_PRIMARY}
              mb={3}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              <LanguageIcon sx={{ color: "#94a3b8", fontSize: 20 }} />
              Ngôn ngữ & Khu vực
            </Typography>

            <Box display="flex" flexDirection="column" gap={3}>
              <Box>
                <Typography sx={labelStyle}>Ngôn ngữ hiển thị</Typography>
                <Select
                  fullWidth
                  size="small"
                  defaultValue="vi"
                  sx={{
                    bgcolor: "white",
                    "& fieldset": { borderColor: BORDER_COLOR },
                    fontWeight: 500,
                  }}
                >
                  <MenuItem value="vi">Tiếng Việt (Vietnamese)</MenuItem>
                  <MenuItem value="en">Tiếng Anh (English)</MenuItem>
                </Select>
              </Box>
              <Box>
                <Typography sx={labelStyle}>Múi giờ</Typography>
                <Select
                  fullWidth
                  size="small"
                  defaultValue="hcm"
                  sx={{
                    bgcolor: "white",
                    "& fieldset": { borderColor: BORDER_COLOR },
                    fontWeight: 500,
                  }}
                >
                  <MenuItem value="hcm">
                    (GMT+07:00) Bangkok, Hanoi, Jakarta
                  </MenuItem>
                </Select>
              </Box>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box
            sx={{
              bgcolor: "#f8fafc",
              borderRadius: "12px",
              border: `1px solid ${BORDER_COLOR}`,
              p: 4,
              height: "100%",
              transition: "all 0.2s",
              "&:hover": { borderColor: "#cbd5e1" },
            }}
          >
            <Typography
              variant="subtitle2"
              fontWeight={700}
              color={TEXT_PRIMARY}
              mb={3}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              <PaletteIcon sx={{ color: "#94a3b8", fontSize: 20 }} />
              Giao diện
            </Typography>

            <Box display="flex" flexDirection="column" gap={2}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  p: 1.5,
                  bgcolor: "white",
                  borderRadius: "8px",
                  border: `1px solid ${BORDER_COLOR}`,
                  boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)",
                }}
              >
                <Box display="flex" alignItems="center" gap={1.5}>
                  <Box
                    sx={{
                      p: 0.75,
                      bgcolor: "#f1f5f9",
                      borderRadius: "6px",
                      color: "#475569",
                    }}
                  >
                    <DarkModeIcon fontSize="small" />
                  </Box>
                  <Typography
                    fontWeight={600}
                    fontSize="0.875rem"
                    color={TEXT_PRIMARY}
                  >
                    Chế độ tối
                  </Typography>
                </Box>
                <Switch size="small" />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  p: 1.5,
                  bgcolor: "white",
                  borderRadius: "8px",
                  border: `1px solid ${BORDER_COLOR}`,
                  boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)",
                }}
              >
                <Box display="flex" alignItems="center" gap={1.5}>
                  <Box
                    sx={{
                      p: 0.75,
                      bgcolor: "#f1f5f9",
                      borderRadius: "6px",
                      color: "#475569",
                    }}
                  >
                    <FirstPageIcon fontSize="small" />
                  </Box>
                  <Typography
                    fontWeight={600}
                    fontSize="0.875rem"
                    color={TEXT_PRIMARY}
                  >
                    Thu gọn Menu
                  </Typography>
                </Box>
                <Switch size="small" />
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}
