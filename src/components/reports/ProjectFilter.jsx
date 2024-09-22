import React, { useRef } from "react";
import {
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
} from "@mui/material";

const ProjectFilter = ({  projects, selectedProjects, onSelect }) => {
  const selectAllProjectsRef = useRef(null);

  const handleSelectAllProjects = (event) => {
    const isChecked = event.target.checked;
    if (isChecked) {
      onSelect(projects.map((project) => project._id));
    } else {
      onSelect([]);
    }
  };

  const handleProjectsChange = (event) => {
    if (!event.target.value.includes("all")) {
      onSelect(event.target.value);
    }
  };

  const renderProjectLabel = (selected) => {
    if (selected.length === projects.length) {
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
            checked={selectedProjects.length === projects.length}
            onChange={handleSelectAllProjects}
          />
          <ListItemText primary="Select All" />
        </MenuItem>
        {projects.map((project) => (
          <MenuItem
            key={project._id}
            value={project._id}
            sx={{ marginLeft: "20px", height: "35px" }}
          >
            <Checkbox checked={selectedProjects.includes(project._id)} />
            <ListItemText primary={project.name} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default ProjectFilter;
