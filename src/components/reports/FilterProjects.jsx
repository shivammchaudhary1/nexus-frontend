import React, { useRef } from "react";
import {
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
} from "@mui/material";

const FilterProjects = ({ allProjects, selectedProjects, setSelectedProjects }) => {
  const selectAllProjectsRef = useRef(null);

  const handleSelectAllProjects = (event) => {
    const isChecked = event.target.checked;
    if (isChecked) {
      setSelectedProjects(allProjects.map((project) => project._id));
    } else {
      setSelectedProjects([]);
    }
  };

  const handleProjectsChange = (event) => {
    if (!event.target.value.includes("all")) {
      setSelectedProjects(event.target.value);
    }
  };

  const renderProjectLabel = (selected) => {
    if (selected.length === allProjects.length) {
      return "All selected";
    } else if (selected.length > 0) {
      return `${selected.length} selected`;
    } else {
      return ["Select Project"];
    }
  };

  const handleMenuItemClick = (event) => {
    if (event.target.tagName !== "INPUT") {
      const allCheckbox = selectAllProjectsRef.current;
      allCheckbox.checked = !selectAllProjectsRef.current.checked;
      handleSelectAllProjects({ target: allCheckbox });
    }
  };

  return (
    <FormControl sx={{ flex: 1 }}>
      <InputLabel>Select Project</InputLabel>
      <Select
        variant="standard"
        multiple
        value={selectedProjects}
        onChange={handleProjectsChange}
        label="Select Project"
        renderValue={(selected) => renderProjectLabel(selected)}
      >
        <MenuItem
          value="all"
          onClick={handleMenuItemClick}
          input={<Checkbox inputRef={selectAllProjectsRef} />}
        >
          <Checkbox
            inputRef={selectAllProjectsRef}
            checked={selectedProjects.length === allProjects.length}
            onChange={handleSelectAllProjects}
          />
          <ListItemText primary="Select All" />
        </MenuItem>
        {allProjects.map((project) => (
          <MenuItem
            key={project._id}
            value={project._id}
            sx={{ marginLeft: "20px", height: "35px" }}
          >
            <Checkbox checked={selectedProjects.includes(project._id)} />
            <ListItemText primary={project.projectDetails.name} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default FilterProjects;
