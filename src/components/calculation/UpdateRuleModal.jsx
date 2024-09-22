import React, { useState } from "react";
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  ListItemText,
  MenuItem,
  Modal,
  Select,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { CloseButton, SaveButton } from "##/src/components/buttons/index.js";

const UpdateRuleModal = ({ open, onClose, onUpdate, theme }) => {
  const [weekDays, setWeekDays] = useState([]);
  const [workingHours, setWorkingHours] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [workingDays, setWorkingDays] = useState(0);

  const handleWeekDaysChange = (event) => {
    setWeekDays(event.target.value);
    setWorkingDays(event.target.value.length);
  };

  const handleWorkingHoursChange = (event) => {
    setWorkingHours(event.target.value);
  };

  const handleToggleChange = () => {
    setIsActive(!isActive);
  };

  const handleUpdate = async () => {
    const formData = {
      weekDays,
      workingHours,
      isActive,
      workingDays,
    };

    // Pass the form data to the onUpdate function
    await onUpdate(formData);

    // Close the modal after submitting
    await onClose();
  };

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
              fontSize: "18px",
              paddingTop: "10px",
            }}
          >
            Update Default Rule
          </Typography>
          <FormControl sx={{ width: "96%" }}>
            <InputLabel>Working Days</InputLabel>
            <Select
              multiple
              value={weekDays}
              onChange={handleWeekDaysChange}
              label="Working Days"
              renderValue={(selected) => (
                <div>
                  {selected.map((value) => (
                    <span key={value}>{value}, </span>
                  ))}
                </div>
              )}
            >
              {[
                "monday",
                "tuesday",
                "wednesday",
                "thursday",
                "friday",
                "saturday",
                "sunday",
              ].map((day) => (
                <MenuItem key={day} value={day}>
                  <Checkbox checked={weekDays.includes(day)} />
                  <ListItemText primary={day} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            sx={{ width: "96%" }}
            variant="standard"
            label="Working Hours"
            type="number"
            value={workingHours}
            onChange={handleWorkingHoursChange}
          />

          <TextField
            sx={{ width: "96%" }}
            variant="standard"
            label="Working Days"
            type="number"
            value={workingDays}
            onChange={handleWorkingHoursChange}
          />
          <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Typography>{isActive ? "Active" : "Inactive"}</Typography>
            <FormControlLabel
              control={
                <Switch checked={isActive} onChange={handleToggleChange} />
              }
            />
          </Box>

          <SaveButton onSave={handleUpdate} theme={theme} />
          <CloseButton onClose={onClose} theme={theme} />
        </Box>
      </Modal>
    </>
  );
};

export default UpdateRuleModal;
