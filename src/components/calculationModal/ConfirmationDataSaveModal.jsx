import React from "react";
import { Box, Modal, Typography } from "@mui/material";
import {
  CloseButton,
  LoadingButton,
  SaveButton,
} from "##/src/components/buttons/index.js";

const ConfirmationDataSaveModal = ({
  isOpen,
  onClose,
  onConfirm,
  theme,
  buttonLoading,
}) => {
  return (
    <Modal
      open={isOpen}
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
            fontSize: "18px",
            paddingTop: "10px",
          }}
        >
          Confirm Save Data
        </Typography>

        <Typography
          sx={{
            color: "#000",
            fontSize: "18px",
            paddingTop: "0px",
            paddingLeft: "10px",
            paddingBottom: "30px",
          }}
        >
          Are you sure you want to confirm and save the monthly report? After
          saving overtime balance will be added.
        </Typography>
        {buttonLoading ? (
          <LoadingButton theme={theme} />
        ) : (
          <SaveButton onSave={onConfirm} theme={theme} />
        )}
        <CloseButton onClose={onClose} theme={theme} />
      </Box>
    </Modal>
  );
};

export default ConfirmationDataSaveModal;
