import React, { useEffect, useRef, useState } from "react";
import Theme from "##/src/components/theme/Theme.jsx";
import { useDispatch, useSelector } from "react-redux";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { selectMe } from "##/src/app/profileSlice.js";
import EditEntryModal from "##/src/modals/EntryModal";
import { selectCurrentTheme } from "##/src/app/themeSlice.js";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import ContentEditable from "react-contenteditable";
import {
  selectEntries,
  selectEntryDay,
  selectLastEntry,
  updateEntryTitle,
} from "##/src/app/timerSlice.js";
import {
  deleteEntry,
  resumeTimer,
  selectTimer,
} from "##/src/app/timerSlice.js";
import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import { selectWorkspace } from "##/src/app/workspaceSlice";
import { formatDate, formatDuration } from "##/src/utility/timer.js";
import { validateDateAndWorkspace } from "##/src/utility/validation/validations.js";
import DeleteModal from "##/src/components/common/DeleteModal.jsx";
import { FONTS } from "##/src/utility/utility.js";
import { notify } from "##/src/app/alertSlice.js";
import { getMoreEntries } from "##/src/app/timerSlice.js";
import { setEntryDay } from "../app/timerSlice";
import BackdropLoader from "##/src/components/loading/BakdropLoader.jsx";

const EntryRow = ({
  entry,
  onPlay,
  onDelete,
  duration,
  day,
  theme,
  timer,
  setDisabledIcon,
  disabledIcon,
  workspace,
  setProgress,
}) => {
  const dispatchToRedux = useDispatch();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(entry.title);
  const text = useRef("");
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const handleOpen = () =>
    workspace?.isEditable ? setOpen(true) : setOpen(false);
  const handleClose = () => setOpen(false);
  const handleBlurEdit = async () => {
    if (!text.current) {
      return;
    }

    const tempEntry = { ...entry };

    tempEntry.title = text.current;
    await dispatchToRedux(updateEntryTitle({ entry: tempEntry }));
    dispatchToRedux(
      notify({ type: "success", message: "Title updated successfully" }),
    );
  };
  const handleChange = (e) => {
    if ((timer?.currentLog?._id || timer?.currentLog) === entry._id) {
      dispatchToRedux(
        notify({
          type: "warning",
          message: "Please stop the timer to update the title",
        }),
      );
      return;
    }

    const finalText = removeHtmlTagsAndSpaces(e.target.value);

    text.current = finalText;
    setTitle(finalText);
  };

  const removeHtmlTagsAndSpaces = (htmlString) => {
    let plainText = htmlString.replace(/<[^>]*>/g, " ");
    plainText = plainText.replace(/&nbsp;/g, " ");
    const trimmedText = plainText.replace(/\s+/g, " ").trim();
    return trimmedText;
  };

  return (
    <TableRow>
      <EditEntryModal
        entry={entry}
        open={open}
        handleClose={handleClose}
        task={entry.title}
        theme={theme}
        setProgress={setProgress}
      />
      <DeleteModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onDelete={onDelete}
        title={"Delete Entry"}
        text={
          "Entry will be removed permanently, Are you sure you want to delete this entry?"
        }
        theme={theme}
      />
      <TableCell
        sx={{
          textAlign: "left",
          fontFamily: FONTS.body,
          fontSize: "16px",
          color: "#868282",
          maxWidth: "100px",
        }}
      >
        <ContentEditable
          html={title}
          onBlur={handleBlurEdit}
          onChange={handleChange}
        />
      </TableCell>
      <TableCell
        sx={{
          textAlign: "center",
          fontFamily: FONTS.body,
          fontSize: "16px",
          color: "#868282",
        }}
      >
        {entry.project.name}
      </TableCell>
      <TableCell
        sx={{
          textAlign: "center",
          fontFamily: FONTS.body,
          fontSize: "16px",
          color: "#868282",
        }}
        onClick={handleOpen}
      >
        {formatDuration(duration)}
      </TableCell>
      <TableCell
        sx={{
          textAlign: "right",
          fontFamily: FONTS.body,
          fontSize: "16px",
          color: "#868282",
        }}
      >
        {!day && (
          <IconButton
            disabled={
              (timer?.currentLog?._id || timer?.currentLog) === entry._id &&
              disabledIcon
            }
            onClick={() => {
              onPlay();
              setDisabledIcon(true);
            }}
          >
            <PlayArrowOutlinedIcon sx={{ height: "30px", width: "30px" }} />
          </IconButton>
        )}
        <IconButton
          disabled={
            (timer?.currentLog?._id || timer?.currentLog) === entry._id &&
            disabledIcon
          }
          onClick={() => setOpenDeleteModal(true)}
        >
          <CloseOutlinedIcon sx={{ height: "30px", width: "30px" }} />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default function DashBoard({ setProgress }) {
  const dispatchToRedux = useDispatch();
  const workspace = useSelector(selectWorkspace);
  const { timer } = useSelector(selectTimer);
  const theme = useSelector(selectCurrentTheme);
  const user = useSelector(selectMe);
  const entryData = useSelector(selectEntries);
  const lastEntry = useSelector(selectLastEntry);
  const [entries, setEntries] = useState([]);
  const [duration, setDuration] = useState(0);
  const [disabledIcon, setDisabledIcon] = useState(false);
  const [entriesLoader, setEntriesLoader] = useState(false);
  const day = useSelector(selectEntryDay);

  useEffect(() => {
    let totalDuration = 0;
    if (!timer?.currentLog) {
      setDisabledIcon(false);
    } else {
      setDisabledIcon(true);
    }
    if (entryData.length) {
      const tempEntries = entryData?.filter((entry) => {
        if (
          validateDateAndWorkspace({
            workspace: user.currentWorkspace,
            date: formatDate(day),
            entry,
          }) &&
          entry.durationInSeconds
        ) {
          totalDuration += entry.durationInSeconds;
          return true;
        }
        return false;
      });
      setDuration(totalDuration);
      setEntries(tempEntries);
    } else {
      setEntries([]);
    }
  }, [timer, day, workspace.selectedWorkspace, entryData]);

  const handlePlay = async (entryId) => {
    await dispatchToRedux(resumeTimer({ entryId }));
  };

  const handleDelete = async (entryId) => {
    if (timer.currentLog === entryId) {
      alert("please stop timer to delete");
      return;
    }
    try {
      await dispatchToRedux(deleteEntry({ entryId }));
      dispatchToRedux(
        notify({ type: "success", message: "Entry Deleted Successfully" }),
      );
    } catch (error) {
      dispatchToRedux(
        notify({ type: "error", message: "Something went wrong, Try Again" }),
      );
    }
  };

  const handlePrevious = async () => {
    setEntriesLoader(true);
    const entryDate = new Date(formatDate(day));
    entryDate.setHours(0, 0, 0, 0);
    if (entryDate.toISOString() === lastEntry) {
      await dispatchToRedux(getMoreEntries({ lastEntry }));
    }
    dispatchToRedux(setEntryDay({ day: day - 1 }));
    setEntriesLoader(false);
  };

  const handleNext = async () => {
    if (day >= 0) return;
    dispatchToRedux(setEntryDay({ day: day + 1 }));
  };

  return (
    <Box>
      <Theme setProgress={setProgress} />
      <Box sx={{ width: "100%" }}>
        <Typography
          variant="h6"
          align="center"
          sx={{
            margin: "1.5rem",
            fontFamily: "sans-serif",
            fontSize: "25px",
            color: "#5A5A5A",
            lineHeight: "37px",
          }}
        >
          <IconButton onClick={handlePrevious}>
            <ArrowBackIosIcon />
          </IconButton>
          {formatDate(day)} |{" "}
          <IconButton>
            <AccessTimeIcon />
          </IconButton>{" "}
          {formatDuration(duration)}
          <IconButton onClick={handleNext}>
            <ArrowForwardIosIcon />
          </IconButton>
        </Typography>
        {entriesLoader ? (
          // <EntriesLoader />
          <BackdropLoader open={entriesLoader} />
        ) : (
          <TableContainer>
            <Table size="small" aria-label="a dense table">
              <TableBody>
                {entries?.length > 0 ? (
                  entries?.map((entry) => {
                    return (
                      entry.durationInSeconds && (
                        <EntryRow
                          key={entry._id}
                          entry={entry}
                          onPlay={() => handlePlay(entry._id)}
                          onDelete={() => handleDelete(entry._id)}
                          duration={entry.durationInSeconds}
                          day={day}
                          theme={theme}
                          timer={timer}
                          setDisabledIcon={setDisabledIcon}
                          disabledIcon={disabledIcon}
                          workspace={workspace?.selectedWorkspace}
                          setProgress={setProgress}
                        />
                      )
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      sx={{ textAlign: "center", backgroundColor: "#eee" }}
                    >
                      <Typography sx={{ py: "30px" }}>
                        No entries found
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Box>
  );
}
