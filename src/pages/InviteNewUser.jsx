import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { config } from "##/src/utility/config/config.js";
import { Box, CircularProgress, Typography } from "@mui/material";

function InviteNewUser() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [responseMessage, setResponseMessage] = useState("");
  const [timer, setTimer] = useState(10);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${config.api}/api/user/invitenewuser/${token}`,
        {
          method: "POST",
        },
      );
      if (response.ok) {
        setResponseMessage(
          "Your account has been successfully created. Please check your email for login credentials.",
        );

        let countdown = 5;
        const timerInterval = setInterval(() => {
          countdown -= 1;
          setTimer(countdown);

          if (countdown === 0) {
            clearInterval(timerInterval);
            navigate("/signin");
          }
        }, 1000);
      } else {
        setResponseMessage("Error: Unable to process the invitation.");
        setTimer(0);
      }
    } catch (error) {
      setResponseMessage("Error: Something went wrong.");
      setTimer(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token, navigate]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      {loading ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <div>
          <Typography variant="h5" sx={{ textAlign: "center" }}>
            {responseMessage}
          </Typography>
          {timer > 0 &&
            responseMessage !== "Error: Unable to process the invitation." &&
            responseMessage !== "Error: Something went wrong." && (
            <Typography variant="body2" sx={{ textAlign: "center" }}>
                Redirecting to login page in {timer} seconds...
            </Typography>
          )}
        </div>
      )}
    </Box>
  );
}

export default InviteNewUser;
