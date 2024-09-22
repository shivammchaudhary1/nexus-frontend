import React, { memo, useState } from "react";
import {
  Box,
  Collapse,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { FONTS } from "##/src/utility/utility.js";

const tableHeadStyle = {
  fontFamily: FONTS.subheading,
  fontSize: "16px",
  fontWeight: "bold",
  color: "#5a5a5a",

  textAlign: "center",
};

const DataDisplay = ({ data }) => {
  const [open, setOpen] = useState({});

  const handleClick = (date) => {
    setOpen((prevOpen) => ({
      ...prevOpen,
      [date]: !prevOpen[date],
    }));
  };

  const calculateDuration = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const durationInSeconds = (end - start) / 1000;
    return durationInSeconds;
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const totalHoursWorked = data.reduce((total, entry) => {
    return total + entry.totalDuration;
  }, 0);

  function formatLogOffTime(entry) {
    const endTimes =
      entry.entries.length > 0 &&
      entry.entries[entry.entries.length - 1].endTime;
    if (endTimes.length) {
      return new Date(endTimes[endTimes.length-1]).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } else {
      return "-";
    }
  }
  
  return (
    <Box height={["49vh", "50vh", "49vh", "54vh"]} overflow="scroll">
      <Typography
        variant="p"
        gutterBottom
        sx={{ fontFamily: FONTS.body, fontSize: "1.4em" }}
      >
        <strong>Total Hours: {formatDuration(totalHoursWorked)}</strong>
      </Typography>
      <TableContainer component={Paper} sx={{ marginTop: "20px" }}>
        <Table size="small" aria-label="a dense table">
          <TableHead>
            <TableRow
              sx={{
                borderTop: "1px solid #eee",
                borderBottom: "1px solid #eee",
              }}
            >
              <TableCell sx={{ ...tableHeadStyle, textAlign: "left" }}>
                Date
              </TableCell>
              <TableCell sx={{ ...tableHeadStyle, textAlign: "left" }}>
                Login
              </TableCell>
              <TableCell sx={{ ...tableHeadStyle, textAlign: "left" }}>
                Logoff
              </TableCell>
              {/* <TableCell sx={{ ...tableHeadStyle, textAlign: "left" }}>
                Screen Time
              </TableCell> */}
              <TableCell sx={{ ...tableHeadStyle, textAlign: "left" }}>
                Hours Worked
              </TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((entry) => (
              <React.Fragment key={entry._id.date}>
                <TableRow
                  onClick={() => handleClick(entry._id.date)}
                  style={{ cursor: "pointer" }}
                >
                  <TableCell component="th" scope="row">
                    {entry._id.date}
                  </TableCell>
                  <TableCell>
                    {entry.entries.length > 0
                      ? entry.entries[0].createdAt
                        ? new Date(
                          entry.entries[0].createdAt,
                        ).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })
                        : "-"
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {formatLogOffTime(entry)}
                  </TableCell>
                  {/* <TableCell>
                    {formatDuration(
                      calculateDuration(
                        entry.entries[0].createdAt,
                        entry.entries[entry.entries.length - 1].endTime[0],
                      ),
                    )}
                  </TableCell> */}
                  <TableCell>{formatDuration(entry.totalDuration)}</TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleClick(entry._id.date)}
                    >
                      {open[entry._id.date] ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={6}
                  >
                    <Collapse
                      in={open[entry._id.date]}
                      timeout="auto"
                      unmountOnExit
                    >
                      <Box sx={{ margin: 1 }}>
                        <Table size="small" aria-label="entries">
                          <TableHead>
                            <TableRow sx={{ backgroundColor: "#eee" }}>
                              <TableCell
                                sx={{ ...tableHeadStyle, textAlign: "left" }}
                              >
                                Project
                              </TableCell>
                              <TableCell
                                sx={{ ...tableHeadStyle, textAlign: "left" }}
                              >
                                Title
                              </TableCell>
                              <TableCell
                                sx={{ ...tableHeadStyle, textAlign: "left" }}
                              >
                                Start Time
                              </TableCell>
                              <TableCell
                                sx={{ ...tableHeadStyle, textAlign: "left" }}
                              >
                                End Time
                              </TableCell>
                              <TableCell
                                sx={{ ...tableHeadStyle, textAlign: "left" }}
                              >
                                Duration
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {entry.entries.map((entry) => (
                              <TableRow key={entry._id}>
                                <TableCell component="th" scope="row">
                                  {entry.projectDetails[0].name}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                  {entry.title}
                                </TableCell>
                                <TableCell>
                                  {new Date(
                                    entry.startTime[0],
                                  ).toLocaleTimeString("en-US", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                  })}
                                </TableCell>
                                <TableCell>
                                  {new Date(
                                    entry.endTime[entry.endTime.length - 1],
                                  ).toLocaleTimeString("en-US", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                  }) || "-"}
                                </TableCell>
                                <TableCell>
                                  {formatDuration(entry.durationInSeconds)}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default memo(DataDisplay);
