import React, { useRef } from "react";
import {
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
} from "@mui/material";
import { extractUniqueClients } from "##/src/utility/report.js";

const FilterClients = ({ allClients, selectedClients, setSelectedClients }) => {
  const selectAllRef = useRef(null);
  const filteredClient = extractUniqueClients(allClients);
  const handleSelectAll = (event) => {
    const isChecked = event.target.checked;
    if (isChecked) {
      setSelectedClients(filteredClient.map((client) => client._id));
    } else {
      setSelectedClients([]);
    }
  };

  const handleClientsChange = (event) => {
    if (!event.target.value.includes("all")) {
      setSelectedClients(event.target.value);
    }
  };

  const renderClientLabel = (selected) => {
    if (selected.length === filteredClient.length) {
      return "All selected";
    } else if (selected.length > 0) {
      return `${selected.length} selected`;
    } else {
      return ["Select Client"];
    }
  };

  const handleMenuItemClick = (event) => {
    if (event.target.tagName !== "INPUT") {
      const allCheckbox = selectAllRef.current;
      allCheckbox.checked = !selectAllRef.current.checked;
      handleSelectAll({ target: allCheckbox });
    }
  };

  return (
    <FormControl sx={{ flex: 1 }}>
      <InputLabel>Select Client</InputLabel>
      <Select
        variant="standard"
        multiple
        value={selectedClients}
        onChange={handleClientsChange}
        label="Select Client"
        renderValue={(selected) => renderClientLabel(selected)}
      >
        <MenuItem
          value="all"
          onClick={handleMenuItemClick}
          input={<Checkbox inputRef={selectAllRef} />}
        >
          <Checkbox
            inputRef={selectAllRef}
            checked={selectedClients.length === filteredClient.length}
            onChange={handleSelectAll}
          />
          <ListItemText primary="Select All" />
        </MenuItem>
        {filteredClient.map((client) => (
          <MenuItem
            key={client._id}
            value={client._id}
            sx={{ marginLeft: "20px", height: "35px" }}
          >
            <Checkbox checked={selectedClients.includes(client._id)} />
            <ListItemText primary={client.name} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default FilterClients;
