import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { CloseButton, SaveButton } from "##/src/components/buttons/index.js";

const AddLeaveTypeModal = ({
  open,
  handleClose,
  handleAddLeaveType,
  theme,
}) => {
  const [leaveType, setLeaveType] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setLeaveType(e.target.value);
  };

  const handleAddClick = () => {
    handleAddLeaveType(leaveType, setLoading, handleClose, setLeaveType);
  };

  return (
    <>
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
            Add Leave Type
          </Typography>
          <TextField
            sx={{ width: "96%" }}
            variant="standard"
            label="Leave Type"
            value={leaveType}
            onChange={handleInputChange}
          />
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
            <SaveButton onSave={handleAddClick} theme={theme} />
          )}
          <CloseButton onClose={handleClose} theme={theme} />
        </Box>
      </Modal>
    </>
  );
};

export default AddLeaveTypeModal;
