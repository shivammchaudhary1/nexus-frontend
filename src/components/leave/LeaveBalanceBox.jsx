import React from "react";
import { Box, Typography } from "@mui/material";

const LeaveBalanceBox = ({ title, availableLeaves, consumedLeaves, theme }) => {
  return (
    <>
      <Box
        sx={{
          width: "13%",
          height: "200px",
          textAlign: "center",
          boxShadow:
            "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px",
          paddingTop: "10px",
          borderRadius: "5px",
        }}
      >
        <Typography
          variant="h6"
          sx={{ textAlign: "center", fontSize: "16px", fontWeight: "bold" }}
        >
          {title.charAt(0).toUpperCase() + title.slice(1)}
        </Typography>
        {/* circle  */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            height: "90%",
          }}
        >
          <Box
            sx={{
              position: "relative",
              width: "90px",
              height: "90px",
              // width: "100px",
              // height: "100px",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                width: "100%",
                height: "100%",
                border: `3px solid ${theme?.secondaryColor}`,
                // border: "5px solid red",
                borderRadius: "50%",
              }}
            ></Box>
            <Typography
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                fontSize: "24px",
                color: "#000",
                fontWeight: "bold",
              }}
            >
              {availableLeaves}
            </Typography>
          </Box>

          <Box
            sx={{ display: "flex", flexDirection: "column", marginTop: "20px" }}
          >
            {/* <Typography
              variant="h6"
              sx={{ fontWeight: "thin", fontSize: "14px" }}
            >
              <strong>Available: {availableLeaves}</strong>
            </Typography> */}
            <Typography
              variant="h6"
              sx={{ fontWeight: "thin", fontSize: "14px" }}
            >
              <strong> Consumed: {consumedLeaves}</strong>
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default LeaveBalanceBox;
