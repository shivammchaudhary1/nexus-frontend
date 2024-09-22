import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  CssBaseline,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import IsCompleteModal from "##/src/components/project/IsComplete.jsx";
import CreateProject from "##/src/components/project/AddProject.jsx";
import UpdateProject from "##/src/components/project/UpdateProject.jsx";
import DeleteModal from "##/src/components/common/DeleteModal.jsx";
import ProjectsTable from "##/src/components/project/ProjectsTable.jsx";
import { useDispatch, useSelector } from "react-redux";
import {
  addProject,
  deleteProject as deleteProjectAction,
  getProjects,
  selectProjects,
  updateProject,
} from "##/src/app/projectSlice.js";
import { selectUserRole, selectWorkspace } from "##/src/app/workspaceSlice.js";
import { selectMe } from "##/src/app/profileSlice.js";
import { selectClients } from "##/src/app/clientSlice.js";
import { selectCurrentTheme } from "##/src/app/themeSlice.js";
import { notify } from "##/src/app/alertSlice.js";
import { selectUserDetails } from "##/src/app/userDetailsSlice.js";

function Projects({ setProgress }) {
  const [tabValue, setTabValue] = useState(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updatedProject, setUpdatedProject] = useState({});
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState({});
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);

  const user = useSelector(selectMe);
  const clients = useSelector(selectClients);
  const allProjects = useSelector(selectProjects);
  const isAdmin = useSelector(selectUserRole);
  const theme = useSelector(selectCurrentTheme);
  const users = useSelector(selectUserDetails);
  const workspace = useSelector(selectWorkspace);

  const dispatchToRedux = useDispatch();

  const handleOpenUpdateModal = (project) => {
    setIsUpdateModalOpen(true);
    setUpdatedProject(project);
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
  };

  const handleAdd = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
  };

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  const ongoingProjects = allProjects.filter((project) => !project.isCompleted);
  const completedProjects = allProjects.filter(
    (project) => project.isCompleted,
  );

  const handleAddProject = async (
    projectName,
    projectTime,
    projectDescription,
    client,
    selectedUsers,
  ) => {
    const data = {
      name: projectName,
      workspace: user.currentWorkspace,
      user: user._id,
      client: client,
      estimatedHours: projectTime,
      description: projectDescription,
      team: selectedUsers,
    };
    setProgress(30);
    try {
      await dispatchToRedux(addProject({ data })).unwrap();

      setIsAddModalOpen(false);
      handleCloseModal();

      dispatchToRedux(
        notify({ type: "success", message: "Project Added Successfully" }),
      );
    } catch (error) {
      dispatchToRedux(
        notify({
          type: "error",
          message: `Error adding project. ${error.message}`,
        }),
      );
    }
    setProgress(100);
  };

  const handleUpdateProject = async ({
    projectName,
    projectTime,
    projectDescription,
    projectId,
    client,
    selectedUsers,
  }) => {
    if (
      projectName.trim() === "" ||
      projectTime.trim() === "" ||
      projectDescription.trim() === "" ||
      projectId.trim() === "" ||
      client.trim() === "" ||
      selectedUsers.length === 0
    ) {
      dispatchToRedux(
        notify({
          type: "error",
          message:
            "Please fill in all required fields: Project Name, Project Time, Project Description, Project ID, Client, and select at least one User.",
        }),
      );
    }
    setProgress(30);
    try {
      await dispatchToRedux(
        updateProject({
          projectId,
          name: projectName,
          estimatedHours: projectTime,
          description: projectDescription,
          clientId: client,
          selectedUsers,
        }),
      ).unwrap();
      handleCloseUpdateModal();
      setUpdatedProject({});
      dispatchToRedux(
        notify({ type: "success", message: "Project Updated Successfully" }),
      );
    } catch (error) {
      dispatchToRedux(
        notify({
          type: "error",
          message: `Error updating the project, ${error.message}`,
        }),
      );
    }
    setProgress(100);
  };

  const handleCompleteProject = (project) => {
    setIsCompleteModalOpen(true);
    setUpdatedProject(project);
  };

  const handleCloseCompleteModal = () => {
    setIsCompleteModalOpen(false);
  };

  const handleConfirmComplete = async () => {
    setProgress(30);
    try {
      await dispatchToRedux(
        updateProject({
          projectId: updatedProject._id,
          toggleIsComplete: true,
        }),
      ).unwrap();
      dispatchToRedux(
        notify({
          type: "success",
          message: "Project is shift to completed / ongoing",
        }),
      );
      handleCloseCompleteModal();
      setUpdatedProject({});
    } catch (error) {
      setProgress(100);
      dispatchToRedux(
        notify({
          type: "success",
          message: `Failed to update project. ${error.message}`,
        }),
      );
    }
    setProgress(100);
  };

  const handleOpenDeleteModal = (project) => {
    setProjectToDelete(project);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDeleteProject = async () => {
    setProgress(30);
    setButtonLoading(true);
    try {
      await dispatchToRedux(
        deleteProjectAction({
          projectId: projectToDelete._id,
        }),
      ).unwrap();
      handleCloseDeleteModal();
      dispatchToRedux(
        notify({ type: "success", message: "Project Deleted Successfully" }),
      );
    } catch (error) {
      dispatchToRedux(
        notify({
          type: "error",
          message: `Project could not be deleted, ${error.message}`,
        }),
      );
    }
    setButtonLoading(false);
    setProgress(100);
  };

  useEffect(() => {
    async function handleGetProjects() {
      try {
        await dispatchToRedux(getProjects()).unwrap();
      } catch (error) {
        dispatchToRedux(
          notify({
            type: "error",
            message: `Failed to get the projects: ${error.message}`,
          }),
        );
      }
    }

    handleGetProjects();
  }, [workspace.selectedWorkspace]);

  return (
    <Box>
      <Typography
        variant="h5"
        fontWeight="bold"
        sx={{
          ml: "25px",
          mt: "50px",
          color: theme?.secondaryColor,
        }}
      >
        Projects
      </Typography>
      <CssBaseline />
      <Container maxWidth="100%">
        {isAdmin && (
          <Box
            sx={{
              position: "absolute",
              top: "145px",
              right: "22px",
              cursor: "pointer",
              padding: "7px",
              zIndex: 1000, // To ensure it's above other elements
            }}
            onClick={handleAdd}
          >
            <Typography
              variant="h6"
              fontWeight="bold"
              color={theme?.secondaryColor}
            >
              + Add Project
            </Typography>
          </Box>
        )}

        <Tabs
          TabIndicatorProps={{ sx: { backgroundColor: theme?.secondaryColor } }}
          value={tabValue}
          onChange={handleChangeTab}
          sx={{ mb: "40px", mt: "20px", borderBottom: "1px solid #ddd" }}
        >
          <Tab
            sx={{
              "&.Mui-selected": {
                color: "#000",
                borderLeft: "1px solid #eee",
                borderRight: "1px solid #eee",
              },
              color: "#5a5a5a",
              fontSize: "16px",
              textTransform: "capitalize",
            }}
            label="Ongoing Projects"
          />
          <Tab
            sx={{
              "&.Mui-selected": {
                color: "#000",
                borderLeft: "1px solid #eee",
                borderRight: "1px solid #eee",
              },
              color: "#5a5a5a",
              fontSize: "16px",
              textTransform: "capitalize",
            }}
            label="Completed Projects"
          />
        </Tabs>
        {tabValue === 0 && (
          <ProjectsTable
            projects={ongoingProjects}
            handleOpenUpdateModal={handleOpenUpdateModal}
            handleCompleteProject={handleCompleteProject}
            handleOpenDeleteModal={handleOpenDeleteModal}
            theme={theme}
            isAdmin={isAdmin}
          />
        )}
        {tabValue === 1 && (
          <ProjectsTable
            projects={completedProjects}
            handleOpenUpdateModal={handleOpenUpdateModal}
            handleCompleteProject={handleCompleteProject}
            handleOpenDeleteModal={handleOpenDeleteModal}
            theme={theme}
            isAdmin={isAdmin}
          />
        )}
      </Container>
      <CreateProject
        open={isAddModalOpen}
        onClose={handleCloseModal}
        onSave={handleAddProject}
        theme={theme}
        clients={clients}
        user={user}
        users={users}
      />
      <UpdateProject
        open={isUpdateModalOpen}
        onClose={handleCloseUpdateModal}
        onUpdate={handleUpdateProject}
        theme={theme}
        project={updatedProject}
        clients={clients}
        users={users ?? []}
      />
      <IsCompleteModal
        open={isCompleteModalOpen}
        handleClose={handleCloseCompleteModal}
        handleConfirm={handleConfirmComplete}
        theme={theme}
        title={
          updatedProject.isCompleted ? "Confirm Ongoing" : "Confirm Completion"
        }
        body={
          updatedProject.isCompleted
            ? "Are you sure you want to mark this project as ongoing?"
            : "Are you sure you want to mark this project as completed?"
        }
      />{" "}
      <DeleteModal
        open={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onDelete={handleDeleteProject}
        title={"Delete Project"}
        text={
          "Project will be removed permanently, Are you sure you want to delete this project?"
        }
        theme={theme}
        buttonLoading={buttonLoading}
      />
    </Box>
  );
}

export default Projects;
