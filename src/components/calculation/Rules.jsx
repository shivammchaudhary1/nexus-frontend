import React, { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { selectMe } from "##/src/app/profileSlice.js";
import {
  getCalculationRule,
  selectCalculationRules,
  updateCalculationRule,
} from "../../app/calculationSlice.js";
import { FONTS } from "##/src/utility/utility.js";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { selectCurrentTheme } from "##/src/app/themeSlice.js";
import UpdateRuleModal from "./UpdateRuleModal.jsx";
import { notify } from "##/src/app/alertSlice.js";
import { capitalizeFirstWord } from "##/src/utility/miscellaneous/capitalize.js";

const Rules = ({ setProgress }) => {
  const dispatchToRedux = useDispatch();
  const user = useSelector(selectMe);
  const rules = useSelector(selectCalculationRules);
  const theme = useSelector(selectCurrentTheme);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRuleId, setSelectedRuleId] = useState(null);
  const [componentLoading, setComponentLoading] = useState(false);

  const tableBodyStyle = {
    fontFamily: FONTS.body,
    fontSize: "14px",
    textAlign: "center",
  };
  const tableHeadStyle = {
    fontFamily: FONTS.subheading,
    fontSize: "16px",
    fontWeight: "bold",
    color: "#5a5a5a",
    textAlign: "center",
  };

  const formatWeekdays = (weekdays) => {
    return weekdays
      .map((weekday) => weekday.charAt(0).toUpperCase() + weekday.slice(1))
      .join(", ");
  };

  useEffect(() => {
    const fetchRule = async () => {
      try {
        if (user) {
          setComponentLoading(true);
          setProgress(30);
          await dispatchToRedux(
            getCalculationRule({
              workspaceId: user.currentWorkspace,
              userId: user._id,
            }),
          ).unwrap();
          setProgress(100);
          setComponentLoading(false);
        }
      } catch (error) {
        setProgress(100);
        dispatchToRedux(notify({ type: "error", message: `Failed to get rules, ${error.message}` }));
        setComponentLoading(false);
      }
    };

    fetchRule();
  }, []);

  const handleEdit = (ruleId) => {
    setSelectedRuleId(ruleId);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedRuleId(null);
  };

  const handleUpdateRule = async (formData) => {
    const { workingHours, weekDays, isActive } = formData;
    const workingDays = weekDays.length;

    try {
      setProgress(30);
      await dispatchToRedux(
        updateCalculationRule({
          ruleId: selectedRuleId,

          workingHours,
          workingDays,
          weekDays,
          isActive,
        }),
      ).unwrap();
      handleModalClose();
      setProgress(100);
      dispatchToRedux(
        notify({
          type: "success",
          message: "Rules for the week updated successfully",
        }),
      );
    } catch (error) {
      setProgress(100);
      dispatchToRedux(
        notify({ type: "error", message: `Failed to update rules, ${error.message}` }),
      );
    }
  };

  return (
    <>
      <TableContainer sx={{ maxHeight: "60vh" }}>
        <Table
          size="small"
          aria-label="a dense table"
          sx={{
            "& .MuiTableCell-root": {
              padding: "10px 0px",
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
              <TableCell sx={tableHeadStyle}>Title</TableCell>
              <TableCell sx={tableHeadStyle}>Working Days / Week</TableCell>
              <TableCell sx={tableHeadStyle}>Working Hours / Day</TableCell>
              <TableCell sx={tableHeadStyle}>Weekdays</TableCell>
              <TableCell sx={tableHeadStyle}>Is Active</TableCell>
              <TableCell sx={tableHeadStyle}>Action</TableCell>
            </TableRow>
          </TableHead>
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
            <TableBody>
              {rules?.map((rule) => (
                <TableRow key={rule._id}>
                  <TableCell sx={tableBodyStyle}>
                    {capitalizeFirstWord(rule.title)}
                  </TableCell>
                  <TableCell sx={tableBodyStyle}>{rule.workingDays}</TableCell>
                  <TableCell sx={tableBodyStyle}>{rule.workingHours}</TableCell>
                  <TableCell sx={tableBodyStyle}>
                    {formatWeekdays(rule.weekDays)}
                  </TableCell>
                  <TableCell sx={tableBodyStyle}>
                    {rule.isActive ? "Yes" : "No"}
                  </TableCell>
                  <TableCell sx={tableBodyStyle}>
                    <IconButton onClick={() => handleEdit(rule._id)}>
                      <EditOutlinedIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </TableContainer>
      <UpdateRuleModal
        open={isModalOpen}
        onClose={handleModalClose}
        onUpdate={handleUpdateRule}
        theme={theme}
      />
    </>
  );
};

export default Rules;
