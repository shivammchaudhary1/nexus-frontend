import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { FONTS } from "##/src/utility/utility.js";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentTheme } from "##/src/app/themeSlice.js";
import { getReport, selectReport } from "##/src/app/reportSlice.js";
import { formatDuration } from "##/src/utility/timer.js";
import FilterDateRange from "##/src/components/reports/FilterDateRange";
import FilterClients from "##/src/components/reports/FilterClients";
import FilterProjects from "##/src/components/reports/FilterProjects";
import SummaryChart from "##/src/components/reports/SummaryChart";
import { subMonths } from "date-fns";
import { notify } from "##/src/app/alertSlice.js";

const EntryRow = ({ report }) => {
  return (
    <TableRow>
      <TableCell sx={{ textAlign: "left", fontFamily: FONTS.body }}>
        {report.projectDetails.name}
      </TableCell>
      <TableCell sx={{ textAlign: "center", fontFamily: FONTS.body }}>
        {formatDuration(report.totalTimeSpent)}
      </TableCell>
      <TableCell sx={{ textAlign: "center", fontFamily: FONTS.body }}>
        {report.projectDetails.estimatedHours}
      </TableCell>
    </TableRow>
  );
};

export default function Summary() {
  const headings = ["Time Spent", "Estimated Hours"];
  const [toggle, setToggle] = useState("table");
  const [selectedClients, setSelectedClients] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [range, setRange] = useState([
    {
      startDate: subMonths(new Date(), 1),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const { allReports, isRequestMade, tempDateReports } =
    useSelector(selectReport);
  const [report, setReport] = useState(allReports);
  const theme = useSelector(selectCurrentTheme);
  const dispatchToRedux = useDispatch();
  const tableHeadStyle = {
    fontFamily: FONTS.subheading,
    fontSize: "16px",
    fontWeight: "bold",
    // color: theme?.textColor,
    color: "#5a5a5a",

    textAlign: "center",
  };
  useEffect(() => {
    if (!isRequestMade) {
      const temp = new Date();
      temp.setMonth(temp.getMonth() - 1); // Subtract 1 month
      const startDate = temp.toISOString();
      const endDate = new Date().toISOString();
      dispatchToRedux(getReport({ startDate, endDate }));
    }
    if (tempDateReports.length) {
      setReport(tempDateReports);
    } else {
      setReport(allReports);
    }
  }, [allReports, tempDateReports]);

  const handleFilter = async () => {
    const startDate = subMonths(new Date(), 1);
    const endDate = new Date();
    if (
      range[0].startDate.getDate() !== startDate.getDate() ||
      range[0].startDate.getMonth() !== startDate.getMonth() ||
      range[0].startDate.getFullYear() !== startDate.getFullYear() ||
      range[0].endDate.getDate() !== endDate.getDate() ||
      range[0].endDate.getMonth() !== endDate.getMonth() ||
      range[0].endDate.getFullYear() !== endDate.getFullYear()
    ) {
      await dispatchToRedux(
        getReport({
          startDate: range[0].startDate,
          endDate: range[0].endDate,
        }),
      );
    }
    if (selectedClients.length === 0 && selectedProjects.length === 0) {
      return;
    }
    setToggle("table");

    const filteredProjects = allReports.filter((project) => {
      const clientFilter =
        selectedClients.length === 0 ||
        selectedClients.includes(project.projectDetails.client._id);
      const projectFilter =
        selectedProjects.length === 0 || selectedProjects.includes(project._id);
      return clientFilter && projectFilter;
    });
    setReport(filteredProjects);
    dispatchToRedux(notify({ type: "success", message: "Filter Applied" }));
  };

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
        <FilterProjects
          allProjects={allReports}
          selectedProjects={selectedProjects}
          setSelectedProjects={setSelectedProjects}
        />
        <FilterClients
          allClients={allReports}
          selectedClients={selectedClients}
          setSelectedClients={setSelectedClients}
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
          onClick={handleFilter}
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
          <ToggleButton value="graph" sx={{ fontFamily: FONTS.body }}>
            Graph View
          </ToggleButton>
        </ToggleButtonGroup>
      </Container>
      {toggle === "table" ? (
        <Box sx={{ width: "100%" }}>
          <TableContainer>
            <Table size="small" aria-label="a dense table">
              <TableHead>
                <TableRow
                  sx={{
                    borderTop: "1px solid #eee",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <TableCell sx={{ ...tableHeadStyle, textAlign: "left" }}>
                    Project Name
                  </TableCell>
                  {headings?.map((heading, i) => {
                    return (
                      <TableCell key={i} sx={tableHeadStyle}>
                        {heading}
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {report?.length > 0 ? (
                  report?.map((report) => {
                    return <EntryRow key={report._id} report={report} />;
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      sx={{ textAlign: "center", backgroundColor: "#eee" }}
                    >
                      <Typography sx={{ py: "30px" }}>
                        No records found
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ) : (
        <SummaryChart reportData={report} />
      )}
    </Box>
  );
}
