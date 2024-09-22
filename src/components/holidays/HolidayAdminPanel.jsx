import React, { useEffect, useState } from "react";
import { Box, Container, Tab, Tabs } from "@mui/material";
import LeaveRequests from "./LeaveRequests";
import LeaveType from "./LeaveType";
import UpdateLeaveBalance from "./UpdateLeaveBalance";
import LeaveRequestHistory from "./LeaveHistory";
import { useDispatch, useSelector } from "react-redux";
import { selectMe } from "##/src/app/profileSlice.js";
import { getLeaveDetails, selectLeaveData } from "../../app/leaveSlice";
import Rules from "../calculation/Rules";
import {getHolidayTypes,selectHolidayTypes} from "##/src/app/holidaySlice.js";

const HolidayAdminPanel = ({ theme, children ,setProgress}) => {
  const [value, setValue] = useState(0);
  const dispatchToRedux = useDispatch();
  const user = useSelector(selectMe);
  const leaveData = useSelector(selectLeaveData);
  const leaveTypes = useSelector(selectHolidayTypes);


  useEffect(() => {
    if (user) {
      dispatchToRedux(
        getHolidayTypes({ userId: user._id }),
      );
    }
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (user) {
      dispatchToRedux(
        getLeaveDetails({ userId: user._id }),
      );
    }
  }, [user]);

  const pendingRequest = leaveData?.filter(
    (leave) => leave?.status === "pending",
  );

  const otherRequest = leaveData?.filter(
    (leave) => leave?.status !== "pending",
  );

  return (
    <>
      <Box>
        <Container maxWidth="100%">
          <Tabs
            TabIndicatorProps={{
              sx: { backgroundColor: theme?.secondaryColor },
            }}
            value={value}
            onChange={handleChange}
            sx={{ mb: "20px", mt: "-20px", borderBottom: "1px solid #ddd" }}
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
              label="Holiday List"
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
              label="Leave Requests"
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
              label="Requests History"
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
              label="Update Balance"
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
              label="Leave Type"
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
              label="Rules"
            />
          </Tabs>

          {value === 0 && children}
          {value === 1 && <LeaveRequests leaveData={pendingRequest} leaveTypes={leaveTypes} setProgress={setProgress}/>}
          {value === 2 && <LeaveRequestHistory leaveData={otherRequest} leaveTypes={leaveTypes} />}
          {value === 3 && <UpdateLeaveBalance setProgress={setProgress}/>}
          {value === 4 && <LeaveType setProgress={setProgress}/>}
          {value === 5 && <Rules setProgress={setProgress}/>}
        </Container>
      </Box>
    </>
  );
};

export default HolidayAdminPanel;
