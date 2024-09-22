import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import LeaveBalanceBox from "../components/leave/LeaveBalanceBox";
import { useDispatch, useSelector } from "react-redux";
import { selectMe } from "##/src/app/profileSlice.js";
import {
  getUsersLeave,
  getUsersLeaveBalance,
  selectUserLeaveBalance,
  selectUserLeaveData,
} from "##/src/app/leaveSlice.js";
import { selectCurrentTheme } from "##/src/app/themeSlice.js";
import UpcomingLeaveTable from "../components/leave/UpcomingLeaveTable";
import HistoryLeaveTable from "../components/leave/HistoryLeaveTable";
import LeaveForm from "../components/leave/LeaveForm";
import { getHoliday, selectHolidays } from "##/src/app/holidaySlice.js";
import {
  getHolidayTypes,
  selectHolidayTypes,
} from "##/src/app/holidaySlice.js";
import { notify } from "##/src/app/alertSlice.js";

const Leave = ({ setProgress }) => {
  const theme = useSelector(selectCurrentTheme);
  const [toggle, setToggle] = useState("upcoming");
  const [openLeaveForm, setOpenLeaveForm] = useState(false);
  const [componentLoading, setComponentLoading] = useState(false);
  const dispatchToRedux = useDispatch();
  const user = useSelector(selectMe);
  const userLeaveData = useSelector(selectUserLeaveData);
  const holidays = useSelector(selectHolidays);
  const userLeaveBalance = useSelector(selectUserLeaveBalance);
  const leaveTypes = useSelector(selectHolidayTypes);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user) {
          setProgress(30);
          setComponentLoading(true);
          await Promise.all([
            dispatchToRedux(getHolidayTypes({ userId: user._id })),
            dispatchToRedux(getUsersLeave({ userId: user._id })),
            dispatchToRedux(getHoliday({ userId: user._id })),
            dispatchToRedux(
              getUsersLeaveBalance({
                userId: user._id,
                workspaceId: user.currentWorkspace,
              }),
            ),
          ]);
        }
      } catch (error) {
        setProgress(100);
        dispatchToRedux(
          notify({
            message: `Failed to get Leave data, ${error}`,
            type: "error",
          }),
        );
      } finally {
        setProgress(100);
        setComponentLoading(false);
      }
    };

    fetchData();
  }, []);

  // const calculateTotalLeaveBalance = (leaveBalance) => {
  //   return leaveBalance?.reduce((total, type) => total + type.value, 0);
  // };

  // const calculateTotalBookedBalance = (leaveBalance) => {
  //   return leaveBalance?.reduce((total, type) => total + type.consumed, 0);
  // };

  const calculateTotalLeaveBalance = (leaveBalance) => {
    return parseFloat(leaveBalance?.reduce((total, type) => total + parseFloat(type.value), 0).toFixed(2)) || 0;
  };
  
  const calculateTotalBookedBalance = (leaveBalance) => {
    return parseFloat(leaveBalance?.reduce((total, type) => total + parseFloat(type.consumed), 0).toFixed(2)) || 0;
  };
  

  const handleToggle = (event, newToggle) => {
    if (newToggle) {
      setToggle(newToggle);
    }
  };

  return (
    <>
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
        <Box sx={{ paddingTop: "20px" }}>
          {openLeaveForm ? (
            <>
              <LeaveForm
                setOpenLeaveForm={setOpenLeaveForm}
                setProgress={setProgress}
              />
            </>
          ) : (
            <Box>
              <Box sx={{ marginBottom: "15px", marginTop: "-2%" }}>
                <Container
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-evenly",
                  }}
                >
                  {userLeaveBalance?.leaveBalance?.map((e) => (
                    <LeaveBalanceBox
                      title={e.type}
                      availableLeaves={e.value}
                      consumedLeaves={e.consumed}
                      key={e.type}
                      theme={theme}
                    />
                  ))}

                  <Box
                    sx={{
                      // border: "1px solid red",
                      width: "13%",
                      height: "200px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "column",
                      textAlign: "center",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: "thin", fontSize: "16px" }}
                    >
                      Total Leave:{"  "}
                      <strong style={{ fontSize: "20px" }}>
                        {calculateTotalLeaveBalance(
                          userLeaveBalance?.leaveBalance,
                        )}
                      </strong>
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: "thin", fontSize: "16px" }}
                    >
                      Total Booked:{"  "}
                      <strong style={{ fontSize: "20px" }}>
                        {calculateTotalBookedBalance(
                          userLeaveBalance?.leaveBalance,
                        )}
                      </strong>
                    </Typography>
                    <Typography></Typography>
                    <Button
                      variant="contained"
                      onClick={() => setOpenLeaveForm(true)}
                      sx={{
                        marginTop: "10px",
                        backgroundColor: theme?.secondaryColor,
                        color: "white",
                        ":hover": {
                          backgroundColor: theme?.secondaryColor,
                        },
                      }}
                    >
                      Apply Leave
                    </Button>
                  </Box>
                </Container>
              </Box>
              <Box>
                <Container
                  maxWidth="100%"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "end",
                    marginBottom: "20px",
                  }}
                >
                  <ToggleButtonGroup
                    value={toggle}
                    exclusive
                    onChange={handleToggle}
                    sx={{
                      height: "30px",
                    }}
                  >
                    <ToggleButton value="upcoming">Upcoming </ToggleButton>
                    <ToggleButton value="applied">Applied</ToggleButton>
                  </ToggleButtonGroup>
                </Container>
                {toggle === "upcoming" && (
                  <UpcomingLeaveTable holidays={holidays} theme={theme} />
                )}
                {toggle === "applied" && (
                  <HistoryLeaveTable
                    userLeaveData={userLeaveData}
                    theme={theme}
                    leaveTypes={leaveTypes}
                  />
                )}
              </Box>
            </Box>
          )}
        </Box>
      )}
    </>
  );
};

export default Leave;
