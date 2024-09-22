import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import AddClient from "##/src/components/client/AddClient.jsx";
import { addClient } from "##/src/app/clientSlice.js";
import { CloseButton, SaveButton } from "##/src/components/buttons/index.js";
import { useDispatch } from "react-redux";
import { notify } from "##/src/app/alertSlice.js";
import { capitalizeFirstWord } from "##/src/utility/miscellaneous/capitalize.js";

const CreateProject = ({
  open,
  onClose,
  onSave,
  theme,
  clients = [],
  users = [],
  user,
}) => {
  const [projectName, setProjectName] = useState("");
  const [projectTime, setProjectTime] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [client, setClient] = useState("");
  const [isNewClient, setIsNewClient] = useState(false);
  const [addProjectModalOpen, setAddProjectModalOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const selectAllRef = useRef(null);
  const dispatchToRedux = useDispatch();

  const handleNameChange = (event) => {
    setProjectName(event.target.value);
  };

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
    if (!event.target.value.includes("all")) {
      setSelectedUsers(event.target.value);
    }
  };

  const handleProjectModalOpen = () => {
    setAddProjectModalOpen(true);
  };

  const handleAddClientClose = () => {
    setAddProjectModalOpen(false);
  };

  const handleAddClientSave = async (clientName) => {
    await dispatchToRedux(
      addClient({
        clientName,
        userId: user._id,
        workspaceId: user.currentWorkspace,
      }),
    );
    setIsNewClient(true);
    setAddProjectModalOpen(false);
  };

  const handleSelectAll = (event) => {
    const isChecked = event.target.checked;
    if (isChecked) {
      setSelectedUsers(users.map((user) => user._id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleMenuItemClick = (event) => {
    if (event.target.tagName !== "INPUT") {
      const allCheckbox = selectAllRef.current;
      allCheckbox.checked = !selectAllRef.current.checked;
      handleSelectAll({ target: allCheckbox });
    }
  };
  const renderUserLabel = (selected) => {
    if (selected.length === users.length) {
      return "All selected";
    } else if (selected.length > 0) {
      return `${selected.length} selected`;
    } else {
      return ["Select Team"];
    }
  };

  const handleSave = async () => {
    if (
      projectName.trim() === "" ||
      projectTime.trim() === "" ||
      projectDescription.trim() === "" ||
      client.trim() === "" ||
      selectedUsers.length === 0
    ) {
      dispatchToRedux(
        notify({
          type: "error",
          message:
            "Please fill in all required fields: Project Name, Project Time, Project Description, Client, and select at least one User.",
        }),
      );
      return;
    }
    setLoading(true);
    await onSave(
      projectName,
      projectTime,
      projectDescription,
      client,
      selectedUsers,
    );
    setLoading(false);
    onClose();
    setProjectName("");
    setProjectTime("");
    setProjectDescription("");
    setClient("");
    setSelectedUsers([]);
  };

  // setting the client id as selected client after adding a new client
  useEffect(()=>{
    if(clients.length && isNewClient){
      setClient(clients[clients.length-1]._id);
      setIsNewClient(false);
    }
  },[clients, isNewClient]);

  useEffect(()=>{
    if(user && users.length && !selectedUsers.length){
      setSelectedUsers( [...selectedUsers, user._id]);
    }
  },[user, users]);

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
            color: theme?.secondaryColor,
            fontSize: "18px",
            paddingTop: "10px",
          }}
        >
          Add New Project
        </Typography>
        <TextField
          sx={{ width: "96%" }}
          variant="standard"
          label="Project name"
          value={projectName}
          onChange={handleNameChange}
        />
        <TextField
          sx={{ width: "96%" }}
          variant="standard"
          label="Project estimated time (Hours)"
          type="number"
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
            <MenuItem
              value=""
              onClick={handleProjectModalOpen}
              sx={{ color: theme?.secondaryColor }}
            >
              + Add Client
            </MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ width: "96%" }}>
          <InputLabel>Select Team</InputLabel>
          <Select
            multiple
            value={selectedUsers}
            onChange={handleUsersChange}
            label="Select Team"
            renderValue={(selected) => renderUserLabel(selected)}
          >
            <MenuItem
              value="all"
              onClick={handleMenuItemClick}
              input={<Checkbox inputRef={selectAllRef} />}
            >
              <Checkbox
                inputRef={selectAllRef}
                checked={selectedUsers.length === users.length}
                onChange={handleSelectAll}
              />
              <ListItemText primary="Select All" />
            </MenuItem>
            {users.map((u) => {
              return (
                <MenuItem
                  key={u._id}
                  value={u._id}
                  sx={{ marginLeft: "20px", height: "35px" }}
                >
                  <Checkbox checked={selectedUsers.includes(u._id)} />
                  <ListItemText primary={capitalizeFirstWord(u.name)} />
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        {loading ? (
          <Button
            variant="contained"
            sx={{
              backgroundColor: theme?.secondaryColor,
              width: "96%",
              fontSize: "16px",
              ":hover": {
                backgroundColor: theme?.secondaryColor,
              },
            }}
          >
            <CircularProgress color="inherit" />
          </Button>
        ) : (
          <SaveButton onSave={handleSave} theme={theme} />
        )}
        <CloseButton onClose={onClose} theme={theme} />
        <AddClient
          open={addProjectModalOpen}
          onClose={handleAddClientClose}
          onSave={handleAddClientSave}
          theme={theme}
        />
      </Box>
    </Modal>
  );
};

export default CreateProject;
