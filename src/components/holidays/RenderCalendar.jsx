// RenderCalendar.jsx

import React from "react";
import { Box, CircularProgress, Container } from "@mui/material";
import Calendar from "react-calendar";

const RenderCalendar = ({ tileContent, componentLoading }) => {
  return (
    <Box>
      <Container maxWidth="xl">
        {componentLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "65vh",
            }}
          >
            <CircularProgress color="inherit" />
          </Box>
        ) : (
          <Calendar tileContent={tileContent} calendarType="US" />
        )}
      </Container>
    </Box>
  );
};

export default RenderCalendar;
