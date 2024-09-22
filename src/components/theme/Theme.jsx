import React, { useState } from "react";
import ThemeIcon from "##/src/assets/images/icons/themeicon.jpeg";
import { Box, CircularProgress, IconButton, Switch } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ColorsSelectionModal from "##/src/components/theme/ColorsSelectionModal.jsx";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentTheme } from "##/src/app/themeSlice.js";
import {themes} from "##/src/utility/themes.js";
import {
  editTimer,
  selectUserRole,
  selectWorkspace,
} from "##/src/app/workspaceSlice.js";
import { WorkspaceSection } from "./WorkspaceSection";
import "./theme.css";
import { notify } from "##/src/app/alertSlice.js";

const Theme = ({ setProgress }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [toggleLoading, setToggleLoading] = useState(false);
  const dispatchToRedux = useDispatch();
  const workspace = useSelector(selectWorkspace);
  const theme = useSelector(selectCurrentTheme);
  const isAdmin = useSelector(selectUserRole);
  const [isThemeExpanded, setIsThemeExpanded] = useState(false);
  const [isWorkspaceExpanded, setIsWorkspaceExpanded] = useState(true);

  function handleToggle() {
    setIsMenuOpen(!isMenuOpen);
  }

  function toggleThemeExpand() {
    if (isWorkspaceExpanded) {
      setIsWorkspaceExpanded(false);
    }
    setIsThemeExpanded(!isThemeExpanded);
  }

  function toggleWorkspaceExpand() {
    if (isThemeExpanded) {
      setIsThemeExpanded(false);
    }
    setIsWorkspaceExpanded(!isWorkspaceExpanded);
  }

  const handleEditToggle = async (e) => {
    try {
      setToggleLoading(true);
      setProgress(30);
      await dispatchToRedux(
        editTimer({
          workspace: workspace.selectedWorkspace._id,
          isEditable: e.target.checked,
        }),
      );
      setProgress(100);
      setToggleLoading(false);
      dispatchToRedux(
        notify({
          type: "success",
          message: e.target.checked
            ? "Entry editing has been enabled"
            : "Entry editing has been disabled",
        }),
      );
    } catch (error) {
      setProgress(100);
      setToggleLoading(false);
      dispatchToRedux(
        notify({
          type: "error",
          message: "Failed to switch entry editing",
        }),
      );
    }
  };

  return (
    <Box>
      <Box
        sx={{
          position: "fixed",
          bottom: "0px",
          right: "0px",
          padding: "0px 10px 10px",
          boxShadow: 3,
          borderTopLeftRadius: "10px",
          backgroundColor: "#fff",
          zIndex: "1000",
        }}
      >
        {isMenuOpen && (
          <Box
            sx={{
              padding: "10px 0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box as="h3">Workspace</Box>
            <IconButton onClick={handleToggle}>
              <CloseIcon />
            </IconButton>
          </Box>
        )}

        {isMenuOpen && (
          <Box sx={{ width: "200px" }}>

            <ColorsSelectionModal
              themes={themes}
              currentThemeId={theme?.themeId}
              workspace={workspace.selectedWorkspace}
              isThemeExpanded={isThemeExpanded}
              onCollapse={toggleThemeExpand}
              setProgress={setProgress}
            />

            {isAdmin && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>Timer Editor:</span>
                {toggleLoading ? (
                  <Box>
                    <CircularProgress color="inherit" size="2.1rem" />
                  </Box>
                ) : (
                  <Box>
                    <Switch
                      checked={workspace.selectedWorkspace?.isEditable}
                      onChange={handleEditToggle}
                    />
                  </Box>
                )}
              </Box>
            )}
            <WorkspaceSection
              workspaces={workspace.workspaces}
              currentWorkspaceId={workspace.selectedWorkspace?._id}
              onClose={handleToggle}
              theme={theme}
              isWorkspaceExpanded={isWorkspaceExpanded}
              onCollapse={toggleWorkspaceExpand}
              setProgress={setProgress}
            />
          </Box>
        )}
      </Box>
      <Box
        sx={{ width: "50px", position: "fixed", bottom: "10px", right: "10px" }}
      >
        {!isMenuOpen && (
          <img
            src={ThemeIcon}
            alt="Theme Icon"
            className="dashboard__SettingsIcon rotate-animation"
            style={{ cursor: "pointer", width: "100%" }}
            onClick={handleToggle}
          />
        )}
      </Box>
    </Box>
  );
};

export default Theme;
