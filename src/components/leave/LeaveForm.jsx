import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { selectMe } from "##/src/app/profileSlice.js";
import { applyLeave, selectUserLeaveBalance } from "##/src/app/leaveSlice";
import { selectCurrentTheme } from "##/src/app/themeSlice.js";
import { useDispatch, useSelector } from "react-redux";
import {
  getCalculationRule,
  selectCalculationRules,
} from "../../app/calculationSlice.js";
import { selectHolidays, selectHolidayTypes } from "../../app/holidaySlice";
import ConfirmationModal from "../holidayAndLeaveModal/ConfirmationModal";
import { notify } from "##/src/app/alertSlice.js";
import { capitalizeFirstWord } from "##/src/utility/miscellaneous/capitalize.js";

const LeaveForm = ({ setOpenLeaveForm, setProgress }) => {
  const [state, setState] = useState({
    title: "",
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
    dailyDetails: [], // Updated to store an array of daily details
  });
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [availableBalance, setAvailableBalance] = useState(0);

  const theme = useSelector(selectCurrentTheme);
  const user = useSelector(selectMe);
  const leaveBalances = useSelector(selectUserLeaveBalance);
  const rules = useSelector(selectCalculationRules);
  const holiday = useSelector(selectHolidays);
  const leaveTypes = useSelector(selectHolidayTypes);
  const dispatchToRedux = useDispatch();

  useEffect(() => {
    dispatchToRedux(
      getCalculationRule({
        userId: user._id,
        workspaceId: user.currentWorkspace,
      }),
    );

    // Find the selected leave type in the leaveBalances array
    if (state.leaveType) {
      const selectedLeaveType = leaveBalances.leaveBalance.find(
        (balance) => balance.type === state.leaveType,
      );
      if (selectedLeaveType) {
        setAvailableBalance(selectedLeaveType.value);
      }
    }
  }, [state.leaveType, leaveBalances]);

  const handleChange = (event) => {
    const selectedLeaveType = event.target.value;
    const selectedLeaveBalance = leaveBalances.leaveBalance.find(
      (balance) => balance.type === selectedLeaveType,
    );

    // Find the selected leave type in the leaveTypes array
    const selectedLeaveTypeInfo = leaveTypes.find(
      (type) => type.leaveType === selectedLeaveType,
    );

    if (selectedLeaveBalance && selectedLeaveBalance.value === 0) {
      // Check if the selected leave type is in the paid category
      if (selectedLeaveTypeInfo && selectedLeaveTypeInfo.paid) {
        // Show HTML alert for zero balance in the paid category
        alert("You need to apply in unpaid category as the balance is zero.");
        return;
      }
    }

    setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  };

  const handleClose = () => {
    setOpenLeaveForm(false);
  };

  const handleStartDateChange = (event) => {
    const startDate = event.target.value;
    const endDate = startDate;
    const dailyDetails = generateDailyDetails(startDate, endDate);
    const daysDifference = calculateDaysDifference(
      startDate,
      endDate,
      dailyDetails,
    );

    setState({
      ...state,
      startDate,
      endDate,
      dailyDetails,
      daysDifference,
    });
  };

  const handleEndDateChange = (event) => {
    const endDate = event.target.value;
    const dailyDetails = generateDailyDetails(state.startDate, endDate);
    const daysDifference = calculateDaysDifference(
      state.startDate,
      endDate,
      dailyDetails,
    );

    setState({
      ...state,
      endDate,
      dailyDetails,
      daysDifference,
    });
  };

  const calculateDaysDifference = (startDate, endDate, dailyDetails) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    let differenceInDays = 0;

    while (start <= end) {
      if (checkHoliday(start)) {
        start.setDate(start.getDate() + 1);
        continue;
      }
      const selectedDay = dailyDetails.find(
        (dailyDetail) =>
          new Date(dailyDetail.day).toISOString().split("T")[0] ===
          start.toISOString().split("T")[0],
      );

      if (selectedDay) {
        differenceInDays += selectedDay.duration === "halfday" ? 0.5 : 1;
      } else {
        differenceInDays += 1;
      }

      start.setDate(start.getDate() + 1);
    }

    return differenceInDays;
  };

  const generateDailyDetails = (startDate, endDate, leaveType) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dailyDetails = [];

    while (start <= end) {
      dailyDetails.push({
        day: new Date(start),
        duration: leaveType === "halfday" ? "halfday" : "fullday",
      });

      start.setDate(start.getDate() + 1);
    }

    return dailyDetails;
  };

  const handleDailyDetailsChange = (index, field, value) => {
    const updatedDailyDetails = [...state.dailyDetails];
    updatedDailyDetails[index][field] = value;

    const daysDifference = calculateDaysDifference(
      state.startDate,
      state.endDate,
      updatedDailyDetails,
    );

    setState({
      ...state,
      dailyDetails: updatedDailyDetails,
      daysDifference,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setConfirmationModalOpen(true);
  };

  const checkHoliday = (dateString) => {
    const activeRule = rules.filter((rule) => rule.isActive)[0];
    const holidays = [];
    const week = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    for (let day of week) {
      if (!activeRule.weekDays.includes(day)) holidays.push(day);
    }
    let isHoliday = false;
    const day = new Date(dateString).getDay();
    if (holidays.includes(week[day])) isHoliday = true;

    for (let el of holiday) {
      if (
        new Date(el.date).toDateString() ===
          new Date(dateString).toDateString() &&
        el.type !== "Restricted"
      )
        isHoliday = true;
    }
    return isHoliday;
  };

  const handleConfirmation = async () => {
    setButtonLoading(true);

    try {
      setProgress(30);
      await dispatchToRedux(
        applyLeave({
          userId: user._id,

          title: state.title,
          type: state.leaveType,
          startDate: state.startDate,
          endDate: state.endDate,
          numberOfDays: state.daysDifference,
          dailyDetails: state.dailyDetails.filter(
            (dailyDetail) => !checkHoliday(dailyDetail.day),
          ),
          description: state.reason,
        }),
      );
      setButtonLoading(false);
      setProgress(100);
      dispatchToRedux(
        notify({ message: "Leave applied successfully!", type: "success" }),
      );
    } catch (error) {
      console.log("Error applying leave:", error.message);
      setProgress(0);
      dispatchToRedux(notify({ message: "Failed to apply leave", type: "error" }));
    } finally {
      setButtonLoading(false);
      setConfirmationModalOpen(false);
    }
  };

  return (
    <>
      <Box
        sx={{
          // border: "1px solid black",
          display: "flex",
          marginTop: "-2rem",
          gap: "1rem",
        }}
      >
        <Box
          sx={{
            // border: "1px solid red",
            width: "65%",
            padding: "1rem",
            borderRadius: "5px",
            boxShadow:
              "rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px",
          }}
        >
          <form onSubmit={handleSubmit}>
            <TextField
              label="Title"
              variant="standard"
              fullWidth
              margin="normal"
              name="title"
              value={state.title}
              onChange={handleChange}
              required
            />

            <FormControl fullWidth variant="standard" margin="normal">
              <InputLabel>Leave Type</InputLabel>
              <Select
                label="Leave Type"
                name="leaveType"
                value={state.leaveType}
                onChange={handleChange}
                required
              >
                {leaveTypes
                  ?.filter((type) => type.leaveType !== "overtime")
                  .map((type) => (
                    <MenuItem key={type._id} value={type.leaveType}>
                      {capitalizeFirstWord(type.leaveType)}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                gap: "5%",
              }}
            >
              <TextField
                label="Start Date"
                variant="standard"
                margin="normal"
                type="date"
                name="startDate"
                required
                value={state.startDate}
                onChange={handleStartDateChange}
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{ width: "45%" }}
              />
              <Typography variant="h6">to</Typography>
              <TextField
                label="End Date"
                variant="standard"
                margin="normal"
                type="date"
                name="endDate"
                value={state.endDate}
                onChange={handleEndDateChange}
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{ width: "45%" }}
              />
            </Box>

            <Box
              sx={{
                // border: "1px solid pink",
                maxHeight: "150px",
                overflowY: "scroll",
                display: "flex",
                flexDirection: "column",
                gap: "-1rem",
                "&::-webkit-scrollbar": {
                  width: "8px", // Adjust the width as needed
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "gray", // Adjust the color as needed
                  borderRadius: "6px", // Round the corners
                },
                "&::-webkit-scrollbar-track": {
                  backgroundColor: "lightgray", // Adjust the color as needed
                  borderRadius: "6px", // Round the corners
                },
              }}
            >
              {state.dailyDetails.map((dailyDetail, index) => (
                <Box
                  key={index}
                  sx={{
                    width: "80%",
                    marginBottom: "5px",
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <TextField
                    label="Date"
                    variant="standard"
                    margin="normal"
                    disabled
                    value={dailyDetail.day.toISOString().split("T")[0]}
                    sx={{ width: "40%" }}
                  />
                  <FormControl
                    variant="standard"
                    margin="normal"
                    sx={{ width: "40%" }}
                  >
                    <InputLabel>Duration</InputLabel>
                    <Select
                      label="Duration"
                      value={
                        checkHoliday(dailyDetail.day.toISOString())
                          ? "holiday"
                          : dailyDetail.duration
                      }
                      onChange={(e) =>
                        handleDailyDetailsChange(
                          index,
                          "duration",
                          e.target.value,
                        )
                      }
                      disabled={checkHoliday(dailyDetail.day.toISOString())}
                    >
                      {checkHoliday(dailyDetail.day.toISOString()) && (
                        <MenuItem value="holiday">Holiday</MenuItem>
                      )}
                      <MenuItem value="fullday">Full Day</MenuItem>
                      <MenuItem value="halfday">Half Day</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              ))}
            </Box>

            <Box sx={{ widt: "50%", margin: "auto" }}>
              {state.daysDifference && (
                <TextField
                  label="Total Days"
                  variant="standard"
                  margin="normal"
                  disabled
                  value={state.daysDifference}
                  fullWidth
                />
              )}
            </Box>

            <TextField
              label="Reason"
              variant="standard"
              fullWidth
              margin="normal"
              name="reason"
              multiline
              rows={2}
              value={state.reason}
              onChange={handleChange}
            />
            <Box
              sx={{
                // border: "1px solid black",
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: "1%",
              }}
            >
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: theme?.secondaryColor,
                  paddingLeft: "2.5rem",
                  paddingRight: "2.5rem",
                  fontWeight: "bold",
                  color: "white",
                  ":hover": {
                    backgroundColor: theme?.secondaryColor,
                  },
                }}
              >
                Submit
              </Button>
              <Button
                type="button"
                variant="contained"
                onClick={handleClose}
                sx={{
                  backgroundColor: theme?.secondaryColor,
                  paddingLeft: "2.5rem",
                  paddingRight: "2.5rem",
                  fontWeight: "bold",
                  color: "white",
                  ":hover": {
                    backgroundColor: theme?.secondaryColor,
                  },
                }}
              >
                Cancel
              </Button>
            </Box>
          </form>
        </Box>

        <Box
          sx={{
            display: "flex",
            width: "35%",
          }}
        >
          <Box
            sx={{
              // border: "1px solid pink",
              padding: "16px",
              borderRadius: "4px",
              width: "100%",
            }}
          >
            <Box sx={{ border: "1px solid black" }}>
              <Typography
                sx={{
                  fontSize: "14px",
                  margin: "8px",
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px",
                }}
              >
                <strong>
                  As of{" "}
                  {new Date()
                    .toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                    .split(" ")
                    .join("-")}
                </strong>
                <strong>Days(s)</strong>
              </Typography>
            </Box>

            <Box sx={{ border: "1px solid black" }}>
              <Typography
                sx={{
                  fontSize: "14px",
                  margin: "8px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                Available Balance: <span>{availableBalance}</span>
              </Typography>
            </Box>

            <Box sx={{ border: "1px solid black" }}>
              <Typography
                sx={{
                  fontSize: "14px",
                  margin: "8px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                Currently Booked : <span>{state.daysDifference || 0}</span>
              </Typography>
            </Box>

            <Box sx={{ border: "1px solid black" }}>
              <Typography
                sx={{
                  fontSize: "14px",
                  margin: "8px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                Balance After Booked:
                <span>{availableBalance - (state.daysDifference || 0)} </span>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      <ConfirmationModal
        open={isConfirmationModalOpen}
        onClose={() => setConfirmationModalOpen(false)}
        onConfirm={handleConfirmation}
        actionType="Apply"
        theme={theme}
        buttonLoading={buttonLoading}
      />
    </>
  );
};

export default LeaveForm;
