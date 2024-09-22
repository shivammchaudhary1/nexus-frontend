import React, { useEffect, useState } from "react";
import { Box, Modal, TextField, Typography } from "@mui/material";
import {
  CloseButton,
  LoadingButton,
  SaveButton,
} from "##/src/components/buttons/index.js";
import { useDispatch, useSelector } from "react-redux";
import { updateWorkspace } from "##/src/app/workspaceSlice.js";
import { selectCurrentTheme } from "##/src/app/themeSlice.js";
import { notify } from "##/src/app/alertSlice.js";

const EditWorkspaceModal = ({ open, handleClose, workspace, setProgress }) => {
  const [name, setName] = useState(workspace?.name || "");
  const [buttonLoading, setButtonLoading] = useState(false);
  const dispatchToRedux = useDispatch();
  const theme = useSelector(selectCurrentTheme);

  useEffect(() => {
    if (workspace?.name !== undefined) {
      setName(workspace.name.replace("'s workspace", ""));
    }
  }, [workspace]);

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
      let tempName = name + "'s workspace";
      setProgress(30);
      setButtonLoading(true);
      await dispatchToRedux(
        updateWorkspace({
          name: tempName,
          workspaceId: workspace._id,
        }),
      );
      dispatchToRedux(
        notify({ type: "success", message: "Workspace Edited successfully" }),
      );

      handleClose();
      setProgress(100);
      setButtonLoading(false);
      setName("");
    } catch (error) {
      dispatchToRedux(
        notify({
          type: "error",
          message: `Error updating workspace, ${error.message}`,
        }),
      );
      setProgress(100);
      setButtonLoading(false);
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
          Edit Workspace
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
export default EditWorkspaceModal;
