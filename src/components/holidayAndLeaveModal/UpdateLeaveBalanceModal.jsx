import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { CloseButton, SaveButton } from "##/src/components/buttons/index.js";
import { notify } from "##/src/app/alertSlice.js";
import { useDispatch } from "react-redux";
import { capitalizeFirstWord } from "../../utility/miscellaneous/capitalize";

const UpdateLeaveBalanceModal = ({
  isOpen,
  onClose,
  onSubmit,
  theme,
  leaveTypes,
  buttonLoading,
  userCurrentLeaveBalance,
}) => {
  const [leaveType, setLeaveType] = useState("");
  const [amount, setAmount] = useState(0); // Initialize amount with 0
  const [initialBalance, setInitialBalance] = useState(0);
  const dispatchToRedux = useDispatch();

  useEffect(() => {
    // Set the initial balance when leaveType changes
    const selectedLeaveType = userCurrentLeaveBalance?.leaveBalance.find(
      (balance) => balance.type === leaveType,
    );
    if (selectedLeaveType) {
      setInitialBalance(selectedLeaveType.value);
      setAmount(selectedLeaveType.value);
    }
  }, [leaveType, userCurrentLeaveBalance?.leaveBalance]);

  const handleLeaveTypeChange = (event) => {
    setLeaveType(event.target.value);
  };

  // const handleAmountChange = (event) => {
  //   if(isNaN(event.target.value )){
  //     dis
  //   }
  //   setAmount(parseFloat(event.target.value));
  // };

  const handleAmountChange = (event) => {
    if (isNaN(event.target.value)) {
      dispatchToRedux(
        notify({ type: "error", message: "Please enter a valid number" }),
      );
    } else {
      setAmount(parseFloat(event.target.value));
    }
  };

  const handleIncrement = () => {
    setAmount(amount + 1);
  };

  const handleDecrement = () => {
    setAmount(amount - 1);
  };

  const handleSubmit = async () => {
    await onSubmit({ leaveType, amount });
    // onClose();
    setInitialBalance(0);
    setAmount(0);
    setLeaveType("");
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#FFFFFF",
          padding: "10px",
          width: ["80%", "50%", "35%"],
          borderRadius: "5px",
          gap: "12px",
          position: "relative",
          paddingBottom: "10px",
        }}
      >
        <Typography
          sx={{
            color: theme?.secondaryColor,
            fontSize: "18px",
            paddingTop: "10px",
          }}
        >
          Update Leave Balance
        </Typography>
        <FormControl sx={{ width: "96%" }}>
          <InputLabel>Select Type</InputLabel>
          <Select
            value={leaveType}
            onChange={handleLeaveTypeChange}
            label="Types"
            variant="standard"
          >
            {leaveTypes.map((type) => (
              <MenuItem key={type.leaveType} value={type.leaveType}>
                {capitalizeFirstWord(type.leaveType)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          value={amount}
          onChange={handleAmountChange}
          sx={{ width: "96%" }}
          variant="standard"
          label="Value"
          type="number"
          placeholder="Enter amount in Numbers"
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "90%",
            gap: "6%",
          }}
        >
          <Button
            variant="contained"
            sx={{
              backgroundColor: theme?.secondaryColor,
              fontWeight: "bold",
              width: "96%",
              fontSize: "18px",
              ":hover": {
                backgroundColor: theme?.secondaryColor,
              },
            }}
            onClick={handleIncrement}
          >
            +
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: theme?.secondaryColor,
              fontWeight: "bold",
              width: "96%",
              fontSize: "18px",
              ":hover": {
                backgroundColor: theme?.secondaryColor,
              },
            }}
            onClick={handleDecrement}
          >
            -
          </Button>
        </Box>
        {buttonLoading ? (
          <Button
            variant="contained"
            sx={{
              backgroundColor: theme?.secondaryColor,
              width: "96%",
              fontSize: "16px",
              ":hover": {
                backgroundColor: theme?.secondaryColor,
              },
            }}
          >
            <CircularProgress color="inherit" />
          </Button>
        ) : (
          <SaveButton onSave={handleSubmit} theme={theme} />
        )}
        <CloseButton onClose={onClose} theme={theme} />
      </Box>
    </Modal>
  );
};

export default UpdateLeaveBalanceModal;
