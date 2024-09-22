import React, { useState } from "react";
import { Box, Modal, TextField, Typography } from "@mui/material";
import {
  CloseButton,
  LoadingButton,
  SaveButton,
} from "##/src/components/buttons/index.js";
import { useDispatch, useSelector } from "react-redux";
import { createWorkspace } from "##/src/app/workspaceSlice.js";
import { selectMe } from "##/src/app/profileSlice.js";
import { selectCurrentTheme } from "##/src/app/themeSlice.js";
import { notify } from "##/src/app/alertSlice.js";

const AddWorkspaceModal = ({ open, handleClose, setProgress }) => {
  const [name, setName] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false);
  const dispatchToRedux = useDispatch();
  const user = useSelector(selectMe);
  const theme = useSelector(selectCurrentTheme);

  const handleSubmit = async () => {
    try {
      if (name.trim() === "") {
        dispatchToRedux(
          notify({
            type: "info",
            message: "Please enter a workspace name",
          }),
        );
        return;
      }
      setProgress(30);
      setButtonLoading(true);
      await dispatchToRedux(createWorkspace({ userId: user._id, name })).unwrap();
      dispatchToRedux(
        notify({ type: "success", message: "Workspace created successfully" }),
      );
      handleClose();
      setProgress(100);
      setButtonLoading(false);
      setName("");
    } catch (error) {
      setProgress(100);
      setName("");
      setButtonLoading(false);
      dispatchToRedux(
        notify({
          type: "error",
          message: `Failed to create workspace, ${error.message}`,
        }),
      );
    }
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
            color: theme?.secondaryColor,
            fontSize: "18px",
            paddingTop: "10px",
          }}
        >
          Add Workspace
        </Typography>
        <TextField
          sx={{ width: "96%" }}
          variant="standard"
          label="Workspace name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {buttonLoading ? (
          <LoadingButton theme={theme} />
        ) : (
          <SaveButton onSave={handleSubmit} theme={theme} />
        )}
        <CloseButton onClose={handleClose} theme={theme} />
      </Box>
    </Modal>
  );
};
export default AddWorkspaceModal;
