import React, { useEffect, useState } from "react";
import { Box, Container, CssBaseline, Fab, Tab, Tabs } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteHoliday,
  getHoliday,
  requestHoliday,
  selectHolidays,
  updateHoliday,
} from "##/src/app/holidaySlice.js";
import AddIcon from "@mui/icons-material/Add";
import { selectMe } from "##/src/app/profileSlice.js";
import { selectCurrentTheme } from "##/src/app/themeSlice.js";
import AddHoliday from "##/src/components/holidays/AddHoliday";
import UpdateHoliday from "##/src/components/holidays/UpdateHoliday";
import DeleteModal from "##/src/components/common/DeleteModal.jsx";
import "./Calendar.css";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import { selectUserRole } from "##/src/app/workspaceSlice.js";
import RenderHolidayTable from "../components/holidays/RenderHolidayTable";
import RenderCalendar from "../components/holidays/RenderCalendar";
import Leave from "./Leave";
import HolidayAdminPanel from "../components/holidays/HolidayAdminPanel";
import Calculation from "../components/calculation/Calculation";
import { getUsersLeave, selectUserLeaveData } from "../app/leaveSlice.js";
import { notify } from "##/src/app/alertSlice.js";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const CalendarAndHoliday = ({ setProgress }) => {
  const [value, setValue] = useState(0);
  const [addIsModalOpen, setAddIsModalOpen] = useState(false);
  const [updateIsModalOpen, setUpdateIsModalOpen] = useState(false);
  const [selectedHoliday, setSelectedHoliday] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [holidayToDelete, setHolidayToDelete] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [holidayDetails, setHolidayDetails] = useState(null);
  const [leaveDetails, setLeaveDetails] = useState(null);
  const [componentLoading, setComponentLoading] = useState(false);

  const dispatchToRedux = useDispatch();
  const holidays = useSelector(selectHolidays);
  const user = useSelector(selectMe);
  const theme = useSelector(selectCurrentTheme);
  const isAdmin = useSelector(selectUserRole);
  const userLeave = useSelector(selectUserLeaveData);

  const filteredUserLeave = userLeave?.filter(
    (leave) => leave.status === "approved",
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user) {
          setProgress(30);
          setComponentLoading(true);
          await Promise.all([
            dispatchToRedux(getHoliday({ userId: user._id })),
            dispatchToRedux(getUsersLeave({ userId: user._id })),
          ]);

          setComponentLoading(false);
          setProgress(100);
        }
      } catch (error) {
        setComponentLoading(false);
        setProgress(100);
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, [dispatchToRedux, user]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleEditClick = (holiday) => {
    setSelectedHoliday(holiday);
    setUpdateIsModalOpen(true);
  };

  const handleUpdateHoliday = ({
    holidayId,
    title,
    date,
    description,
    type,
  }) => {
    dispatchToRedux(
      updateHoliday({
        holidayId,
        title,
        date,
        description,
        type,
        workspaceId: user?.currentWorkspace,
        userId: user?._id,
      }),
    );
    setUpdateIsModalOpen(false);
    setSelectedHoliday(null);
  };

  const handleAddHoliday = async ({
    title,
    date,
    description,
    type,
    handleClose,
  }) => {
    if (!title) {
      return dispatchToRedux(notify({ type: "error", message: "Please Add Title" }));
    }
    if (!date) {
      return dispatchToRedux(notify({ type: "error", message: "Please Add Date" }));
    }
    if (!type) {
      return dispatchToRedux(notify({ type: "error", message: "Please Select Type" }));
    }
    try {
      setProgress(30);
      await dispatchToRedux(
        requestHoliday({
          title,
          date,
          description,
          type,
          workspaceId: user?.currentWorkspace,
          userId: user?._id,
        }),
      );
      setProgress(100);
      handleClose();
      dispatchToRedux(
        notify({ type: "success", message: "Holiday Added Successfully" }),
      );
    } catch (error) {
      setProgress(100);

      dispatchToRedux(
        notify({
          type: "error",
          message: "Error adding Holiday. Please try again.",
        }),
      );
      handleClose();
    }
  };

  const handleDeleteClick = (holiday) => {
    setHolidayToDelete(holiday);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDeleteHoliday = () => {
    if (holidayToDelete) {
      dispatchToRedux(
        deleteHoliday({
          holidayId: holidayToDelete._id,
          userId: user._id,
        }),
      );
      setIsDeleteModalOpen(false);
      setHolidayToDelete(null);
    }
  };

  const tileContent = ({ date, view }) => {
    const matchingHoliday = holidays.find(
      (holiday) =>
        new Date(holiday.date).getDate() === date.getDate() &&
        new Date(holiday.date).getMonth() === date.getMonth() &&
        new Date(holiday.date).getFullYear() === date.getFullYear(),
    );

    const matchingUserLeave = filteredUserLeave?.find(
      (leave) =>
        new Date(leave.startDate).getDate() === date.getDate() &&
        new Date(leave.startDate).getMonth() === date.getMonth() &&
        new Date(leave.startDate).getFullYear() === date.getFullYear(),
    );

    if (view === "month" && (matchingHoliday || matchingUserLeave)) {
      return (
        <div
          className={`highlighted-tile ${
            matchingUserLeave ? "user-leave" : ""
          }`}
          onClick={() => {
            setIsDrawerOpen(true);
            setHolidayDetails(matchingHoliday);
            setLeaveDetails(matchingUserLeave);
          }}
        >
          {matchingHoliday && (
            <>
              <span
                className="highlighted-title"
                style={{
                  fontSize: "12px",
                  color: "green",
                  cursor: "context-menu",
                }}
              >
                {matchingHoliday.title}
              </span>
              <p
                className="highlighted-title"
                style={{
                  fontSize: "12px",
                  fontWeight: "lighter",
                  color: "green",
                  cursor: "context-menu",
                }}
              >
                ({matchingHoliday.type})
              </p>
            </>
          )}
          {matchingUserLeave && (
            <>
              <span
                className="highlighted-title"
                style={{
                  fontSize: "12px",
                  color: "red",
                  cursor: "context-menu",
                }}
              >
                {matchingUserLeave.title}
              </span>
              <p
                className="highlighted-title"
                style={{
                  fontSize: "12px",
                  fontWeight: "lighter",
                  color: "red",
                  cursor: "context-menu",
                }}
              >
                {matchingUserLeave.type}
              </p>
            </>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <Box>
      <CssBaseline />

      <Container maxWidth="100%">
        {isAdmin && (
          <Fab
            color="primary"
            aria-label="add"
            sx={{ position: "fixed", bottom: "20px", right: "20px" }}
            onClick={() => setAddIsModalOpen(true)}
          >
            <AddIcon />
          </Fab>
        )}

        <Tabs
          TabIndicatorProps={{ sx: { backgroundColor: theme?.secondaryColor } }}
          value={value}
          onChange={handleChange}
          sx={{ mb: "40px", mt: "20px", borderBottom: "1px solid #ddd" }}
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
            label="Calendar"
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
            label="Leave Tracker"
          />
          {isAdmin && (
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
              label="Holiday Settings"
            />
          )}

          {isAdmin && (
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
              label="Calculation"
            />
          )}
        </Tabs>

        {value === 0 && (
          <RenderCalendar
            tileContent={tileContent}
            componentLoading={componentLoading}
          />
        )}
        {value === 1 && <Leave setProgress={setProgress} />}
        {isAdmin && value === 2 && (
          <HolidayAdminPanel theme={theme} setProgress={setProgress}>
            <RenderHolidayTable
              holidays={holidays}
              handleEditClick={handleEditClick}
              handleDeleteClick={handleDeleteClick}
              theme={theme}
            />
          </HolidayAdminPanel>
        )}
        {isAdmin && value === 3 && (
          <Calculation theme={theme} setProgress={setProgress} />
        )}
      </Container>

      <AddHoliday
        open={addIsModalOpen}
        handleClose={() => setAddIsModalOpen(false)}
        handleAddHoliday={handleAddHoliday}
        theme={theme}
      />
      <UpdateHoliday
        open={updateIsModalOpen}
        handleClose={() => setUpdateIsModalOpen(false)}
        handleUpdateHoliday={handleUpdateHoliday}
        theme={theme}
        holidayId={selectedHoliday?._id}
        selectedHoliday={selectedHoliday}
      />
      <DeleteModal
        open={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onDelete={handleDeleteHoliday}
        title={"Delete Holiday"}
        text={"Are you sure you want to delete this holiday?"}
        theme={theme}
      />
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        {(holidayDetails || leaveDetails) && (
          <Box
            style={{
              width: "350px",
              padding: "16px ",
              border: "1px solid #ccc",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              backgroundColor: "#fff",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                color: "white",
                background: theme?.secondaryColor,
                padding: "10px",
                textAlign: "center",
                fontWeight: "500",
              }}
            >
              Leave Details
            </Typography>
            <Container
              maxWidth="sm"
              sx={{
                border: `1px solid ${theme?.secondaryColor}`,
                borderRadius: "0 0px 5px 5px",
              }}
            >
              {holidayDetails && (
                <>
                  <Typography style={{ margin: "10px 0", color: "#333" }}>
                    Title : {holidayDetails.title}
                  </Typography>
                  <Typography style={{ margin: "10px 0", color: "#000" }}>
                    <span>Date:</span>
                    <span style={{ color: "#666" }}>
                      {" "}
                      {formatDate(
                        holidayDetails.date
                          ? holidayDetails.date
                          : holidayDetails.startDate,
                      )}
                    </span>
                  </Typography>
                  <Typography style={{ margin: "10px 0", color: "#000" }}>
                    <span>Description:</span>{" "}
                    <span style={{ color: "#555" }}>
                      {holidayDetails.description}
                    </span>
                  </Typography>
                </>
              )}
              {leaveDetails && (
                <>
                  <Typography style={{ margin: "10px 0", color: "#333" }}>
                    Title : {leaveDetails.title}
                  </Typography>
                  <Typography style={{ margin: "10px 0", color: "#000" }}>
                    <span>Date:</span>
                    <span style={{ color: "#666" }}>
                      {" "}
                      {formatDate(leaveDetails.startDate)}
                    </span>
                  </Typography>
                  <Typography style={{ margin: "10px 0", color: "#000" }}>
                    <span>Description:</span>{" "}
                    <span style={{ color: "#555" }}>
                      {leaveDetails.description}
                    </span>
                  </Typography>
                </>
              )}
            </Container>
          </Box>
        )}
      </Drawer>
    </Box>
  );
};

export default CalendarAndHoliday;
