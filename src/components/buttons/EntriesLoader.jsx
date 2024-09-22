import React from "react";
import { Box, CircularProgress } from "@mui/material";

const EntriesLoader = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress color="inherit" />
    </Box>
  );
};

export default EntriesLoader;
