import {
  Box,
  Button,
  CircularProgress,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { CloseButton, SaveButton } from "##/src/components/buttons/index.js";
import { notify } from "##/src/app/alertSlice.js";
import { useDispatch } from "react-redux";

const AddClient = ({ open, onClose, onSave, theme, title }) => {
  const [clientName, setClientName] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatchToRedux = useDispatch();

  const handleChange = (event) => {
    setClientName(event.target.value);
  };

  const handleSave = async () => {
    if (clientName.trim() === "") {
      dispatchToRedux(
        notify({
          type: "warning",
          message: "Please enter a client name before adding a client.",
        }),
      );
      return;
    }
    setLoading(true);
    await onSave(clientName);
    setLoading(false);
    onClose();
    setClientName("");
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
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
          {title}
        </Typography>
        <TextField
          sx={{ width: "96%" }}
          variant="standard"
          label="Enter Client name"
          value={clientName}
          onChange={handleChange}
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
          <SaveButton onSave={handleSave} theme={theme} />
        )}
        <CloseButton onClose={onClose} theme={theme} />
      </Box>
    </Modal>
  );
};

export default AddClient;
