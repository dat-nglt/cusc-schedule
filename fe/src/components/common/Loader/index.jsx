import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { RingLoader } from "react-spinners";

const Loader = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "background.default",
      }}
    >
      <RingLoader
        color={theme.palette.primary.main}
        size={80}
        speedMultiplier={0.8}
      />
    </Box>
  );
};

export default Loader;
