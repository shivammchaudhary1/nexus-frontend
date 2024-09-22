import React from "react";
import { Backdrop, CircularProgress } from "@mui/material";
import { selectLoading } from "../../app/loadingSlice";
import { useSelector } from "react-redux";

const Loader = () => {
  const loading = useSelector(selectLoading);

  return (
    <Backdrop
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: "rgba(255, 255, 255, 255)",
      }}
      open={loading}
    >
      {/* <CircularProgress color="inherit" /> */}
      <CircularProgress />
    </Backdrop>
  );
};

export default Loader;
