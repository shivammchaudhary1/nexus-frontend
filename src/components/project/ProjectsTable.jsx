import React from "react";
import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { FONTS } from "##/src/utility/utility.js";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import { capitalizeFirstWord } from "##/src/utility/miscellaneous/capitalize.js";

// Function to format seconds to HH:MM:SS
function formatDuration(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0",
  )}:${String(remainingSeconds).padStart(2, "0")}`;
}

const ProjectTable = ({
  projects,
  handleOpenUpdateModal,
  handleCompleteProject,
  handleOpenDeleteModal,
  isAdmin,
}) => {
  const tableBodyStyle = {
    fontFamily: FONTS.body,
    fontSize: "14px",
    textAlign: "center",
  };
  const tableHeadStyle = {
    fontFamily: FONTS.subheading,
    fontSize: "16px",
    fontWeight: "bold",
    color: "#5a5a5a",
    textAlign: "center",
  };

  return (
    <TableContainer sx={{ maxHeight: "60vh" }}>
      <Table
        size="small"
        aria-label="a dense table"
        sx={{
          "& .MuiTableCell-root": {
            padding: "10px 0px",
          },
        }}
        stickyHeader
      >
        <TableHead>
          <TableRow
            sx={{
              borderTop: "1px solid #ddd",
              borderBottom: "1px solid #ddd",
            }}
          >
            <TableCell
              sx={{
                fontFamily: FONTS.subheading,
                fontSize: "16px",
                fontWeight: "bold",
                color: "#5a5a5a",
              }}
            >
              Project Name
            </TableCell>
            <TableCell sx={tableHeadStyle}>Description</TableCell>
            <TableCell sx={tableHeadStyle}>Estimated Hours</TableCell>
            <TableCell sx={tableHeadStyle}>Hours Spent</TableCell>
            <TableCell sx={tableHeadStyle}>Progress (%)</TableCell>
            {isAdmin && <TableCell sx={tableHeadStyle}>Completed</TableCell>}
            {isAdmin && <TableCell sx={tableHeadStyle}>Actions</TableCell>}
          </TableRow>
        </TableHead>
        {projects.length > 0 ? (
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project._id}>
                <TableCell sx={{ fontFamily: FONTS.body, fontSize: "14px" }}>
                  {capitalizeFirstWord(project.name)}
                </TableCell>
                <TableCell sx={tableBodyStyle}>{project.description}</TableCell>
                <TableCell sx={tableBodyStyle}>
                  {parseFloat(project.estimatedHours)}
                </TableCell>
                <TableCell sx={tableBodyStyle}>
                  {" "}
                  {formatDuration(
                    Math.floor(project.timeSpend),
                  )}
                </TableCell>
                <TableCell sx={tableBodyStyle}>
                  {parseInt(
                    (project.timeSpend /
                      3600 /
                      parseFloat(project.estimatedHours)) *
                      100,
                    10,
                  )}
                  %
                </TableCell>
                {isAdmin && (
                  <TableCell sx={{ textAlign: "center" }}>
                    {" "}
                    {!project.isCompleted ? (
                      <IconButton
                        onClick={() => handleCompleteProject(project)}
                      >
                        <CheckCircleOutlineOutlinedIcon />
                      </IconButton>
                    ) : (
                      <IconButton
                        onClick={() => handleCompleteProject(project)}
                      >
                        <HistoryOutlinedIcon />
                      </IconButton>
                    )}
                  </TableCell>
                )}
                {isAdmin && (
                  <TableCell sx={{ textAlign: "center" }}>
                    <IconButton onClick={() => handleOpenUpdateModal(project)}>
                      <EditOutlinedIcon />
                    </IconButton>

                    <IconButton onClick={() => handleOpenDeleteModal(project)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        ) : (
          <TableBody>
            <TableRow>
              <TableCell
                colSpan={8}
                sx={{ textAlign: "center", backgroundColor: "#eee" }}
              >
                <Typography sx={{ py: "30px" }}>
                  No Data to show Projects
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>
    </TableContainer>
  );
};

export default ProjectTable;
