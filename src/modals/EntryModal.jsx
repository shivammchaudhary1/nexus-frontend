import React, { useState } from "react";
import {
  Box,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Tab,
  Tabs,
  TextField,
} from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { useDispatch, useSelector } from "react-redux";
import { updateEntry } from "##/src/app/timerSlice";
import { selectMe } from "##/src/app/profileSlice.js";
import { CloseButton, SaveButton } from "##/src/components/buttons/index.js";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import {
  areTimeIntervalsNonOverlapping,
  calculateTotalDurationInSeconds,
} from "##/src/utility/timer.js";
import "./entryModal.css";
import { notify } from "##/src/app/alertSlice.js";
import { selectProjects } from "##/src/app/projectSlice.js";
import { addManualEntry } from "##/src/app/timerSlice.js";
const EditEntryModal = ({ open, handleClose, entry, theme, setProgress }) => {
  const dispatchToRedux = useDispatch();
  const Projects = useSelector(selectProjects);
  const user = useSelector(selectMe);
  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState({
    date: "",
    project: "",
    title: "",
    startTime: "",
    endTime: "",
  });
  const [selectProject, setSelectProject] = useState("");

  // State for time pickers
  const [startTimes, setStartTimes] = useState(entry.startTime.map(dayjs));
  const [endTimes, setEndTimes] = useState(entry.endTime.map(dayjs));

  const handleFieldChange = (fieldName, value) => {
    setFormData({
      ...formData,
      [fieldName]: value,
    });
  };
  const timeFormat = "HH:mm";

  const handleNewEntrySubmit = async () => {
    if (!isValidNewEntry()) {
      return;
    }

    const [year, month, day] = formData.date.split("-");
    const [startHour, startMinute] = formData.startTime.split(":");
    const [endHour, endMinute] = formData.endTime.split(":");

    const startTime = new Date(year, month - 1, day, startHour, startMinute).toISOString();
    const endTime = new Date(year, month - 1, day, endHour, endMinute).toISOString();
    
    const newEntry = {
      createdAt: new Date(formData.date).toISOString(),
      projectId: selectProject._id,
      title: formData.title,
      startTime,
      endTime,
      workspaceId: selectProject.workspace,
      userId: user._id,
    };
    try {
      setProgress(30);
      await dispatchToRedux(addManualEntry({ newEntry })).unwrap();
      setProgress(100);
      dispatchToRedux(
        notify({ type: "success", message: "Entry Added Successfully" }),
      );
      handleClose();
    } catch (error) {
      setProgress(100);
      dispatchToRedux(
        notify({
          type: "error",
          message: `Error adding Entry, ${error.message}`,
        }),
      );
    }
  };

  //handle edge cases
  const isValidNewEntry = () => {
    const currentDate = new Date();
    const selectedDate = new Date(formData.date);
    const startTime = dayjs(formData.startTime, timeFormat).toDate();
    const endTime = dayjs(formData.endTime, timeFormat).toDate();

    if (
      !formData.date ||
      !selectProject ||
      !formData.title ||
      !formData.startTime ||
      !formData.endTime
    ) {
      dispatchToRedux(
        notify({
          type: "error",
          message: "Kindly complete all mandatory fields before proceeding.",
        }),
      );
      return false;
    }

    if (selectedDate > currentDate) {
      dispatchToRedux(
        notify({
          type: "error",
          message: "Selected date cannot be in the future.",
        }),
      );
      return false;
    }

    if (startTime > endTime) {
      dispatchToRedux(
        notify({
          type: "error",
          message: "Start time cannot be after end time.",
        }),
      );
      return false;
    }

    return true;
  };

  const handleProjectChange = (event) => {
    const selectedProjectId = event.target.value;
    setSelectProject(selectedProjectId);
  };

  const timePickers = entry.startTime.map((startTime, index) => {
    return (
      <Box key={index} sx={{ width: "100%", display: "flex", gap: "10px" }}>
        <TimePicker
          label={`Start Time ${index + 1}`}
          value={dayjs(startTimes[index])}
          onChange={(newValue) => {
            const updatedStartTimes = [...startTimes];
            updatedStartTimes[index] = dayjs(newValue);
            setStartTimes(updatedStartTimes);
          }}
          sx={{ "& input": { width: "50%" } }}
          className="no-clock-icon"
        />
        <TimePicker
          label={`End Time ${index + 1}`}
          value={dayjs(endTimes[index])}
          onChange={(newValue) => {
            const updatedEndTimes = [...endTimes];
            updatedEndTimes[index] = dayjs(newValue);
            setEndTimes(updatedEndTimes);
          }}
          sx={{ "& input": { width: "50%" }, marginLeft: "10px " }}
          className="no-clock-icon"
        />
      </Box>
    );
  });

  const handleSubmit = async () => {
    try {
      const startTimeArray = startTimes.map((time) =>
        new Date(time).toISOString(),
      );
      const endTimeArray = endTimes.map((time) => new Date(time).toISOString());

      if (areTimeIntervalsNonOverlapping(startTimeArray, endTimeArray)) {
        const tempEntry = { ...entry };
        tempEntry.startTime = startTimeArray;
        tempEntry.endTime = endTimeArray;
        tempEntry.durationInSeconds = calculateTotalDurationInSeconds(
          startTimeArray,
          endTimeArray,
        );
        await dispatchToRedux(updateEntry({ entry: tempEntry })).unwrap();
        dispatchToRedux(
          notify({ type: "success", message: "Entry updated successfully" }),
        );
        handleClose();
      } else {
        dispatchToRedux(
          notify({ type: "error", message: "Time entry should not overlap" }),
        );
      }
    } catch (error) {
      dispatchToRedux(
        notify({ type: "error", message: `Something went wrong, ${error.message}` }),
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
          width: "500px",
          borderRadius: "5px",
          gap: "12px",
          position: "relative",
          paddingBottom: "10px",
        }}
      >
        {/* Tabs for Entry and Add New Entry */}
        <Tabs
          TabIndicatorProps={{ sx: { backgroundColor: theme?.secondaryColor } }}
          value={tabValue}
          onChange={(event, newValue) => setTabValue(newValue)}
          sx={{
            mb: "20px",
            textAlign: "left",
            borderBottom: "1px solid #ddd",
          }}
        >
          <Tab
            label="Update Entry Logs"
            sx={{
              "&.Mui-selected": {
                color: "#000",
                borderLeft: "1px solid #eee",
                borderRight: "1px solid #eee",
              },
              fontSize: "16px",
              color: "#5a5a5a",
              textTransform: "capitalize",
            }}
          />
          <Tab
            label="Add Entry Log"
            sx={{
              "&.Mui-selected": {
                color: "#000",
                borderLeft: "1px solid #eee",
                borderRight: "1px solid #eee",
              },
              fontSize: "16px",
              color: "#5a5a5a",
              textTransform: "capitalize",
            }}
          />
        </Tabs>

        {tabValue === 0 && (
          <Container
            sx={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <TextField
              label="Select Date"
              type="date"
              variant="filled"
              value={dayjs(entry.createdAt).format("YYYY-MM-DD")}
              InputProps={{
                readOnly: true,
              }}
            />
            <TextField
              label="Project"
              type="text"
              variant="filled"
              value={entry.project.name}
              InputProps={{
                readOnly: true,
              }}
            />
            <TextField
              label="Title"
              type="text"
              variant="filled"
              value={
                entry.title
                  ? new DOMParser().parseFromString(entry.title, "text/html")
                    .body.textContent
                  : ""
              }
              InputProps={{
                readOnly: true,
              }}
            />
            <Box
              sx={{
                padding: "10px",
                maxHeight: "25vh",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                overflowY: "scroll",
              }}
            >
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                {timePickers}
              </LocalizationProvider>{" "}
            </Box>
            <SaveButton onSave={handleSubmit} theme={theme} />
            <CloseButton
              onClose={handleClose}
              theme={theme}
              cs={{ width: "30px", height: "30px" }}
            />
          </Container>
        )}

        {tabValue === 1 && (
          <Container
            sx={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <TextField
              type="date"
              variant="standard"
              value={formData.date}
              onChange={(e) => handleFieldChange("date", e.target.value)}
            />

            <FormControl variant="standard">
              <InputLabel>Select Project</InputLabel>
              <Select
                value={selectProject}
                onChange={handleProjectChange}
                label="Project"
              >
                {Projects.map((project) => (
                  <MenuItem key={project._id} value={project}>
                    {project.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Title"
              type="text"
              variant="standard"
              value={formData.title}
              onChange={(e) => handleFieldChange("title", e.target.value)}
            />
            <Box sx={{ width: "100%", display: "flex", gap: "10px" }}>
              <TextField
                type="time"
                sx={{ width: "50%" }}
                value={formData.startTime}
                onChange={(e) => handleFieldChange("startTime", e.target.value)}
              />
              <TextField
                type="time"
                sx={{ width: "50%" }}
                value={formData.endTime}
                onChange={(e) => handleFieldChange("endTime", e.target.value)}
              />
            </Box>
            <SaveButton onSave={handleNewEntrySubmit} theme={theme} />
            <CloseButton
              onClose={handleClose}
              theme={theme}
              cs={{ width: "30px", height: "30px" }}
            />
          </Container>
        )}
      </Box>
    </Modal>
  );
};

export default EditEntryModal;
