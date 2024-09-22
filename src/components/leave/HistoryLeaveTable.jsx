import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { FONTS } from "##/src/utility/utility.js";
import DeleteIcon from "@mui/icons-material/Delete";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteModal from "##/src/components/common/DeleteModal.jsx";
import { deleteLeaveRequest } from "##/src/app/leaveSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { selectMe } from "##/src/app/profileSlice.js";
import EditApplyLeaveModal from "../holidayAndLeaveModal/EditApplyLeaveModal";

const HistoryLeaveTable = ({ userLeaveData, theme, leaveTypes }) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [leaveRequestToDelete, setLeaveRequestToDelete] = useState("");
  const [leaveToBeEdited, setLeaveToBeEdited] = useState(null);
  const dispatchToRedux = useDispatch();
  const user = useSelector(selectMe);

  const tableBodyStyle = {
    fontFamily: FONTS.body,
    fontSize: "14px",
    textAlign: "center",
  };
  const tableHeadStyle = {
    fontFamily: FONTS.subheading,
    fontSize: "16px",
    fontWeight: "bold",
    // color: theme.textColor,
    color: "#5a5a5a",
    textAlign: "center",
  };

  const handleEdit = (leaveData) => {
    setLeaveToBeEdited(leaveData);
    setIsEditModalOpen(true);
  };

  const handleFormSubmit = (updatedData) => {
    // console.log("Updated Data:", updatedData);
    // Add logic to update data in your state or send to the server
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setLeaveToBeEdited(null);
  };

  const handleDelete = (leaveId) => {
    setDeleteModalOpen(true);
    setLeaveRequestToDelete(leaveId);
  };

  const handleDeleteRequest = async () => {
    try {
      if (leaveRequestToDelete) {
        await dispatchToRedux(
          deleteLeaveRequest({
            leaveId: leaveRequestToDelete,
            userId: user._id,
          }),
        );
      }
      setDeleteModalOpen(false);
      setLeaveRequestToDelete("");
    } catch (error) {
      console.error("Error deleting leave request:", error);
    }
  };

  return (
    <Box>
      <TableContainer sx={{ maxHeight: "35vh" }}>
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
              <TableCell sx={tableHeadStyle}>Employee Name</TableCell>
              <TableCell sx={tableHeadStyle}>Leave Type</TableCell>
              <TableCell sx={tableHeadStyle}>Type</TableCell>
              <TableCell sx={tableHeadStyle}>Leave Period</TableCell>
              <TableCell sx={tableHeadStyle}>Days/Hours</TableCell>
              <TableCell sx={tableHeadStyle}>Date of Request</TableCell>
              <TableCell sx={tableHeadStyle}>Status</TableCell>
              <TableCell sx={tableHeadStyle}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userLeaveData.length > 0 ? (
              userLeaveData.map((leave) => {
                // Find the corresponding leave type in leaveTypes array
                const correspondingLeaveType = leaveTypes.find(
                  (type) => type.leaveType === leave.type,
                );

                // Display "paid" if found and it's true, otherwise "unpaid"
                const paidStatus =
                  correspondingLeaveType && correspondingLeaveType.paid
                    ? "Paid"
                    : "Unpaid";

                return (
                  <TableRow key={leave._id}>
                    <TableCell sx={tableBodyStyle}>{leave.user.name}</TableCell>
                    <TableCell sx={tableBodyStyle}>{leave.type}</TableCell>
                    <TableCell sx={tableBodyStyle}>{paidStatus}</TableCell>
                    <TableCell sx={tableBodyStyle}>
                      {new Date(leave.startDate).toLocaleDateString()} -{" "}
                      {new Date(leave.endDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell sx={tableBodyStyle}>
                      {leave.numberOfDays}
                    </TableCell>
                    <TableCell sx={tableBodyStyle}>
                      {new Date(leave.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell sx={tableBodyStyle}>{leave.status}</TableCell>
                    <TableCell sx={tableBodyStyle}>
                      <IconButton
                        onClick={() => handleEdit(leave)}
                        disabled={leave.status === "approved"}
                      >
                        <EditOutlinedIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(leave._id)}
                        disabled={leave.status === "approved"}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={8}
                  sx={{
                    textAlign: "center",
                    backgroundColor: "#eee",
                  }}
                >
                  <Typography sx={{ py: "10px" }}>No History found</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <EditApplyLeaveModal
        open={isEditModalOpen}
        handleClose={handleCloseModal}
        initialData={leaveToBeEdited}
        onSubmit={handleFormSubmit}
        theme={theme}
      />
      <DeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onDelete={handleDeleteRequest}
        title={"Delete Leave Request"}
        text={
          "Leave Request and its data will be removed permanently. Are you sure you want to delete this Request?"
        }
        theme={theme}
      />
    </Box>
  );
};

export default HistoryLeaveTable;
