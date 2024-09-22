import React from "react";
import { Button, CircularProgress } from "@mui/material";

export const LoadingButton = ({ theme }) => {
  return (
    <Button
      variant="contained"
      sx={{
        backgroundColor: theme?.secondaryColor,
        width: "96%",
        fontSize: "16px",
        ":hover": {
          backgroundColor: theme?.secondaryColor,
        },
      }}
    >
      <CircularProgress color="inherit" size="1.8rem" />
    </Button>
  );
};
