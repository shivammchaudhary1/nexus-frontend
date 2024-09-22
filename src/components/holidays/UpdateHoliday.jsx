import React, { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { CloseButton, SaveButton } from "##/src/components/buttons/index.js";

const UpdateHoliday = ({
  open,
  handleClose,
  handleUpdateHoliday,
  theme,
  holidayId,
  selectedHoliday,
}) => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");

  useEffect(() => {
    setTitle(selectedHoliday?.title || "");
    const formattedDate = selectedHoliday?.date
      ? new Date(selectedHoliday.date).toISOString().split("T")[0]
      : "";
    setDate(formattedDate);
    setDescription(selectedHoliday?.description || "");
    setType(selectedHoliday?.type || "");
  }, [selectedHoliday]);

  const handleUpdate = () => {
    handleUpdateHoliday({ holidayId, title, date, description, type });
    setTitle("");
    setDate("");
    setDescription("");
    setType("");
    handleClose();
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
        className="modal-content"
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
          Update Holiday
        </Typography>
        <TextField
          sx={{ width: "96%" }}
          variant="standard"
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          sx={{ width: "96%" }}
          variant="standard"
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          sx={{ width: "96%" }}
          variant="standard"
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <FormControl sx={{ width: "96%" }}>
          <InputLabel>Select Type</InputLabel>
          <Select
            value={type}
            onChange={(e) => setType(e.target.value)}
            label="type"
          >
            <MenuItem value="Gazetted">Gazetted</MenuItem>
            <MenuItem value="Restricted">Restricted</MenuItem>
            {/* <MenuItem value="Other">Other</MenuItem> */}
          </Select>
        </FormControl>
        <SaveButton onSave={handleUpdate} theme={theme} />
        <CloseButton onClose={handleClose} theme={theme} />
      </Box>
    </Modal>
  );
};

export default UpdateHoliday;
