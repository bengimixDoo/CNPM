export const PRIMARY_COLOR = "#2563eb"; // Blue-600
export const PRIMARY_HOVER = "#1d4ed8"; // Blue-700
export const BG_COLOR = "#f1f5f9"; // Slate-100
export const TEXT_PRIMARY = "#0f172a"; // Slate-900
export const TEXT_SECONDARY = "#64748b"; // Slate-500
export const BORDER_COLOR = "#e2e8f0"; // Slate-200

export const cardStyle = {
  borderRadius: "16px",
  boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.05)", // shadow-soft
  border: `1px solid ${BORDER_COLOR}`,
  bgcolor: "white",
  p: { xs: 3, md: 5 },
  height: "100%",
  transition: "all 0.3s ease",
};

export const inputStyle = {
  "& .MuiOutlinedInput-root": {
    bgcolor: "#f8fafc", // slate-50
    borderRadius: "8px",
    "& fieldset": { borderColor: "#cbd5e1" }, // slate-300
    "&:hover fieldset": { borderColor: "#94a3b8" }, // slate-400
    "&.Mui-focused fieldset": { borderColor: PRIMARY_COLOR, borderWidth: 2 },
    "& input": {
      py: 1.5,
      px: 2,
      fontSize: "0.875rem",
      color: TEXT_PRIMARY,
      fontWeight: 500,
    },
  },
};

export const labelStyle = {
  fontSize: "0.875rem",
  fontWeight: 600,
  color: "#334155", // slate-700
  mb: 1,
  display: "block",
};
