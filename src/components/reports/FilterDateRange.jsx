import React, { useEffect, useRef, useState } from "react";
import { DateRangePicker } from "react-date-range";
import format from "date-fns/format";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import "./CalendarRange.css";
import { Box, FormControl, TextField } from "@mui/material";

const FilterDateRange = ({setRange, range}) => {
  const [openCalendar, setOpenCalendar] = useState(false);
  const dateRef = useRef(null);

  useEffect(() => {
    document.addEventListener("keydown", hideOnEscape, true);
    document.addEventListener("click", hideOnClickOutside, true);

    return () => {
      document.removeEventListener("keydown", hideOnEscape);
      document.removeEventListener("click", hideOnClickOutside);
    };
  }, []);

  const hideOnEscape = (e) => {
    if (e.key === "Escape") {
      setOpenCalendar(false);
    }
  };

  const hideOnClickOutside = (e) => {
    if (dateRef.current && !dateRef.current.contains(e.target)) {
      setOpenCalendar(false);
    }
  };
  

  return (
    <FormControl sx={{ flex: 1 }} ref={dateRef}>
      <TextField
        label="Select Date"
        variant="standard"
        value={`${format(range[0].startDate, "MM/dd/yyyy")} to ${format(
          range[0].endDate,
          "MM/dd/yyyy",
        )}`}
        onClick={() => setOpenCalendar((openCalendar) => !openCalendar)}
      ></TextField>
      {openCalendar && (
        <Box className="calendarRangeBox">
          <DateRangePicker
            date={new Date()}
            onChange={(item) => setRange([item.selection])}
            editableDateInputs={true}
            moveRangeOnFirstSelection={false}
            ranges={range}
            months={2}
            direction="horizontal"
            className="calendarElement"
          />
        </Box>
      )}
    </FormControl>
  );
};

export default FilterDateRange;
