import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectMe } from "##/src/app/profileSlice.js";
import { selectWorkspace } from "##/src/app/workspaceSlice.js";

import {
  getLeaveBalances,
  selectLeaveBalances,
  updateLeaveBalance,
  updateLeaveBalanceForAllUsers,
} from "##/src/app/holidaySlice.js";
import {
  Box,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import UpdateLeaveBalanceModal from "../holidayAndLeaveModal/UpdateLeaveBalanceModal.jsx";
import { selectCurrentTheme } from "##/src/app/themeSlice.js";
import { FONTS } from "##/src/utility/utility.js";
import { notify } from "##/src/app/alertSlice.js";
import { capitalizeFirstWord } from "##/src/utility/miscellaneous/capitalize.js";
import UpdateLeaveBalanceForAllUserModal from "../holidayAndLeaveModal/UpdateLeaveBalanceForAllUser.jsx";

const UpdateLeaveBalance = ({ setProgress }) => {
  const dispatchToRedux = useDispatch();
  const user = useSelector(selectMe);
  const theme = useSelector(selectCurrentTheme);
  const leaveBalances = useSelector(selectLeaveBalances);

  const workspace = useSelector(selectWorkspace);
  const leaveTypes = workspace.selectedWorkspace?.leaveTypes;

  const [isUpdateLeaveModalOpen, setIsUpdateLeaveModalOpen] = useState(false);
  const [userCurrentLeaveBalance, setUserCurrentLeaveBalance] = useState(null);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [componentLoading, setComponentLoading] = useState(false);
  const [userIdToBeUpdated, setUserIdToBeUpdated] = useState(null);
  // Bulk action
  const [isUpdateAllUsersModalOpen, setIsUpdateAllUsersModalOpen] =
    useState(false);

  const tableHeadStyle = {
    fontFamily: FONTS.subheading,
    fontSize: "16px",
    fontWeight: "bold",
    color: "#5a5a5a",
  };

  useEffect(() => {
    const fetchLeaveBalancesForUsers = async () => {
      try {
        setComponentLoading(true);
        setProgress(30);
        await dispatchToRedux(
          getLeaveBalances({
            workspaceId: user?.currentWorkspace,
          }),
        );
        setProgress(100);
        setComponentLoading(false);
      } catch (error) {
        setProgress(100);
        setComponentLoading(false);
        dispatchToRedux(
          notify({
            type: "error",
            message: "Error getting User's Leave Balances, Try Again",
          }),
        );
      }
    };

    fetchLeaveBalancesForUsers();
  }, [user]);

  // const calculateTotalLeaveBalance = (leaveBalance) => {
  //   return leaveBalance.reduce((total, type) => total + type.value, 0);
  // };

  const calculateTotalLeaveBalance = (leaveBalance) => {
    return leaveBalance
      .reduce((total, type) => total + parseFloat(type.value), 0)
      .toFixed(2);
  };

  const handleUpdateLeaveBalance = (leaveBalance) => {
    setIsUpdateLeaveModalOpen(true);
    setUserCurrentLeaveBalance(leaveBalance);
    setUserIdToBeUpdated(leaveBalance.user._id);
  };

  const handleModalSubmit = async ({ leaveType, amount }) => {
    if (!leaveType) {
      return dispatchToRedux(
        notify({ type: "warning", message: "Please select leave type" }),
      );
    }

    try {
      setProgress(30);
      setButtonLoading(true);
      await dispatchToRedux(
        updateLeaveBalance({
          userId: userIdToBeUpdated,
          workspaceId: user.currentWorkspace,
          leaveType,
          amount,
        }),
      );

      setButtonLoading(false);
      closeModal();
      setProgress(100);
      dispatchToRedux(
        notify({ type: "success", message: "Leave balance updated" }),
      );
    } catch (error) {
      setProgress(100);
      setButtonLoading(false);
      dispatchToRedux(
        notify({ type: "error", message: "Failed to update leave" }),
      );
    }
  };

  const closeModal = () => {
    setIsUpdateLeaveModalOpen(false);
    setUserIdToBeUpdated(null);
    setUserCurrentLeaveBalance(null);
  };

  const handleAddLeaveBalanceForAllUsers = () => {
    setIsUpdateAllUsersModalOpen(true);
  };

  const handleModalSubmitForAll = async (
    setAmount,
    setLeaveType,
    { leaveType, amount },
  ) => {
    if (!leaveType) {
      return dispatchToRedux(
        notify({ type: "warning", message: "Please select Leave Type" }),
      );
    }

    if (!amount || isNaN(amount)) {
      return dispatchToRedux(
        notify({
          type: "warning",
          message: "Please enter a valid number for amount",
        }),
      );
    }

    try {
      setProgress(30);
      setButtonLoading(true);
      await dispatchToRedux(
        updateLeaveBalanceForAllUsers({
          workspaceId: user.currentWorkspace,
          leaveType,
          amount,
        }),
      );
      setButtonLoading(false);
      setIsUpdateAllUsersModalOpen(false);
      setProgress(100);
      setAmount(0);
      setLeaveType("");
      dispatchToRedux(
        notify({
          type: "success",
          message: "Leave balances for all users updated successfully",
        }),
      );
    } catch (error) {
      setProgress(100);
      setButtonLoading(false);
      setAmount(0);
      setLeaveType("");
      dispatchToRedux(
        notify({ type: "error", message: "Failed to update leave" }),
      );
    }
  };

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: "0px" }}>
        <Button
          variant="outlined"
          color="inherit"
          onClick={handleAddLeaveBalanceForAllUsers}
        >
          Bulk Action
        </Button>
      </Box>
      <TableContainer sx={{ maxHeight: "60vh" }}>
        <Table
          size="small"
          aria-label="a dense table"
          sx={{
            "& .MuiTableCell-root": {
              padding: "10px 0px",
            },
          }}
          stickyHeader
        >
          <TableHead>
            <TableRow
              sx={{
                borderTop: "1px solid #ddd",
                borderBottom: "1px solid #ddd",
              }}
            >
              <TableCell sx={tableHeadStyle}>Employee Name</TableCell>
              <TableCell sx={tableHeadStyle}>Leave Balances</TableCell>
              <TableCell sx={tableHeadStyle}>Total Leave Balance</TableCell>
              <TableCell sx={tableHeadStyle}>Update</TableCell>
            </TableRow>
          </TableHead>
          {componentLoading ? (
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <CircularProgress color="inherit" />
            </Box>
          ) : (
            <TableBody>
              {leaveBalances.map((leaveBalance) => (
                <TableRow key={leaveBalance.user._id}>
                  <TableCell>{leaveBalance.user.name}</TableCell>
                  <TableCell>
                    {leaveBalance.leaveBalance.map((type) => (
                      <TableCell key={type.type}>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            margin: "0 5px",
                          }}
                        >
                          <Typography sx={{ fontWeight: "bold" }}>
                            {capitalizeFirstWord(type.type)}{" "}
                          </Typography>
                          <Typography>
                            Available:{" "}
                            <span style={{ fontWeight: "bold" }}>
                              {type.value}
                            </span>
                          </Typography>
                          <Typography>
                            Consumed:{" "}
                            <span style={{ fontWeight: "bold" }}>
                              {type.consumed}
                            </span>{" "}
                          </Typography>
                        </Box>
                      </TableCell>
                    ))}
                  </TableCell>
                  <TableCell>
                    {calculateTotalLeaveBalance(leaveBalance.leaveBalance)}
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleUpdateLeaveBalance(leaveBalance)}
                    >
                      Update
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </TableContainer>
      <UpdateLeaveBalanceModal
        isOpen={isUpdateLeaveModalOpen}
        onClose={closeModal}
        onSubmit={handleModalSubmit}
        theme={theme}
        leaveTypes={leaveTypes}
        buttonLoading={buttonLoading}
        userCurrentLeaveBalance={userCurrentLeaveBalance}
      />
      <UpdateLeaveBalanceForAllUserModal
        isOpen={isUpdateAllUsersModalOpen}
        onClose={() => setIsUpdateAllUsersModalOpen(false)}
        onSubmit={handleModalSubmitForAll}
        theme={theme}
        leaveTypes={leaveTypes}
        buttonLoading={buttonLoading}
      />
    </>
  );
};

export default UpdateLeaveBalance;
