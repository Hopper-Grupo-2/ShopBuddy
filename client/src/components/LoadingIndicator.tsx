import { Box, CircularProgress } from "@mui/material";

export default function LoadingIndicator() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexWrap="wrap"
      sx={{
        width: "100%",
        height: "100%",
      }}
    >
      <CircularProgress size="50px" />
    </Box>
  );
}
