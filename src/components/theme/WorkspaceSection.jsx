import {
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  IconButton,
  Radio,
} from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddWorkspaceModal from "##/src/modals/WorkspaceModal/AddWorkspace";
import EditWorkspaceModal from "##/src/modals/WorkspaceModal/EditWorkspace";
import { selectTimer } from "##/src/app/timerSlice.js";
import { selectMe } from "##/src/app/profileSlice.js";
import { requestMade } from "##/src/app/reportSlice.js";
import { selectUserRole } from "##/src/app/workspaceSlice.js";
import { notify } from "##/src/app/alertSlice.js";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { capitalizeFirstWord } from "##/src/utility/miscellaneous/capitalize.js";
import { config } from "##/src/utility/config/config.js";
import FetchApi from "##/src/client.js";
import { setProjects } from "##/src/app/projectSlice.js";
import { setEntries } from "##/src/app/timerSlice.js";
import { setClients } from "##/src/app/clientSlice.js";
import { changeUserWorkspace } from "../../app/profileSlice";

export const WorkspaceSection = ({
  workspaces,
  currentWorkspaceId,
  isWorkspaceExpanded,
  onCollapse,
  setProgress,
}) => {
  const dispatchToRedux = useDispatch();
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editWorkspace, setEditWorkspace] = useState({});
  const [radioLoading, setRadioLoading] = useState(false);
  const handleOpenEdit = (workspace) => {
    setOpenEdit(true);
    setEditWorkspace(workspace);
  };
  const handleCloseEdit = () => setOpenEdit(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const user = useSelector(selectMe);
  const isAdmin = useSelector(selectUserRole);
  const { timer } = useSelector(selectTimer);

  const handleWorkspaceChange = async (event) => {
    if (timer?.isRunning) {
      dispatchToRedux(
        notify({
          type: "error",
          message: "Please stop timer before switch workspace",
        }),
      );
      return;
    }
    const workspaceId = event.target.value;
    try {
      setRadioLoading(true);
      setProgress(30);
      const { workspace, projects, entries, lastEntryDate, clients } =
        await FetchApi.fetch(
          `${config.api}/api/workspace/workspace-actions/switch/${user._id}/${workspaceId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

      dispatchToRedux(changeUserWorkspace({ workspace }));
      dispatchToRedux(setProjects({ projects: projects }));
      dispatchToRedux(setEntries({ entries, lastEntryDate }));
      dispatchToRedux(setClients({ clients: clients }));

      const workspaceName = capitalizeFirstWord(
        workspace.name
      );
      await dispatchToRedux(requestMade());
      setRadioLoading(false);
      setProgress(100);
      dispatchToRedux(
        notify({
          type: "success",
          message: `Successfully switched to ${workspaceName}`,
        }),
      );
    } catch (error) {
      setProgress(100);
      setRadioLoading(false);
      dispatchToRedux(
        notify({ type: "error", message: "Something went wrong, Try again" }),
      );
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <AddWorkspaceModal
        open={open}
        handleClose={handleClose}
        setProgress={setProgress}
      />
      <EditWorkspaceModal
        workspace={editWorkspace}
        open={openEdit}
        handleClose={handleCloseEdit}
        setProgress={setProgress}
      />
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Box
          as="h4"
          onClick={onCollapse}
          sx={{
            paddingBottom: "10px",
            "&:hover": {
              cursor: "pointer",
            },
            display: "flex",
            alignItems: "center",
          }}
        >
          Workspaces
          {isWorkspaceExpanded ? (
            <ArrowDropDownIcon
              sx={{
                fontSize: "32px",
                alignSelf: "center",
                // marginRight: "8px",
                marginLeft: "36%",
                // marginLeft: "80px",
              }}
            />
          ) : (
            <ArrowDropUpIcon
              sx={{
                fontSize: "32px",
                alignSelf: "center",
                // marginRight: "8px",
                marginLeft: "36%",
                // marginLeft: "80px",
              }}
            />
          )}
        </Box>
      </Box>
      {isWorkspaceExpanded &&
        workspaces.map((workspace) => {
          return (
            <Box
              key={workspace._id}
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                boxShadow:
                  "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
                padding: "0px 5px",
                gap: "6px",
                margin: "10px 0 0 0",
                backgroundColor:
                  workspace._id === currentWorkspaceId ? "#BAD2ED" : "",
              }}
            >
              <FormControlLabel
                value={workspace._id}
                control={
                  radioLoading ? (
                    <Box
                      sx={{
                        marginLeft: "10px",
                        paddingLeft: "5px",
                        paddingRight: "10px",
                        borderRadius: "5px",
                      }}
                    >
                      <CircularProgress color="inherit" size="1rem" />
                    </Box>
                  ) : (
                    <Radio />
                  )
                }
                label={capitalizeFirstWord(workspace.name)}
                checked={workspace._id === currentWorkspaceId}
                onChange={handleWorkspaceChange}
                sx={{
                  "&.Mui-checked": {
                    color: "#1976D2",
                  },
                }}
              />
              {isAdmin && (
                <IconButton onClick={() => handleOpenEdit(workspace)}>
                  <EditOutlinedIcon />
                </IconButton>
              )}
            </Box>
          );
        })}
      {isAdmin && <Button onClick={handleOpen}>Add New Workspace</Button>}
    </Box>
  );
};
