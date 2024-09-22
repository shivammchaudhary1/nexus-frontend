import {
  Box,
  Button,
  Container,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import ProfileConfirmationButton from "./ProfileConfirmationButton";
import { useDispatch } from "react-redux";
import { notify } from "##/src/app/alertSlice.js";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { isValidPassword } from "../../utility/miscellaneous/passwordValidation.js";

const ChangePassword = ({
  onSave,
  theme,
  password,
  setPassword,
  buttonLoading,
}) => {
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatchToRedux = useDispatch();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPassword({ ...password, [name]: value });
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleSave = () => {
    if (!password.currentPassword) {
      dispatchToRedux(
        notify({
          type: "warning",
          message: "Please enter current password",
        }),
      );
      return;
    }

    if (!password.newPassword || !password.confirmPassword) {
      dispatchToRedux(
        notify({
          type: "warning",
          message: "Please enter required fields",
        }),
      );
      return;
    }

    if (password.newPassword !== password.confirmPassword) {
      dispatchToRedux(
        notify({
          type: "warning",
          message: "New password and confirm password do not match ",
        }),
      );
      return;
    }
    setIsConfirmationModalOpen(true);
  };

  const handleConfirm = async () => {
    if (!isValidPassword(password.newPassword)) {
      dispatchToRedux(
        notify({
          type: "warning",
          message:
            "Password requires: 8+ characters, at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.",
        }),
      );
      return;
    }

    await onSave();
    setIsConfirmationModalOpen(false);
  };

  const handleClose = () => {
    setIsConfirmationModalOpen(false);
  };

  return (
    <div style={{ display: "flex" }}>
      <Box>
        <Container
          maxWidth="xs"
          style={{
            textAlign: "center",
          }}
        >
          <Box>
            <TextField
              label="Current Password"
              type={showPassword ? "text" : "password"}
              name="currentPassword"
              value={password.currentPassword || ""}
              onChange={handleChange}
              fullWidth
              margin="dense"
              required
              // InputProps={{
              //   endAdornment: (
              //     <InputAdornment position="end">
              //       <IconButton
              //         onClick={handleTogglePasswordVisibility}
              //         edge="end"
              //       >
              //         {showPassword ? <Visibility /> : <VisibilityOff />}
              //       </IconButton>
              //     </InputAdornment>
              //   ),
              // }}
            />
            <TextField
              type={showPassword ? "text" : "password"}
              label="New Password"
              name="newPassword"
              value={password.newPassword || ""}
              onChange={handleChange}
              fullWidth
              margin="dense"
              required
              // InputProps={{
              //   endAdornment: (
              //     <InputAdornment position="end">
              //       <IconButton
              //         onClick={handleTogglePasswordVisibility}
              //         edge="end"
              //       >
              //         {showPassword ? <Visibility /> : <VisibilityOff />}
              //       </IconButton>
              //     </InputAdornment>
              //   ),
              // }}
            />
            <TextField
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              label="Confirm Password"
              value={password.confirmPassword || ""}
              onChange={handleChange}
              fullWidth
              margin="dense"
              required
              // InputProps={{
              //   endAdornment: (
              //     <InputAdornment position="end">
              //       <IconButton
              //         onClick={handleTogglePasswordVisibility}
              //         edge="end"
              //       >
              //         {showPassword ? <Visibility /> : <VisibilityOff />}
              //       </IconButton>
              //     </InputAdornment>
              //   ),
              // }}
            />
            <Box
              sx={{
                // border: "1px solid black",
                marginTop: "-0.5rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingLeft: "1rem",
                paddingRight: "1rem",
              }}
            >
              <Typography variant="subtitle2">Show Password</Typography>
              <IconButton onClick={handleTogglePasswordVisibility} edge="end">
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </Box>
          </Box>
          <Box
            style={{
              textAlign: "left",
              marginTop: "10px",
              // marginTop: "-0.5rem",
            }}
          >
            <Button
              variant="outlined"
              onClick={handleSave}
              sx={{
                backgroundColor: theme.secondaryColor,
                border: "none",
                color: theme.textColor,
                mt: "5px",
                padding: "10px 0",
                ":hover": {
                  backgroundColor: theme.secondaryColor,
                  border: "none",
                  color: theme.textColor,
                },
                width: "100%",
              }}
            >
              Update Password
            </Button>
          </Box>
        </Container>
        <ProfileConfirmationButton
          open={isConfirmationModalOpen}
          onClose={handleClose}
          onConfirm={handleConfirm}
          theme={theme}
          buttonLoading={buttonLoading}
        />
      </Box>
    </div>
  );
};

export default ChangePassword;
