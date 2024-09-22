import React, { useEffect, useState } from "react";
import { Box, IconButton, Input, MenuItem, Select } from "@mui/material";
import { PlayArrow, Stop } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  changeWorkspace,
  selectUserRole,
  selectWorkspace,
} from "##/src/app/workspaceSlice.js";
import {
  inputTextChange,
  optionHandle,
  selectTimer,
  setEntryDay,
  startTimer,
  stopTimer,
} from "##/src/app/timerSlice.js";
import { addProject } from "##/src/app/projectSlice.js";
import { selectCurrentTheme, setTheme } from "##/src/app/themeSlice.js";
import { selectMe } from "##/src/app/profileSlice.js";
import CreateProject from "##/src/components/project/AddProject.jsx";
import Timer from "##/src/components/header/Timer";
import { notify } from "##/src/app/alertSlice.js";
import CircularProgress from "@mui/material/CircularProgress";
import { startLoading, stopLoading } from "##/src/app/loadingSlice.js";
import LoadingBar from "react-top-loading-bar";
import { capitalizeFirstWord } from "##/src/utility/miscellaneous/capitalize.js";
import { selectClients } from "##/src/app/clientSlice.js";
import { selectProjects } from "##/src/app/projectSlice.js";
import { selectUserDetails } from "##/src/app/userDetailsSlice.js";

