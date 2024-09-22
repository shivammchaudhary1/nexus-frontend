import {
  Box,
  Button,
  CircularProgress,
  Container,
  TextField,
} from "@mui/material";
import React, { useEffect } from "react";
import { capitalizeFirstWord } from "##/src/utility/miscellaneous/capitalize.js";

const ProfileUpdate = ({
  onUpdate,
  user,
  theme,
  setUserInfo,
  userInfo,
  buttonLoading,
}) => {
  useEffect(() => {
    setUserInfo({ name: user.name, email: user.email });
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  return (
    <div style={{ display: "flex" }}>
      <Box>
        <Container maxWidth="xs">
          <Box>
            <TextField
              label="Name"
              name="name"
              value={capitalizeFirstWord(userInfo.name) || ""}
              onChange={handleChange}
              fullWidth
              margin="dense"
            />
            <TextField
              variant="filled"
              label="Email"
              name="email"
              value={userInfo.email || ""}
              fullWidth
              margin="dense"
              InputProps={{
                readOnly: true,
              }}
            />
          </Box>
          <Box style={{ textAlign: "right" }}>
            {buttonLoading ? (
              <Button
                variant="outlined"
                sx={{
                  backgroundColor: theme?.secondaryColor,
                  border: "none",
                  color: theme?.textColor,
                  mt: "10px",
                  padding: "10px 0",
                  ":hover": {
                    backgroundColor: theme?.secondaryColor,
                    border: "none",
                    color: theme?.textColor,
                  },
                  width: "100%",
                }}
              >
                <CircularProgress color="inherit" size="1.5rem" />
              </Button>
            ) : (
              <Button
                variant="outlined"
                onClick={onUpdate}
                sx={{
                  backgroundColor: theme?.secondaryColor,
                  border: "none",
                  color: theme?.textColor,
                  mt: "10px",
                  padding: "10px 0",
                  ":hover": {
                    backgroundColor: theme?.secondaryColor,
                    border: "none",
                    color: theme?.textColor,
                  },
                  width: "100%",
                }}
              >
                Update Profile
              </Button>
            )}
          </Box>
        </Container>
      </Box>
    </div>
  );
};

export default ProfileUpdate;
