import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, CircularProgress, Typography } from "@mui/material";
import { Lock } from "@mui/icons-material";
import Logo from "../../assets/images/logo/logo.png";
import { Box } from "@mui/system";
import { createPass } from "##/src/app/userDetailsSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { notify } from "##/src/app/alertSlice.js";

function CreateNewPassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { id: userId, token } = useParams();

  const [userCred, setUserCred] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errorInfo, setErrorInfo] = useState({
    isError: false,
    errorMessage: "",
    type: "",
  });

  const dispatchToRedux = useDispatch();
  const { passChanged, passChangeMessage } = useSelector(
    (store) => store.userDetails,
  );

  const checkPass = () => {
    const hasUserInteracted = userCred.password || userCred.confirmPassword;

    // Only show error messages if the user has interacted
    if (!hasUserInteracted) {
      setErrorInfo({
        isError: false,
        errorMessage: "",
        type: "",
      });
      return;
    }

    let isPasswordLongEnough = userCred.password.length >= 6;

    let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).+$/;
    let isPasswordComplexEnough = passwordRegex.test(userCred.password);

    if (!userCred.password) {
      setErrorInfo({
        isError: true,
        errorMessage: "Please enter your new password and confirm password",
        type: "misMatch",
      });

      return;
    }

    if (!isPasswordLongEnough) {
      setErrorInfo({
        isError: true,
        errorMessage: "Password must be at least 6 characters long",
        type: "misMatch",
      });
      return;
    }

    if (!isPasswordComplexEnough) {
      setErrorInfo({
        isError: true,
        errorMessage:
          "Password must contain special characters, numbers, uppercase, and lowercase letters.",
        type: "misMatch",
      });
      return;
    }

    if (!userCred.confirmPassword) {
      setErrorInfo({
        isError: true,
        errorMessage: "Please enter confirm password",
        type: "misMatch",
      });
      return;
    }

    if (userCred.password !== userCred.confirmPassword) {
      setErrorInfo({
        isError: true,
        errorMessage: "Passwords and confirm password do not match",
        type: "misMatch",
      });
      return;
    }

    setErrorInfo({
      isError: false,
      errorMessage: "",
      type: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserCred((cred) => ({ ...cred, [name]: value }));
  };

  useEffect(() => {
    checkPass();
  }, [userCred.password, userCred.confirmPassword]);

  const handleSubmit = async () => {
    if (errorInfo.type === "misMatch") {
      return;
    }

    if (!userCred.password || !userCred.confirmPassword) {
      setErrorInfo({
        isError: true,
        errorMessage: "Please enter your new password and confirm password",
        type: "misMatch",
      });
      return;
    }

    setLoading(true);
    const bodyItem = {
      password: userCred.password,
      confirmPassword: userCred.confirmPassword,
      userId,
      token,
    };

    try {
      await dispatchToRedux(createPass(bodyItem)).unwrap();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setErrorInfo({
        isError: true,
        errorMessage: error.message,
        type: "wrongCred",
      });
    }
  };

  useEffect(() => {
    if (passChanged) {
      dispatchToRedux(
        notify({ type: "success", message: "Password changed successfully" }),
      );
      setErrorInfo({
        isError: false,
        errorMessage: "",
        type: "",
      });
      navigate("/signin");
    } else if (passChangeMessage) {
      setErrorInfo({
        isError: true,
        errorMessage: passChangeMessage,
        type: "passChangeError",
      });
    }
  }, [passChanged, passChangeMessage]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: ["column", "column", "row"],
          justifyContent: "center",
          alignItems: "center",
          margin: "-8px",
          padding: "0px",
        }}
      >
        <Box
          sx={{
            height: "100vh",
            width: ["100%", "100%", "65%"],
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: "30px",
              left: "30px",
            }}
          >
            <img src={Logo} style={{ width: "50px" }} alt="" />
          </Box>
          <Box
            sx={{
              fontSize: ["36px", "40px", "40px"],
              fontFamily: "Poppins,sans-serif",
              fontWeight: "bold",
              color: "#19acb4",
              mt: "150px",
              mb: "40px",
            }}
          >
            Create New Password
          </Box>

          {errorInfo.isError && (
            <Box
              sx={{
                color: "red",
                pt: "10px",
                width: ["80%", "60%", "40%"],
                textAlign: "justify",
              }}
            >
              <Typography variant="p">{errorInfo.errorMessage}</Typography>
            </Box>
          )}

          <Box sx={{ width: ["80%", "60%", "50%", "40%"] }}>
            <Box
              as="span"
              sx={{
                border: errorInfo.isError ? "1px solid red" : "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50px",
                backgroundColor: "#d9d9d9",
                mt: "20px",
                px: "18px",
                gap: "5px",
                "&:focus-within": {
                  boxShadow: "0 0 5px #19acb482",
                  transition: "box-shadow 0.5s ease-in-out",
                },
              }}
            >
              <Box
                sx={{
                  border: "1px solid black",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "30px",
                  width: "30px",
                  boxSizing: "border-box",
                }}
              >
                <Lock sx={{ p: "2px" }} />
              </Box>
              <Box
                as="input"
                name="password"
                onChange={handleChange}
                // onBlur={handleBlur}
                placeholder="New password"
                type="password"
                value={userCred.password}
                sx={{
                  border: "none",
                  borderRadius: "20px",
                  width: "100%",
                  height: "50px",
                  backgroundColor: "#d9d9d9",
                  px: "10px",
                  fontSize: "18px",
                  "&:focus": {
                    outline: "none",
                    backgroundColor: "#d9d9d9",
                  },
                  "&:-webkit-autofill": {
                    WebkitBoxShadow: "0 0 0 30px #d9d9d9 inset",
                  },
                }}
              />
            </Box>
            <Box
              as="span"
              sx={{
                border: errorInfo.isError ? "1px solid red" : "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50px",
                backgroundColor: "#d9d9d9",
                mt: "20px",
                px: "18px",
                gap: "5px",
                "&:focus-within": {
                  boxShadow: "0 0 5px #19acb482",
                  transition: "box-shadow 0.5s ease-in-out",
                },
              }}
            >
              <Box
                sx={{
                  border: "1px solid black",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "30px",
                  width: "30px",
                  boxSizing: "border-box",
                }}
              >
                <Lock sx={{ p: "2px" }} />
              </Box>
              <Box
                as="input"
                name="confirmPassword"
                onChange={handleChange}
                placeholder="Confirm password"
                type="password"
                value={userCred.confirmPassword}
                sx={{
                  border: "none",
                  borderRadius: "20px",
                  width: "100%",
                  height: "50px",
                  backgroundColor: "#d9d9d9",
                  px: "10px",
                  fontSize: "18px",
                  "&:focus": {
                    outline: "none",
                    backgroundColor: "#d9d9d9",
                  },
                  "&:-webkit-autofill": {
                    WebkitBoxShadow: "0 0 0 30px #d9d9d9 inset",
                  },
                }}
              />
            </Box>
          </Box>
          <Button
            onClick={handleSubmit}
            sx={{
              color: "white",
              borderRadius: "20px",
              backgroundColor: "#40c1c8",
              boxShadow: "0 2px #999",
              width: "200px",
              mt: "30px",
              "&:hover": {
                backgroundColor: "#33b0b8",
                boxShadow: "0 2px #666",
              },
              display: "flex",
              gap: "10px",
            }}
          >
            {loading && (
              <CircularProgress color="inherit" size={25} thickness={5} />
            )}
            <Typography
              sx={{
                fontFamily: "Poppins,sans-serif",
                fontSize: "23px",
                fontWeight: "300",
                textTransform: "capitalize",
              }}
            >
              {loading ? "Loading" : "Submit"}
            </Typography>
          </Button>
        </Box>
      </Box>
    </>
  );
}

export default CreateNewPassword;
