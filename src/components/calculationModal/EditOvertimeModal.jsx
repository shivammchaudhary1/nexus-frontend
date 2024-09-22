import React, { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { CloseButton, SaveButton } from "##/src/components/buttons/index.js";

const EditOvertimeModal = ({
  isOpen,
  onClose,
  overtimeData,
  onUpdate,
  theme,
}) => {
  const [editedOvertime, setEditedOvertime] = useState({
    hours: overtimeData?.overtime.hours || 0,
    minutes: overtimeData?.overtime.minutes || 0,
    seconds: overtimeData?.overtime.seconds || 0,
  });

  useEffect(() => {
    setEditedOvertime({
      hours: overtimeData?.overtime.hours || 0,
      minutes: overtimeData?.overtime.minutes || 0,
      seconds: overtimeData?.overtime.seconds || 0,
    });
  }, [overtimeData]);

  const handleClose = () => {
    onClose();
  };

  const handleUpdate = () => {
    onUpdate({
      ...overtimeData,
      overtime: editedOvertime,
    });
    onClose();
  };

  return (
    <Modal
      open={isOpen}
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
            fontSize: "18px",
            paddingTop: "10px",
          }}
        >
          Edit Overtime
        </Typography>
        {/* Display and allow editing of overtime data */}
        <Box
          sx={{
            display: "flex",
            gap: "10px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TextField
            label="Overtime Hours"
            type="number"
            value={editedOvertime.hours}
            onChange={(e) =>
              setEditedOvertime({
                ...editedOvertime,
                hours: +e.target.value,
              })
            }
          />
          <TextField
            label="Overtime Minutes"
            type="number"
            value={editedOvertime.minutes}
            onChange={(e) =>
              setEditedOvertime({
                ...editedOvertime,
                minutes: +e.target.value,
              })
            }
          />
          <TextField
            label="Overtime Seconds"
            type="number"
            value={editedOvertime.seconds}
            onChange={(e) =>
              setEditedOvertime({
                ...editedOvertime,
                seconds: +e.target.value,
              })
            }
          />
        </Box>
        <SaveButton onSave={handleUpdate} theme={theme} />
        <CloseButton onClose={handleClose} theme={theme} />
      </Box>
    </Modal>
  );
};

export default EditOvertimeModal;
