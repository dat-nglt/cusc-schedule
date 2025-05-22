import { createTheme } from "@mui/material/styles";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#3B82F6", // Blue - trust, focus
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#F59E0B", // Orange - accent
      contrastText: "#FFFFFF",
    },
    success: {
      main: "#10B981", // Green - positive actions
      contrastText: "#FFFFFF",
    },
    warning: {
      main: "#FACC15", // Yellow - warning alerts
      contrastText: "#111827",
    },
    error: {
      main: "#EF4444", // Red - error alerts
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#F9FAFB", // Light background
      paper: "#FFFFFF", // Cards or panels
    },
    text: {
      primary: "#111827", // Titles or main text
      secondary: "#374151", // Regular content
      disabled: "#6B7280", // Muted or placeholder
    },
    divider: "#E5E7EB", // Subtle border for light theme
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#3B82F6",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#F59E0B",
      contrastText: "#111827",
    },
    success: {
      main: "#10B981",
      contrastText: "#111827",
    },
    warning: {
      main: "#FACC15",
      contrastText: "#111827",
    },
    error: {
      main: "#EF4444",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#1F2937", // Dark background
      paper: "#374151", // Dark panels
    },
    text: {
      primary: "#F9FAFB", // Main light text
      secondary: "#D1D5DB", // Soft white
      disabled: "#9CA3AF", // Muted gray
    },
    divider: "#4B5563", // Subtle border for dark theme
  },
});

export { lightTheme, darkTheme };
