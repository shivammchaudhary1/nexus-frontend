import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { selectMe } from "##/src/app/profileSlice.js";
import { FONTS } from "##/src/utility/utility.js";
import {  useDispatch, useSelector } from "react-redux";
import { selectCurrentTheme } from "##/src/app/themeSlice.js";
import FilterDateRange from "##/src/components/reports/FilterDateRange";
import ProjectFilter from "##/src/components/reports/ProjectFilter";
import SummaryChart from "##/src/components/reports/SummaryChart";
import { selectProjects } from "##/src/app/projectSlice.js";
import DataDisplay from "##/src/components/reports/UserReportData.jsx";
import { getUserEntries } from "##/src/utility/report.js";
import { notify } from "##/src/app/alertSlice.js";
import { selectUserReport, setUserReport } from "##/src/app/reportSlice.js";
import ComponentLoader from "##/src/components/loading/ComponentLoader.jsx";

function UserReport() {
  const workspaceProjects = useSelector(selectProjects);
  const reports = useSelector(selectUserReport);
  const user = useSelector(selectMe);
  const dispatchToRedux = useDispatch();

  const [toggle, setToggle] = useState("table");
  const [isRequested, setIsRequested] = useState(false);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [range, setRange] = useState([
    {
      startDate: (() => {
        const date = new Date();
        return new Date(date.getFullYear(), date.getMonth(), 1);
      })(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  
  const theme = useSelector(selectCurrentTheme);

  async function handleGetUserEntries() {
    try {
      const entriesData = await getUserEntries(
        selectedProjects,
        range,
        user._id,
      );
      dispatchToRedux(setUserReport(entriesData));
      dispatchToRedux(
        notify({
          type: "success",
          message: "Report generated successfully.",
        }),
      );
    } catch (error) {
      dispatchToRedux(
        notify({
          type: "error",
          message: `Failed to get the report: ${error.message}, Please try again later.`,
        }),
      );
    }
    setIsRequested(true);
  }

  useEffect(() => {
    if (user && !reports.length && !isRequested) {
      handleGetUserEntries();
    }
  }, [user, reports]);


  const handleToggle = (event) => {
    if (toggle == event.target.value || !event.target.value) {
      return;
    }
    setToggle(event.target.value);
  };

  return (
    <Box>
      <Container
        maxWidth="100%"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "20px",
          marginBottom: "20px",
        }}
      >
        <ProjectFilter
          projects={workspaceProjects}
          selectedProjects={selectedProjects}
          onSelect={setSelectedProjects}
        />
        <FilterDateRange setRange={setRange} range={range} />
        <Box
          sx={{
            color: theme?.secondaryColor,
            fontFamily: FONTS.body,
            fontWeight: "bold",
            fontSize: "20px",
            "&:hover": {
              cursor: "pointer",
            },
          }}
          onClick={handleGetUserEntries}
        >
          Go
        </Box>
      </Container>
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
          <ToggleButton
            value="table"
            sx={{
              fontFamily: FONTS.body,
            }}
          >
            Table View
          </ToggleButton>
          {/* TODO: Enable once chart is ready */}
          {/* <ToggleButton value="graph" sx={{ fontFamily: FONTS.body }}>
            Graph View
          </ToggleButton> */}
        </ToggleButtonGroup>
      </Container>
      {toggle === "table" ? (
        <ComponentLoader isLoading={!isRequested&&!reports.length?true:false}>
          <DataDisplay data={reports} />
        </ComponentLoader>
      ) : (
        <SummaryChart reportData={reports} />
      )}
      {}
    </Box>
  );
}

export default UserReport;