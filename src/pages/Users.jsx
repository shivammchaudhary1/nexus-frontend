import React, { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Container,
  CssBaseline,
  IconButton,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import {
  inviteUser,
  removeUser,
  selectUserDetails,
} from "##/src/app/userDetailsSlice.js";
import { FONTS } from "##/src/utility/utility.js";
import { selectCurrentTheme } from "##/src/app/themeSlice.js";
import DeleteModal from "##/src/components/common/DeleteModal.jsx";
import InviteUser from "##/src/components/user/InviteUser";
import { selectMe } from "##/src/app/profileSlice.js";
import { selectUserRole } from "##/src/app/workspaceSlice.js";
import { notify } from "##/src/app/alertSlice.js";
import { capitalizeFirstWord } from "##/src/utility/miscellaneous/capitalize.js";
import {
  changeUserRole,
  selectWorkspace
} from "##/src/app/workspaceSlice.js";
import { getWorkspaceUsers } from "##/src/app/userDetailsSlice.js";

const tableBodyStyle = {
  fontFamily: FONTS.body,
  fontSize: "14px",
  textAlign: "center",
};

const UserRow = ({ user, onDelete, onToggle, toggleLoading, workspace }) => {
  const isAdmin = workspace.selectedWorkspace.users.find((u) => u.user === user._id)?.isAdmin;
  return (
    <TableRow>
      <TableCell sx={{ ...tableBodyStyle, textAlign: "left" }}>
        {capitalizeFirstWord(user.name)}
      </TableCell>

      <TableCell sx={tableBodyStyle}>{user.email}</TableCell>
      <TableCell sx={tableBodyStyle}>
        {isAdmin ? "Admin" : "User"}
      </TableCell>
      <TableCell sx={{ textAlign: "center" }}>
        {toggleLoading ? (
          <CircularProgress color="inherit" size="2rem" />
        ) : (
          <Switch
            checked={isAdmin === true}
            onChange={() => onToggle(user._id, isAdmin, workspace.selectedWorkspace._id)}
          />
        )}
      </TableCell>
      <TableCell sx={{ textAlign: "center" }}>
        <IconButton onClick={() => onDelete(user._id)}>
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

const Users = ({ setProgress }) => {
  const dispatchToRedux = useDispatch();
  const [inviteUserModalOpen, setInviteUserModalOpen] = useState(false);
  const [deleteUserModalOpen, setDeleteUserModalOpen] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [isUserRoleChanged, setIsUserRoleChanged] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [toggleLoading, setToggleLoading] = useState(false);

  const theme = useSelector(selectCurrentTheme);
  const userDetails = useSelector(selectUserDetails);
  const user = useSelector(selectMe);
  const isAdmin = useSelector(selectUserRole);
  const workspace = useSelector(selectWorkspace);

  const tableHeadStyle = {
    fontFamily: FONTS.subheading,
    fontSize: "16px",
    fontWeight: "bold",
    textAlign: "center",
    color: "#5a5a5a",
  };

  useEffect(()=>{
    dispatchToRedux(getWorkspaceUsers());
  },[workspace.selectedWorkspace]);

  const handleDelete = (id) => {
    setDeleteUserId(id);
    setDeleteUserModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (userDetails.length === 1) {
      dispatchToRedux(
        notify({
          type: "warning",
          message: "Can not delete last user",
        }),
      );
      return;
    }

    try {
      setProgress(30);
      setButtonLoading(true);
      await dispatchToRedux(
        removeUser({
          userId: deleteUserId,
          workspaceId: user?.currentWorkspace,
        }),
      ).unwrap();
      setProgress(100);
      setButtonLoading(false);

      dispatchToRedux(
        notify({
          type: "success",
          message: "User removed successfully",
        }),
      );

      setDeleteUserId(null);
      setDeleteUserModalOpen(false);
    } catch (error) {
      setProgress(100);
      setButtonLoading(false);
      dispatchToRedux(
        notify({
          type: "error",
          message: `Error removing user, ${error.message}`,
        }),
      );
    }
  };
  
  const handleToggle = async (id, isAdmin) => {
    try {
      const newIsAdmin = !isAdmin;
      const isAdminCount = workspace.selectedWorkspace.users.filter((user) => user.isAdmin).length;
      if (newIsAdmin === false && isAdminCount === 1) {
        dispatchToRedux(
          notify({
            type: "warning",
            message: "Cannot change the last admin to a user",
          }),
        );
        return;
      }

      setProgress(30);
      setToggleLoading(true);
      await dispatchToRedux(
        changeUserRole({
          userId: id,
          isAdmin: newIsAdmin,
        }),
      ).unwrap();
      setProgress(100);
      setToggleLoading(false);
      dispatchToRedux(
        notify({
          type: "success",
          message: "User role updated successfully",
        }),
      );

      setIsUserRoleChanged(!isUserRoleChanged);
    } catch (error) {
      setProgress(100);
      setToggleLoading(false);
      dispatchToRedux(
        notify({
          type: "error",
          message: `Error updating user role. ${error.message}`,
        }),
      );
    }
  };

  const handleInvite = () => {
    setInviteUserModalOpen(true);
  };

  const handleInviteUser = async (email) => {

    if (email === "") {
      dispatchToRedux(
        notify({
          type: "warning",
          message: "Please enter an email address before inviting the user.",
        }),
      );
    } 
      
    setButtonLoading(true);
    setProgress(50);
    try {
      await dispatchToRedux(
        inviteUser({
          workspaceId: user.currentWorkspace,
          email,
        }),
      ).unwrap();
      setButtonLoading(false);
      dispatchToRedux(
        notify({
          type: "success",
          message: "User invited successfully",
        }),
      );
      setInviteUserModalOpen(false);
      setProgress(100);
    } catch (error) {
      setButtonLoading(false);
      dispatchToRedux(
        notify({
          type: "error",
          message: error.message,
        }),
      ); 
      setProgress(100);
    }
  };

  return (
    <Box>
      <Typography
        variant="h5"
        fontWeight="bold"
        sx={{
          ml: "25px",
          mt: "50px",
          color: theme?.secondaryColor,
          mb: "30px",
        }}
      >
        Users
      </Typography>
      <CssBaseline />
      <Container maxWidth="100%">
        <Box
          sx={{
            position: "absolute",
            top: "145px",
            right: "22px",
            cursor: "pointer",
            padding: "7px",
            zIndex: 1000, // To ensure it's above other elements
          }}
          onClick={handleInvite}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            color={theme?.secondaryColor}
          >
            + Invite User
          </Typography>
        </Box>
        <TableContainer sx={{ maxHeight: "70vh" }}>
          <Table
            size="small"
            aria-label="a dense table"
            sx={{
              boxShadow: "none",
              "& .MuiTableCell-root": {
                padding: "15px 0px",
              },
            }}
            stickyHeader
          >
            <TableHead>
              <TableRow
                sx={{
                  borderTop: "1px solid rgba(230, 230, 230, .5)",
                  borderBottom: "1px solid rgba(230, 230, 230, .5)",
                }}
              >
                <TableCell sx={{ ...tableHeadStyle, textAlign: "left" }}>
                  Name
                </TableCell>
                <TableCell sx={tableHeadStyle}>Email</TableCell>
                <TableCell sx={tableHeadStyle}>Role</TableCell>
                <TableCell sx={tableHeadStyle}>Make Admin</TableCell>
                <TableCell sx={tableHeadStyle}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isAdmin && userDetails.length > 0 ? (
                userDetails.map((user) => (
                  <UserRow
                    key={user._id}
                    user={user}
                    onDelete={handleDelete}
                    onToggle={handleToggle}
                    toggleLoading={toggleLoading}
                    workspace={workspace}
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    {userDetails.length === 0
                      ? "No Data to show User Details"
                      : "Unauthorized action: You are not an admin"}
                  </TableCell>
                </TableRow>
              )}

            </TableBody>
          </Table>
        </TableContainer>
      </Container>
      <DeleteModal
        open={deleteUserModalOpen}
        onClose={() => setDeleteUserModalOpen(false)}
        onDelete={handleConfirmDelete}
        title={"Delete User"}
        text={
          "User will be removed permanently, Are you sure you want to delete this user?"
        }
        theme={theme}
        buttonLoading={buttonLoading}
      />
      <InviteUser
        open={inviteUserModalOpen}
        onClose={() => setInviteUserModalOpen(false)}
        onSave={handleInviteUser}
        theme={theme}
        title={"Invite User"}
        buttonLoading={buttonLoading}
      />
    </Box>
  );
};

export default Users;
