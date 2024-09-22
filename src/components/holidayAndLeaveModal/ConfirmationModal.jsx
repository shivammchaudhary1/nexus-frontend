import React from "react";
import {
  Box,
  Button,
  CircularProgress,
  Modal,
  Typography,
} from "@mui/material";
import { CloseButton } from "##/src/components/buttons/index.js";

const ConfirmationModal = ({
  open,
  onClose,
  onConfirm,
  actionType,
  theme,
  buttonLoading,
  rejectionReason,
  setRejectionReason,
}) => {
  return (
    <>
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
            {`Confirm ${actionType} Leave`}
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
            {`Are you sure you want to ${actionType.toLowerCase()} this leave?`}
          </Typography>
          {actionType === "Reject" && (
            <textarea
              placeholder="Enter rejection reason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              style={{
                width: "96%",
                minHeight: "60px",
                fontSize: "14px",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                resize: "vertical",
                marginTop: "10px",
              }}
            />
          )}
          <Button
            onClick={onConfirm}
            variant="contained"
            disabled={buttonLoading}
            sx={{
              backgroundColor: theme?.secondaryColor,
              width: "96%",
              fontSize: "16px",
              ":hover": {
                backgroundColor: theme?.secondaryColor,
              },
            }}
          >
            {buttonLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : actionType === "Apply" ? (
              "Apply"
            ) : actionType === "Approve" ? (
              "Approve"
            ) : (
              "Reject"
            )}
          </Button>
          <CloseButton onClose={onClose} theme={theme} />
        </Box>
      </Modal>
    </>
  );
};

export default ConfirmationModal;
