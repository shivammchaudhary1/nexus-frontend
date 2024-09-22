import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { FONTS } from "##/src/utility/utility.js";
import EditIcon from "@mui/icons-material/Edit";
import {
  monthlyReport,
  savingMonthlyReport,
  selectMonthlyReport,
  setUpdateMonthlyReportData,
} from "../../app/reportSlice.js";
import { selectMe } from "##/src/app/profileSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { notify } from "##/src/app/alertSlice.js";
import { capitalizeFirstWord } from "##/src/utility/miscellaneous/capitalize.js";
import EditOvertimeModal from "../calculationModal/EditOvertimeModal.jsx";
import ConfirmationDataSaveModal from "../calculationModal/ConfirmationDataSaveModal.jsx";

const Calculation = ({ theme }) => {
  const user = useSelector(selectMe);
  const monthlyDataState = useSelector(selectMonthlyReport);

  const dispatchToRedux = useDispatch();

  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const [pageLoading, setPageLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);

  const years = [...Array(10).keys()].map((year) =>
    String(new Date().getFullYear() - year),
  );

  const months = [
    { label: "January", value: 1 },
    { label: "February", value: 2 },
    { label: "March", value: 3 },
    { label: "April", value: 4 },
    { label: "May", value: 5 },
    { label: "June", value: 6 },
    { label: "July", value: 7 },
    { label: "August", value: 8 },
    { label: "September", value: 9 },
    { label: "October", value: 10 },
    { label: "November", value: 11 },
    { label: "December", value: 12 },
  ];

  const dispatchMonthlyReport = async () => {
    const numericMonth = parseInt(selectedMonth, 10);
    const numericYear = parseInt(selectedYear, 10);
    try {
      setPageLoading(true);
      setButtonLoading(true);
      if (selectedMonth && selectedYear) {
        await dispatchToRedux(
          monthlyReport({
            userId: user._id,
            workspaceId: user.currentWorkspace,
            month: numericMonth,
            year: numericYear,
          }),
        ).unwrap();
        setPageLoading(false);
        setButtonLoading(false);
        dispatchToRedux(
          notify({
            type: "success",
            message:
              "Data Reported, Success ! click confirm to add overtime balance or edit to modify",
          }),
        );
      }
    } catch (error) {
      setPageLoading(false);
      setButtonLoading(false);
      dispatchToRedux(
        notify({
          type: "error",
          message: "Error in Generating Report.",
        }),
      );
    }
  };

  const handleGenerateClick = () => {
    dispatchMonthlyReport();
  };

  const tableBodyStyle = {
    fontFamily: FONTS.body,
    fontSize: "14px",
    textAlign: "center",
  };
  const tableHeadStyle = {
    fontFamily: FONTS.subheading,
    fontSize: "16px",
    fontWeight: "bold",
    textAlign: "center",
  };

  const handleEditClick = (data) => {
    setSelectedUser(data);
    setEditModalOpen(true);
  };

  const handleUpdateOvertime = (updatedUserData) => {
    // Find the index of the selected user in the array
    const userIndex = monthlyDataState.userMonthlyHours.findIndex(
      (user) => user.user === selectedUser.user,
    );

    // Update the user data in the state
    if (userIndex !== -1) {
      const updatedUserMonthlyHours = [...monthlyDataState.userMonthlyHours];
      updatedUserMonthlyHours[userIndex] = updatedUserData;
      dispatchToRedux(
        setUpdateMonthlyReportData({
          userMonthlyHours: updatedUserMonthlyHours,
        }),
      );
    }
  };

  const getMonthName = (numericMonth) => {
    const monthObj = months.find((month) => month.value === numericMonth);
    return monthObj ? monthObj.label : "";
  };

  const handleConfirmClick = async () => {
    setConfirmationModalOpen(true);
  };
  const handleConfirmModalClose = () => {
    setConfirmationModalOpen(false);
  };

  const handleConfirmModalConfirm = async () => {
    const monthName = getMonthName(selectedMonth);

    if (!monthName && !selectedYear) {
      dispatchToRedux(
        notify({
          type: "warning",
          message:
            "Please select month and year first, then generate the report, and click 'confirm' to save all in one go.",
        }),
      );
      return;
    }

    try {
      setButtonLoading(true);
      await dispatchToRedux(
        savingMonthlyReport({
          monthlyReportData: monthlyDataState,
          month: monthName,
          year: selectedYear,
          userId: user._id,
          workspaceId: user.currentWorkspace,
        }),
      ).unwrap();
      setButtonLoading(false);

      dispatchToRedux(
        notify({
          type: "success",
          message: `Monthly report for ${monthName} ${selectedYear} saved successfully, and overtime balance added successfully!`,
        }),
      );
    } catch (error) {
      setButtonLoading(false);
      dispatchToRedux(
        notify({
          type: "error",
          message: "Error saving monthly report.",
        }),
      );
    } finally {
      setButtonLoading(false);
      setConfirmationModalOpen(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "600px",
        marginTop: "-2rem",
      }}
    >
      <Box
        sx={{
          height: "50px",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          padding: "0 1rem",
          gap: "10px",
        }}
      >
        <FormControl>
          <InputLabel>Month</InputLabel>
          <Select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            label="Month"
            sx={{
              width: "140px",
              height: "40px",
            }}
          >
            {months.map((month) => (
              <MenuItem key={month.value} value={month.value}>
                {month.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel>Year</InputLabel>
          <Select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            label="Year"
            sx={{ width: "140px", height: "40px" }}
          >
            {years.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {pageLoading ? (
          <Button
            variant="contained"
            sx={{
              height: "40px",
              width: "140px",
              backgroundColor: theme?.secondaryColor,
              color: "white",
              ":hover": {
                backgroundColor: theme?.secondaryColor,
              },
            }}
          >
            <CircularProgress color="inherit" size="2rem" />
          </Button>
        ) : (
          <Button
            variant="contained"
            sx={{
              height: "40px",
              width: "140px",
              backgroundColor: theme?.secondaryColor,
              color: "white",
              ":hover": {
                backgroundColor: theme?.secondaryColor,
              },
            }}
            onClick={handleGenerateClick}
          >
            Generate
          </Button>
        )}
      </Box>
      {pageLoading && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <CircularProgress />
        </Box>
      )}
      {monthlyDataState && monthlyDataState.userMonthlyHours?.length > 0 && (
        <Box>
          <TableContainer sx={{ maxHeight: "60vh" }}>
            <Table
              size="small"
              aria-label="a dense table"
              sx={{
                "& .MuiTableCell-root": {
                  // padding: "10px 0px",
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
                  <TableCell sx={tableHeadStyle}>Employee</TableCell>
                  <TableCell sx={tableHeadStyle}>Ideal Days</TableCell>
                  <TableCell sx={tableHeadStyle}>Ideal Hours</TableCell>
                  <TableCell sx={tableHeadStyle}>User Working Days</TableCell>
                  <TableCell sx={tableHeadStyle}>User Working Hours</TableCell>
                  <TableCell sx={tableHeadStyle}>Applied Leave</TableCell>
                  <TableCell sx={tableHeadStyle}>Paid Leave</TableCell>
                  <TableCell sx={tableHeadStyle}>Unpaid Leave</TableCell>
                  <TableCell sx={tableHeadStyle}>Overtime</TableCell>
                  {/* <TableCell sx={tableHeadStyle}>Payable Hours</TableCell> */}
                  <TableCell sx={{ ...tableHeadStyle, textAlign: "right" }}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {monthlyDataState.userMonthlyHours?.map((user) => (
                  <TableRow key={user.user}>
                    <TableCell sx={tableBodyStyle}>
                      {capitalizeFirstWord(user.user)}
                    </TableCell>
                    <TableCell sx={tableBodyStyle}>
                      {
                        monthlyDataState.idealMonthlyHours
                          .totalRequiredWorkingDays
                      }
                    </TableCell>
                    <TableCell sx={tableBodyStyle}>
                      {
                        monthlyDataState.idealMonthlyHours
                          .totalRequiredWorkingHours
                      }
                    </TableCell>
                    <TableCell sx={tableBodyStyle}>
                      {user.numberOfDaysWorkedByUserInSelectedMonth}
                    </TableCell>
                    <TableCell sx={tableBodyStyle}>
                      {user.userWorkingHour.hours} :{" "}
                      {user.userWorkingHour.minutes} :{" "}
                      {user.userWorkingHour.seconds}
                    </TableCell>
                    <TableCell sx={tableBodyStyle}>
                      {user.totalLeaves}
                    </TableCell>
                    <TableCell sx={tableBodyStyle}>{user.paidLeaves}</TableCell>
                    <TableCell sx={tableBodyStyle}>
                      {user.unpaidLeaves}
                    </TableCell>
                    <TableCell sx={tableBodyStyle}>
                      {user.overtime.hours}:{user.overtime.minutes}:
                      {user.overtime.seconds}
                    </TableCell>
                    <TableCell sx={tableBodyStyle}></TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <IconButton onClick={() => handleEditClick(user)}>
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Middle Section */}

      {/* Bottom Section */}
      {monthlyDataState && monthlyDataState.userMonthlyHours?.length > 0 && (
        <Box
          sx={{
            border: "1px solid transparent",
            height: "50px",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            padding: "0 1rem",
          }}
        >
          <Button
            variant="contained"
            sx={{
              marginRight: "3rem",
              height: "40px",
              width: "140px",
              backgroundColor: theme?.secondaryColor,
              color: "white",
              ":hover": {
                backgroundColor: theme?.secondaryColor,
              },
            }}
            onClick={handleConfirmClick}
          >
            Confirm
          </Button>
        </Box>
      )}
      <EditOvertimeModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        overtimeData={selectedUser}
        onUpdate={handleUpdateOvertime}
        theme={theme}
      />
      <ConfirmationDataSaveModal
        isOpen={isConfirmationModalOpen}
        onClose={handleConfirmModalClose}
        onConfirm={handleConfirmModalConfirm}
        theme={theme}
        buttonLoading={buttonLoading}
      />
    </Box>
  );
};

export default Calculation;
