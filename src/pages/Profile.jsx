import React, { useState } from "react";
import {
  Box,
  Container,
  CssBaseline,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  changePassword,
  selectMe,
  updateProfile,
} from "##/src/app/profileSlice.js";
import { selectCurrentTheme } from "##/src/app/themeSlice.js";
import ProfileUpdate from "##/src/components/profile/ProfileUpdate.jsx";
import ChangePassword from "##/src/components/profile/ChangePassword.jsx";
import { notify } from "##/src/app/alertSlice.js";

const Profile = ({ setProgress }) => {
  const [value, setValue] = useState(0);
  const [userInfo, setUserInfo] = useState({});
  const [password, setPassword] = useState({});
  const [buttonLoading, setButtonLoading] = useState(false);
  const user = useSelector(selectMe);
  const theme = useSelector(selectCurrentTheme);
  const dispatchToRedux = useDispatch();

  const handleChange = (e, newValue) => {
    setValue(newValue);
  };

  const handleUpdateProfile = async () => {
    try {
      if (userInfo.name.trim() === "") {
        dispatchToRedux(
          notify({
            type: "warning",
            message: "Please enter a name before updating your profile.",
          }),
        );
      } else if (userInfo.name === user.name) {
        dispatchToRedux(
          notify({
            type: "info",
            message:
              "You entered the same name as before. No changes were made.",
          }),
        );
      } else {
        setButtonLoading(true);
        setProgress(30);
        await dispatchToRedux(
          updateProfile({ userId: user._id, updatedName: userInfo.name }),
        );
        setProgress(100);
        setButtonLoading(false);
        dispatchToRedux(
          notify({ type: "success", message: "Profile Updated Successfully" }),
        );
      }
    } catch (error) {
      setProgress(100);
      setButtonLoading(false);
      dispatchToRedux(
        notify({
          type: "error",
          message: "Something went wrong. Please try again",
        }),
      );
    }
  };

  const handleChangePassword = async () => {
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
    try {
      setButtonLoading(true);
      setProgress(30);
      await dispatchToRedux(
        changePassword({
          userId: user._id,
          oldPassword: password.currentPassword,
          password: password.newPassword,
        }),
      ).unwrap();
      dispatchToRedux(
        notify({ type: "success", message: "Password Updated Successfully" }),
      );
      setPassword({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setProgress(100);
      setButtonLoading(false);
    } catch (error) {
      setProgress(100);
      setButtonLoading(false);
      dispatchToRedux(
        notify({
          type: "error",
          message: `Failed, ${error.message}`,
        }),
      );
    }
  };

  return (
    user && (
      <Box>
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{
            ml: "25px",
            mt: "50px",
            color: theme?.secondaryColor,
          }}
        >
          Profile
        </Typography>
        <CssBaseline />
        <Container maxWidth="100%">
          <Tabs
            TabIndicatorProps={{
              sx: { backgroundColor: theme?.secondaryColor },
            }}
            sx={{
              mb: "20px",
              mt: "20px",
              ":focus": {
                color: theme?.secondaryColor,
                borderBottom: `2px solid ${theme?.secondaryColor}`,
              },
              borderBottom: "1px solid #ddd",
            }}
            value={value}
            onChange={handleChange}
          >
            <Tab
              sx={{
                "&.Mui-selected": {
                  color: "#5a5a5a",
                  fontWeight: "400",
                  borderLeft: "1px solid #eee",
                  borderRight: "1px solid #eee",
                },

                textTransform: "capitalize",
              }}
              label="profile"
            />
            <Tab
              sx={{
                "&.Mui-selected": {
                  color: "#5a5a5a",
                  fontWeight: "500",
                  borderLeft: "1px solid #eee",
                  borderRight: "1px solid #eee",
                },
                textTransform: "capitalize",
              }}
              label="Change Password"
            />
          </Tabs>
        </Container>
        {value === 0 && (
          <ProfileUpdate
            onUpdate={handleUpdateProfile}
            user={user}
            theme={theme}
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            buttonLoading={buttonLoading}
          />
        )}
        {value === 1 && (
          <ChangePassword
            onSave={handleChangePassword}
            theme={theme}
            password={password}
            setPassword={setPassword}
            buttonLoading={buttonLoading}
          />
        )}
      </Box>
    )
  );
};

export default Profile;
