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

const InviteUser = ({ open, onClose, onSave, theme, title, buttonLoading }) => {
  const [email, setEmail] = useState("");

  const handleChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSave = async () => {
    await onSave(email);
    setEmail(""); 
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
            color: theme?.secondaryColor,
            fontSize: "18px",
            paddingTop: "10px",
          }}
        >
          {title}
        </Typography>
        <TextField
          sx={{ width: "96%" }}
          variant="standard"
          label="E-mail"
          value={email}
          onChange={handleChange}
        />

        {buttonLoading ? (
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

export default InviteUser;
