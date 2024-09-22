import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { FONTS } from "##/src/utility/utility.js";
import DeleteIcon from "@mui/icons-material/Delete";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useDispatch, useSelector } from "react-redux";
import {
  addLeaveType,
  deleteLeaveType,
  getHolidayTypes,
  selectHolidayTypes,
  updateLeaveType,
} from "##/src/app/holidaySlice.js";
import { selectMe } from "##/src/app/profileSlice.js";
import AddLeaveTypeModal from "../holidayAndLeaveModal/AddLeaveTypeModal";
import UpdateLeaveTypeModal from "../holidayAndLeaveModal/UpdateLeaveTypeModal";
import DeleteModal from "##/src/components/common/DeleteModal.jsx";
import { selectCurrentTheme } from "##/src/app/themeSlice.js";
import { notify } from "##/src/app/alertSlice.js";
import { capitalizeFirstWord } from "##/src/utility/miscellaneous/capitalize.js";

const LeaveType = ({ setProgress }) => {
  const [isLeaveTypeModalOpen, setIsLeaveTypeModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedLeaveType, setSelectedLeaveType] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [leaveTypeToDelete, setLeaveTypeToDelete] = useState("");

  const dispatchToRedux = useDispatch();
  const user = useSelector(selectMe);
  const leaveTypes = useSelector(selectHolidayTypes);
  const theme = useSelector(selectCurrentTheme);

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

  // GET LEAVE TYPE
  useEffect(() => {
    try {
      if (user) {
        setProgress(30);
        dispatchToRedux(getHolidayTypes({ userId: user._id }));
      }
      setProgress(100);
    } catch (error) {
      setProgress(100);
      dispatchToRedux(notify({ type: "error", message: error }));
    }
  }, [dispatchToRedux]);

  //ADD Leave Type
  const handleAddLeaveType = async (
    newLeaveType,
    setLoading,
    handleClose,
    setLeaveType,
  ) => {
    if (newLeaveType.trim() === "") {
      return dispatchToRedux(
        notify({ type: "warning", message: "Please Add Leave Type" }),
      );
    }

    try {
      setLoading(true);
      setProgress(30);
      await dispatchToRedux(
        addLeaveType({
          userId: user._id,

          leaveType: newLeaveType,
        }),
      );

      setLoading(false);
      setProgress(100);
      handleClose();
      setLeaveType("");
      dispatchToRedux(
        notify({ type: "success", message: "Leave type successfully added" }),
      );
    } catch (error) {
      setProgress(100);

      setLoading(false);
      setLeaveType("");
      dispatchToRedux(
        notify({ type: "error", message: "Failed to add leave type", error }),
      );
    }
  };

  // UPDATE LEAVE TYPE

  const handleUpdateLeaveType = async (
    { leaveType, paid },
    handleClose,
    setLoading,
  ) => {
    try {
      setProgress(30);
      setLoading(true);
      await dispatchToRedux(
        updateLeaveType({
          userId: user._id,

          newLeaveType: leaveType,
          oldLeaveType: selectedLeaveType.leaveType,
          paid: paid,
        }),
      );
      setProgress(100);
      setLoading(false);
      handleClose();
      dispatchToRedux(
        notify({ type: "success", message: "Leave type succesfully updated" }),
      );
    } catch (error) {
      setProgress(100);
      setLoading(false);
      dispatchToRedux(
        notify({
          type: "error",
          message: "Failed to update leave type",
          error,
        }),
      );
    }
  };

  //DELETE LEAVE TYPE

  const handleDeleteLeaveType = async () => {
    try {
      if (leaveTypeToDelete) {
        setProgress(30);
        await dispatchToRedux(
          deleteLeaveType({
            userId: user._id,

            leaveType: leaveTypeToDelete.leaveType,
          }),
        );
      }
      setProgress(100);
      setDeleteModalOpen(false);
      setLeaveTypeToDelete("");
      dispatchToRedux(
        notify({ type: "success", message: "Leave type successfully deleted" }),
      );
    } catch (error) {
      setProgress(100);
      setDeleteModalOpen(false);
      setLeaveTypeToDelete("");
      dispatchToRedux(
        notify({
          type: "error",
          message: "Failed to delete leave type",
          error,
        }),
      );
    }
  };

  const handleOpenModal = () => {
    setIsLeaveTypeModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsLeaveTypeModalOpen(false);
  };

  const handleUpdateModalOpen = (leaveType) => {
    setIsUpdateModalOpen(true);
    setSelectedLeaveType(leaveType);
  };
  const handleEdit = (leaveType) => {
    handleUpdateModalOpen(leaveType);
  };

  const handleDelete = (leaveType) => {
    setDeleteModalOpen(true);
    setLeaveTypeToDelete(leaveType);
  };

  return (
    <Box>
      <TableContainer sx={{ maxHeight: "60vh" }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: "20px" }}>
          <Button variant="outlined" color="inherit" onClick={handleOpenModal}>
            Add Type
          </Button>
        </Box>

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
                Type
              </TableCell>
              <TableCell sx={tableHeadStyle}> Paid/Unpaid</TableCell>
              <TableCell sx={tableHeadStyle}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leaveTypes?.map((leaveType) => (
              <TableRow key={leaveType.leaveType}>
                <TableCell sx={{ fontFamily: FONTS.body, fontSize: "14px" }}>
                  {capitalizeFirstWord(leaveType.leaveType)}
                </TableCell>
                <TableCell sx={tableBodyStyle}>
                  {leaveType.paid ? "Paid" : "Unpaid"}
                </TableCell>
                <TableCell sx={tableBodyStyle}>
                  <IconButton onClick={() => handleEdit(leaveType)}>
                    <EditOutlinedIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(leaveType)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <AddLeaveTypeModal
        open={isLeaveTypeModalOpen}
        handleClose={handleCloseModal}
        handleAddLeaveType={handleAddLeaveType}
        theme={theme}
      />
      <UpdateLeaveTypeModal
        open={isUpdateModalOpen}
        handleClose={() => setIsUpdateModalOpen(false)}
        handleUpdateLeaveType={handleUpdateLeaveType}
        initialLeaveType={selectedLeaveType}
        theme={theme}
      />
      <DeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onDelete={handleDeleteLeaveType}
        title={"Delete Leave Type"}
        text={
          "Leave Type and its data will be removed permanently. Are you sure you want to delete this type?"
        }
        theme={theme}
      />
    </Box>
  );
};

export default LeaveType;
