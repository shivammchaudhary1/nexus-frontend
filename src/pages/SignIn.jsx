import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, CircularProgress, Typography } from "@mui/material";
import { Email, Lock } from "@mui/icons-material";
import Logo from "##/src/assets/images/logo/logo.png";
import { config } from "##/src/utility/config/config.js";
import { Box } from "@mui/system";
import bgImage from "##/src/assets/images/background-images/bg.svg";
import { useDispatch } from "react-redux";
import { validateEmailAndPassword } from "##/src/utility/validation/validations.js";
import { setIsAuthenticated } from "##/src/app/authSlice.js";
import FetchApi from "##/src/client.js";

function SignIn() {
  
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userCred, setUserCred] = useState({ email: "", password: "" });
  
  const [errorInfo, setErrorInfo] = useState({
    isError: false,
    errorMessage: "",
  });

  const dispatchToRedux = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserCred((cred) => ({ ...cred, [name]: value }));
  };

  async function handleLogin() {
    const checkResult = validateEmailAndPassword(
      userCred.email,
      userCred.password,
    );

    if (checkResult.isError) {
      setErrorInfo({
        isError: true,
        errorMessage: "Invalid Credentials",
      });
      return;
    }
    
    setLoading(true);

    try {
      const response = await FetchApi.fetch(`${config.api}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({credentials:btoa(`${userCred.email}:${userCred.password}`)}),
        credentials: "include",
      });
      if (response.isAuthenticated) {
        dispatchToRedux(setIsAuthenticated({ isAuthenticated: true }));
        return navigate("/");
      }
    } catch (error) {
      // Return a rejected value with the error message
      setErrorInfo({ isError: true, errorMessage: error.message });
    }
    setLoading(false);
  }

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
            <img
              src={Logo}
              style={{ width: "50px", marginLeft: "1rem" }}
              alt="Nexus"
            />
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
            Log in
          </Box>

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
                <Email sx={{ p: "2px" }} />
              </Box>
              <Box
                as="input"
                name="email"
                onChange={handleChange}
                placeholder="Enter your e-mail address"
                type="email"
                value={userCred.email}
                sx={{
                  border: "none",
                  borderRadius: "15px",
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
                name="password"
                onChange={handleChange}
                placeholder="Enter password"
                type="password"
                value={userCred.password}
                sx={{
                  border: "none",
                  borderRadius: "20px",
                  width: "100%",
                  height: "50px",
                  fontSize: "18px",
                  backgroundColor: "#d9d9d9",
                  px: "10px",
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

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              width: ["80%", "60%", "40%"],
              color: "#004AAD",
              pt: "20px",
            }}
          >
            <Link to="/resetpassword" style={{ textDecoration: "none" }}>
              <Typography
                variant="p"
                fontFamily={"sans-serif"}
                fontSize={18}
                // sx={{ color: "#004AAD" }}
                sx={{ color: "#024195" }}
              >
                Forgot Password
              </Typography>
            </Link>
          </Box>
          {errorInfo.isError && (
            <Typography
              variant="p"
              sx={{
                fontFamily: "Poppins, sans-serif",
                color: "red",
                marginTop: "8px",
              }}
            >
              {errorInfo.errorMessage}
            </Typography>
          )}
          <Button
            onClick={() => handleLogin(userCred)}
            disabled={loading}
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
              {loading ? "Logging in" : "Log in"}
            </Typography>
          </Button>
          <Box
            sx={{
              mt: "50px",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <Typography
              variant="p"
              sx={{ fontSize: "20px", fontFamily: "Poppins, sans-serif" }}
            >
              Not on Nexus?
            </Typography>
            <Link to="/signup" style={{ textDecoration: "none" }}>
              <Typography
                variant="p"
                sx={{
                  fontSize: "20px",
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: "600",
                  color: "#19acb4",
                }}
              >
                Sign Up
              </Typography>
            </Link>
          </Box>
        </Box>
        <Box
          sx={{
            backgroundImage: `url(${bgImage})`,
            width: "35%",
            display: ["none", "none", "flex"],
            height: "101vh",
            backgroundSize: "100%",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: "30px",
          }}
        >
          <Box
            sx={{
              color: "#fff",
              fontWeight: "600",
              fontSize: ["32px", "32px", "42px"],
              fontFamily: "Poppins,sans-serif",
              textAlign: "center",
              px: "2px",
            }}
          >
            Create Account
          </Box>
          <Typography
            variant="p"
            sx={{
              my: "15px",
              fontSize: "26px",
              fontWeight: "350",
              color: "#fff",
              maxWidth: "50%",
              textAlign: "center",
              marginTop: "45px",
            }}
          >
            Track and Manage your time on one platform
          </Typography>
          <Box
            sx={{
              color: "#fff",
              fontSize: "23px",
              fontWeight: "300",
              textAlign: "center",
              padding: "7px 5px",
              border: "3px solid white",
              borderRadius: "35px",
              width: "180px",
              mt: "10px",
              "&:active": {
                backgroundColor: "#19acb4",
                boxShadow: "0 5px #40c1c8",
                transform: "translateY(4px)",
              },
              "&:hover": {
                animation: "ease-in",
                backgroundColor: "#1d777cb6",
                cursor: "pointer",
              },
            }}
            onClick={() => {
              navigate("/signup");
            }}
          >
            <Typography variant="p" sx={{ color: "#fff" }}>
              Sign Up
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default SignIn;
