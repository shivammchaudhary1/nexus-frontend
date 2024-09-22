import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
// import { Typography } from "@mui/material";

export default function BackdropLoader({ open }) {
  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <CircularProgress color="inherit" />
        {/* <Typography
          variant="h6"
          component="div"
          sx={{
            position: "absolute",
            top: "43%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "black",
          }}
        >
          Processing...
        </Typography> */}
      </Backdrop>
    </>
  );
}
