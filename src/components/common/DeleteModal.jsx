import { Box, Modal, Typography } from "@mui/material";
import React from "react";
import { CloseButton, DeleteButton } from "##/src/components/buttons/index.js";
import { LoadingButton } from "../buttons/LoadingButton";

const DeleteModal = ({
  open,
  onClose,
  onDelete,
  title,
  text,
  theme,
  buttonLoading,
}) => {
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
            textAlign: "left",
            fontSize: "18px",
            paddingTop: "20px",
            paddingBottom: "30px",
          }}
        >
          {title}
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
          {text}
        </Typography>

        {buttonLoading ? (
          <LoadingButton theme={theme} />
        ) : (
          <DeleteButton onDelete={onDelete} theme={theme} />
        )}
        <CloseButton onClose={onClose} theme={theme} />
      </Box>
    </Modal>
  );
};

export default DeleteModal;
