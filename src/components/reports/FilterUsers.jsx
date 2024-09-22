import React, { useRef } from "react";
import {
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
} from "@mui/material";
import { extractUniqueDevelopers } from "##/src/utility/report.js";

const FilterUsers = ({ allUsers, selectedUsers, setSelectedUsers }) => {
  const selectAllUsersRef = useRef(null);
  const filteredDevelopers = extractUniqueDevelopers(allUsers);

  const handleSelectAllUsers = (event) => {
    const isChecked = event.target.checked;
    if (isChecked) {
      setSelectedUsers(filteredDevelopers.map((user) => user.userId));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleUsersChange = (event) => {
    if (!event.target.value.includes("all")) {
      setSelectedUsers(event.target.value);
    }
  };

  const renderUserLabel = (selected) => {
    if (selected.length === filteredDevelopers.length) {
      return "All selected";
    } else if (selected.length > 0) {
      return `${selected.length} selected`;
    } else {
      return ["Select User"];
    }
  };

  const handleMenuItemClick = (event) => {
    if (event.target.tagName !== "INPUT") {
      const allCheckbox = selectAllUsersRef.current;
      allCheckbox.checked = !selectAllUsersRef.current.checked;
      handleSelectAllUsers({ target: allCheckbox });
    }
  };

  return (
    <FormControl sx={{ flex: 1 }}>
      <InputLabel>Select User</InputLabel>
      <Select
        variant="standard"
        multiple
        value={selectedUsers}
        onChange={handleUsersChange}
        label="Select User"
        renderValue={(selected) => renderUserLabel(selected)}
      >
        <MenuItem
          value="all"
          onClick={handleMenuItemClick}
          input={<Checkbox inputRef={selectAllUsersRef} />}
        >
          <Checkbox
            inputRef={selectAllUsersRef}
            checked={selectedUsers.length === filteredDevelopers.length}
            onChange={handleSelectAllUsers}
          />
          <ListItemText primary="Select All" />
        </MenuItem>
        {filteredDevelopers?.map((developer) => (
          <MenuItem
            key={developer.userId}
            value={developer.userId}
            sx={{ marginLeft: "20px", height: "35px" }}
          >
            <Checkbox checked={selectedUsers.includes(developer.userId)} />
            <ListItemText primary={developer.name} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default FilterUsers;
