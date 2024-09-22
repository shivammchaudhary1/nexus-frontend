import {
  Box,
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  CloseButton,
  LoadingButton,
  SaveButton,
} from "##/src/components/buttons/index.js";
import { capitalizeFirstWord } from "##/src/utility/miscellaneous/capitalize.js";

const UpdateProject = ({
  open,
  onClose,
  onUpdate,
  theme,
  project = {},
  clients = [],
  users = [],
}) => {
  const [projectName, setProjectName] = useState("");
  const [projectTime, setProjectTime] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [client, setClient] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [buttonLoading, setButtonLoading] = useState(false);

  const handleChange = (event) => {
    setProjectName(event.target.value);
  };

  useEffect(() => {
    setProjectName(project.name || "");
    setProjectTime(project.estimatedHours || "");
    setProjectDescription(project.description || "");
    setClient(project.client || "");
    setSelectedUsers(project.team || []);
  }, [project]);

  const handleTimeChange = (event) => {
    setProjectTime(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setProjectDescription(event.target.value);
  };

  const handleClientChange = (event) => {
    setClient(event.target.value);
  };

  const handleUsersChange = (event) => {
    setSelectedUsers(event.target.value);
  };

  const handleSave = async () => {
    setButtonLoading(true);
    await onUpdate({
      projectName,
      projectTime,
      projectDescription,
      client,
      selectedUsers,
      projectId: project._id,
    });
    setButtonLoading(false);
    onClose();
  };

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
            fontSize: "18px",
            paddingTop: "10px",
          }}
        >
          Update Project
        </Typography>
        <TextField
          sx={{ width: "96%" }}
          variant="standard"
          label="Project name"
          value={projectName}
          onChange={handleChange}
        />
        <TextField
          sx={{ width: "96%" }}
          variant="standard"
          label="Project estimated time"
          value={projectTime}
          onChange={handleTimeChange}
        />
        <TextField
          sx={{ width: "96%" }}
          variant="standard"
          label="Project description"
          value={projectDescription}
          onChange={handleDescriptionChange}
        />
        <FormControl sx={{ width: "96%" }}>
          <InputLabel>Client</InputLabel>
          <Select value={client} onChange={handleClientChange} label="Client">
            {clients.map((client) => (
              <MenuItem key={client._id} value={client._id}>
                {capitalizeFirstWord(client.name)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ width: "96%" }}>
          <InputLabel>Select Team</InputLabel>
          <Select
            multiple
            value={selectedUsers}
            onChange={handleUsersChange}
            label="Select Team"
            renderValue={(selected) => (
              <div>
                {selected.map((value) => (
                  <span key={value}>
                    {capitalizeFirstWord(
                      users.find((user) => user._id === value).name || "",
                    )}
                    {", "}
                  </span>
                ))}
              </div>
            )}
          >
            {users.length && users.map((user) => (
              <MenuItem key={user._id} value={user._id}>
                <Checkbox checked={selectedUsers.includes(user._id)} />
                <ListItemText primary={capitalizeFirstWord(user.name)} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {buttonLoading ? (
          <LoadingButton theme={theme} />
        ) : (
          <SaveButton onSave={handleSave} theme={theme} />
        )}
        <CloseButton onClose={onClose} theme={theme} />
      </Box>
    </Modal>
  );
};

export default UpdateProject;