const Header = () => {
  const theme = useSelector(selectCurrentTheme);
  const workspaceClients = useSelector(selectClients);
  const workspaceProjects = useSelector(selectProjects);
  const user = useSelector(selectMe);
  const workspace = useSelector(selectWorkspace);
  const isAdmin = useSelector(selectUserRole);
  const users = useSelector(selectUserDetails);

  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isNewProject, setIsNewProject] = useState(false);

  const dispatchToRedux = useDispatch();

  const { option: optionState, text } = useSelector(selectTimer);

  // setting the project id as selected project after adding a new project
  useEffect(() => {
    if (workspaceProjects.length && isNewProject) {
      dispatchToRedux(
        optionHandle({
          option: workspaceProjects[workspaceProjects.length - 1]._id,
        }),
      );
      setIsNewProject(false);
    }
  }, [workspaceProjects, isNewProject]);

  useEffect(() => {
    // Handles setting the theme for the current user's workspace.
    // Retrieves the theme based on the current workspace ID and dispatches the theme to Redux.
    async function handleSetTheme() {
      dispatchToRedux(stopLoading());
      try {
        // Find the workspace theme that matches the current workspace ID
        const { theme: themeId } =
          user.workspaceThemes.length &&
          user.workspaceThemes.find(
            (workspaceTheme) =>
              workspaceTheme.workspaceId === user.currentWorkspace,
          );
        if (themeId) {
          await dispatchToRedux(setTheme({ themeId }));
        } else {
          dispatchToRedux(stopLoading());
        }
      } catch (error) {
        dispatchToRedux(notify({ type: "error", message: error.message }));
      }
      dispatchToRedux(stopLoading());
    }

    dispatchToRedux(startLoading());

    if (workspace?.selectedWorkspace) {
      handleSetTheme();
    }
  }, [workspace.selectedWorkspace, user]);

  const handleClose = () => setOpen(false);

  const handleTextChange = (event) => {
    dispatchToRedux(inputTextChange({ text: event.target.value }));
  };

  const handleOptionChange = (event) => {
    if (event.target.value === "add-project") {
      setOpen(true);
    } else {
      dispatchToRedux(optionHandle({ option: event.target.value }));
    }
  };

  const handleAddProject = async (
    projectName,
    projectTime,
    projectDescription,
    client,
    selectedUsers,
  ) => {
    try {
      setProgress(30);
      await dispatchToRedux(
        addProject({
          data: {
            name: projectName,
            estimatedHours: projectTime,
            description: projectDescription,
            client,
            team: selectedUsers,
            workspace: user.currentWorkspace,
            user: user._id,
          },
        }),
      ).unwrap();
      setProgress(100);
      setOpen(false);

      dispatchToRedux(
        notify({ type: "success", message: "Project Added Successfully" }),
      );
      setIsNewProject(true);
    } catch (error) {
      setProgress(100);
      dispatchToRedux(
        notify({
          type: "error",
          message: "Error adding project. Please try again.",
        }),
      );
    }
  };

  /**
   * Handles the start action.
   *
   * If an option is not selected, it notifies the user to select a project.
   * Otherwise, it dispatches the startTimer action with the selected project, user ID, and title.
   */
  const handleStart = async () => {
    if (optionState === "null") {
      dispatchToRedux(
        notify({ type: "error", message: "Please select project" }),
      );
      return;
    }
    setLoading(true);
    const payload = {
      projectId: optionState,
      userId: user._id,
      title: text || "",
    };

    try {
      await dispatchToRedux(startTimer(payload)).unwrap();
    } catch (error) {
      dispatchToRedux(notify({ type: "error", message: error.message }));
    }
    setLoading(false);
  };

  /**
   * Handles the stop event of the timer.
   */
  const handleStop = async () => {
    // Check if the title is not empty
    if (!text) {
      const errorMessage = "Please add a title to stop the timer";
      dispatchToRedux(notify({ type: "error", message: errorMessage }));
      return;
    }

    setLoading(true);

    try {
      // Dispatch the stopTimer action with the title and projectId
      await dispatchToRedux(
        stopTimer({ title: text, projectId: optionState }),
      ).unwrap();
    } catch (error) {
      // Notify the error message if the stopTimer action fails
      dispatchToRedux(notify({ type: "error", message: error.message }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function handleChangeWorkspace(currentWorkspace, currentUser) {
      try {
        dispatchToRedux(
          changeWorkspace({
            workspace: currentWorkspace,
            isWorkspaceAdmin: currentUser.isAdmin,
          }),
        );
        dispatchToRedux(setEntryDay({ day: 0 }));
      } catch (error) {
        dispatchToRedux(
          notify({
            type: "error",
            message: `Failed to fetch entries: ${error.message}`,
          }),
        );
      }
    }
    if (workspace?.workspaces?.length && user) {
      const currentWorkspace = workspace.workspaces.find(
        (workspace) => workspace._id === user.currentWorkspace,
      );
      const currentUser = currentWorkspace?.users?.find(
        (workspaceUser) => workspaceUser.user === user._id,
      );
      if (currentUser) {
        handleChangeWorkspace(currentWorkspace, currentUser);
      }
    }
  }, [workspace, user]);

  return (
    <>
      <LoadingBar height="3px" color="#f11946" progress={progress} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          backgroundColor: theme?.backgroundColor,
          color: theme?.textColor,
          p: ["10px 10px", "10px 10px", "30px 10px"],
          justifyContent: "space-between",
          alignItems: "center",
          textAlign: "left",
          gap: "20px",
          height: "87px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: ["column", "column", "row"],
            justifyContent: ["flex-start", "flex-start", "space-between"],
            width: ["80%", "70%", "80%"],
            alignItems: ["flex-start", "flex-start", "center"],
            marginLeft: ["10px", "40px", "40px"],
            gap: ["10px", "10px", "30px"],
          }}
        >
          <CreateProject
            open={open}
            onClose={handleClose}
            onSave={handleAddProject}
            theme={theme}
            clients={workspaceClients}
            user={user}
            users={users}
          />
          <Input
            value={text}
            onChange={handleTextChange}
            inputProps={{
              "aria-label": "Without label",
            }}
            placeholder="What are you working on?"
            sx={{
              width: ["80%", "70%", "30%"],
              color: theme?.textColor,
              fontSize: "18px",
            }}
            disableUnderline
          />
          <Select
            variant="standard"
            value={optionState ?? "null"}
            onChange={handleOptionChange}
            sx={{
              width: ["80%", "80%", "25%"],
              color: theme?.textColor,
            }}
            disableUnderline
          >
            <MenuItem value="null">Select Project</MenuItem>
            {workspaceProjects?.map((project) => {
              return (
                <MenuItem key={project._id} value={project._id}>
                  {capitalizeFirstWord(project.name)}
                </MenuItem>
              );
            })}
            {isAdmin && (
              <MenuItem
                value="add-project"
                sx={{
                  color: theme?.secondaryColor,
                }}
              >
                + Add Project
              </MenuItem>
            )}
          </Select>

          <Timer
            user={user}
            isRunning={isRunning}
            setIsRunning={setIsRunning}
            workspace={workspace}
          />
        </Box>
        <Box
          sx={{
            position: "relative",
            width: ["20%", "30%", "20%"],
          }}
        >
          {loading ? (
            <CircularProgress
              color="inherit"
              sx={{
                width: "80px",
                height: "80px",
                position: "absolute",
                right: "30px",
                top: "50%",
              }}
            />
          ) : (
            <IconButton
              variant="contained"
              sx={{
                color: theme?.textColor,
                width: "80px",
                height: "80px",
                position: "absolute",
                right: "10px",
                top: "50%",
                backgroundColor: theme?.secondaryColor,
                boxShadow: "revert",
                ":hover": {
                  backgroundColor: theme?.secondaryColor,
                },
              }}
              onClick={isRunning ? handleStop : handleStart}
            >
              {isRunning ? (
                <Stop
                  sx={{
                    color: theme?.textColor,
                    fontSize: "2em",
                    backgroundColor: theme?.secondaryColor,
                  }}
                />
              ) : (
                <PlayArrow sx={{ color: theme?.textColor, fontSize: "2em" }} />
              )}
            </IconButton>
          )}
        </Box>
      </Box>
    </>
  );
};

export default Header;
