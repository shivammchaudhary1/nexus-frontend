import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Modal,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { CloseButton, SaveButton } from "##/src/components/buttons/index.js";

const UpdateLeaveTypeModal = ({
  open,
  handleClose,
  handleUpdateLeaveType,
  initialLeaveType,
  theme,
}) => {
  const [leaveType, setLeaveType] = useState("");
  const [paid, setPaid] = useState(true); // Added state for paid/unpaid
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLeaveType(initialLeaveType.leaveType);
    setPaid(initialLeaveType.paid);
  }, [open, initialLeaveType]);

  const handleInputChange = (e) => {
    setLeaveType(e.target.value);
  };

  const handleToggle = () => {
    setPaid(!paid);
  };

  const handleUpdateClick = () => {
    handleUpdateLeaveType({ leaveType, paid }, handleClose, setLoading);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#FFFFFF",
          padding: "10px",
          width: ["80%", "50%", "35%"],
          borderRadius: "5px",
          gap: "12px",
          position: "relative",
          paddingBottom: "10px",
        }}
      >
        <Typography
          sx={{
            color: theme.secondaryColor,
            fontSize: "16px",
            paddingTop: "10px",
          }}
        >
          Update Leave Type
        </Typography>
        <TextField
          sx={{ width: "96%" }}
          variant="standard"
          label="Leave Type"
          value={leaveType}
          onChange={handleInputChange}
        />
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Switch
            checked={paid}
            onChange={handleToggle}
            inputProps={{ "aria-label": "controlled" }}
          />{" "}
          <Typography sx={{ fontSize: "16px" }}>
            {paid ? "Paid" : "Unpaid"}
          </Typography>
        </Box>
        {loading ? (
          <Button
            variant="contained"
            sx={{
              backgroundColor: theme?.secondaryColor,
              width: "96%",
              fontSize: "16px",
              ":hover": {
                backgroundColor: theme?.secondaryColor,
              },
            }}
          >
            <CircularProgress color="inherit" />
          </Button>
        ) : (
          <SaveButton onSave={handleUpdateClick} theme={theme} />
        )}
        <CloseButton onClose={handleClose} theme={theme} />
      </Box>
    </Modal>
  );
};

export default UpdateLeaveTypeModal;
