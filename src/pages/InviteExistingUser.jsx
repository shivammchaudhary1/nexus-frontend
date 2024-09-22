import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { config } from "##/src/utility/config/config.js";
import { Box, CircularProgress, Typography } from "@mui/material";

const InviteExistingUser = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [responseMessage, setResponseMessage] = useState("");

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${config.api}/api/user/inviteexistinguser/${token}`,
        {
          method: "POST",
        },
      );

      if (response.ok) {
        setResponseMessage("Workspace is added successfully, ");
        navigate("/signin");
      } else {
        setResponseMessage("Error: Unable to process invitation.");
      }
    } catch (error) {
      setResponseMessage("Error: Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
          {" "}
          <CircularProgress />
        </Box>
      ) : (
        <Typography variant="h5" sx={{ textAlign: "center" }}>
          {responseMessage}
        </Typography>
      )}
    </Box>
  );
};

export default InviteExistingUser;
