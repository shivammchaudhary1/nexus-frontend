import { Box, Modal, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  CloseButton,
  LoadingButton,
  SaveButton,
} from "##/src/components/buttons/index.js";

const UpdateClient = ({
  open,
  onClose,
  onSave,
  theme,
  title,
  name = "",
  clientId,
  buttonLoading,
}) => {
  const [clientName, setClientName] = useState("");

  const handleChange = (event) => {
    setClientName(event.target.value);
  };

  useEffect(() => {
    setClientName(name);
  }, [name]);

  return (
    <Modal
      open={open[clientId] ?? false}
      onClose={() => onClose({ ...open, [clientId]: false })}
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
          label="Client name"
          value={clientName}
          onChange={handleChange}
        />
        {buttonLoading ? (
          <LoadingButton theme={theme} />
        ) : (
          <SaveButton
            onSave={() => onSave(clientName, clientId)}
            theme={theme}
          />
        )}
        <CloseButton
          onClose={() => onClose({ ...open, [clientId]: false })}
          theme={theme}
        />
      </Box>
    </Modal>
  );
};

export default UpdateClient;
