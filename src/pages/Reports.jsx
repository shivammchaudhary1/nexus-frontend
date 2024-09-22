import React, { useEffect, useState } from "react";
import { Container, Tab, Tabs, Typography } from "@mui/material";
import SummaryByDev from "##/src/components/reports/SummaryByDev";
import Detailed from "##/src/components/reports/Detailed";
import { selectCurrentTheme } from "##/src/app/themeSlice.js";
import { useDispatch, useSelector } from "react-redux";
import Summary from "##/src/components/reports/Summary.jsx";
import { resetDate } from "##/src/app/reportSlice.js";
import { selectMe } from "##/src/app/profileSlice.js";
import { selectWorkspace } from "##/src/app/workspaceSlice.js";
import UserReport from "##/src/components/reports/UserReport";

const Reports = () => {
  const [tabValue, setTabValue] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const theme = useSelector(selectCurrentTheme);
  const dispatchToRedux = useDispatch();
  const user = useSelector(selectMe);
  const workspace = useSelector(selectWorkspace);
  
  useEffect(() => {
    if (user?._id && workspace?.selectedWorkspace) {
      const temp = workspace?.selectedWorkspace.users.filter((userObj) => {
        return (userObj.user._id || userObj.user) === user._id;
      });
      temp[0]?.isAdmin ? setIsAdmin(true) : "";
    }
  }, [user, workspace]);

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
    dispatchToRedux(resetDate());
  };

  return (
    <Container maxWidth="100%">
      <Typography
        variant="h5"
        fontWeight="bold"
        sx={{
          ml: "0px",
          mt: "30px",
          color: theme?.secondaryColor,
        }}
      >
        Reports
      </Typography>
      <Tabs
        TabIndicatorProps={{ sx: { backgroundColor: theme?.secondaryColor } }}
        value={tabValue}
        onChange={handleChangeTab}
        sx={{ mb: "20px", mt: "20px", borderBottom: "1px solid #eee" }}
      >
        {isAdmin ? (
          [
            <Tab
              key={0}
              sx={{
                "&.Mui-selected": {
                  color: "#000",
                  fontWeight: "bold",
                  borderLeft: "1px solid #eee",
                  borderRight: "1px solid #eee",
                },
              }}
              label="Summary"
            />,
            <Tab
              key={1}
              sx={{
                "&.Mui-selected": {
                  color: "#000",
                  fontWeight: "bold",
                  borderLeft: "1px solid #eee",
                  borderRight: "1px solid #eee",
                },
              }}
              label="Summary by Member"
            />,
            <Tab
              key={2}
              sx={{
                "&.Mui-selected": {
                  color: "#5a5a5a",
                  fontWeight: "bold",
                },
              }}
              label="Detailed"
            />,
          ]
        ) : (
          <Tab
            sx={{
              "&.Mui-selected": {
                color: theme?.secondaryColor,
                fontWeight: "bold",
              },
            }}
            label="User"
          />
        )}
      </Tabs>

      {tabValue === 0 && (isAdmin ? <Summary theme={theme}/> :<UserReport/> )}
      {tabValue === 1 && <SummaryByDev theme={theme} />}
      {tabValue === 2 && <Detailed theme={theme} />}
    </Container>
  );
};

export default Reports;
