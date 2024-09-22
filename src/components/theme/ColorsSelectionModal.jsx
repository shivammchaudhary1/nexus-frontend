import { Box, CircularProgress, Radio } from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { changeTheme } from "##/src/app/profileSlice.js";
import { setTheme } from "##/src/app/themeSlice.js";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { notify } from "##/src/app/alertSlice.js";

const ColorsSelectionModal = ({
  themes = [],
  currentThemeId,
  isThemeExpanded,
  onCollapse,
  setProgress,
}) => {
  const dispatchToRedux = useDispatch();
  const [themeChangingLoader, setThemeChangingLoader] = useState(false);
  
  const handleThemeChange = async (themeId) => {
    
    try {
      setThemeChangingLoader(true);
      setProgress(30);
      dispatchToRedux(changeTheme({ themeId }));
      dispatchToRedux(setTheme({ themeId }));
      setProgress(100);
      setThemeChangingLoader(false);

      dispatchToRedux(
        notify({
          type: "success",
          message: "Theme changed successfully",
        }),
      );
    } catch (error) {
      setThemeChangingLoader(false);
      setProgress(100);

      dispatchToRedux(
        notify({
          type: "error",
          message: "Failed to change theme please try again",
        }),
      );
    }
  };
  
  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
      <Box
        as="h4"
        onClick={onCollapse}
        sx={{
          paddingBottom: "10px",
          "&:hover": {
            cursor: "pointer",
          },
          display: "flex",
          alignItems: "center",
        }}
      >
        Themes{" "}
        {isThemeExpanded ? (
          <ArrowDropDownIcon
            sx={{
              fontSize: "32px",
              alignSelf: "center",
              marginLeft: "100px",
            }}
          />
        ) : (
          <ArrowDropUpIcon
            sx={{
              fontSize: "32px",
              alignSelf: "center",
              marginLeft: "100px",
            }}
          />
        )}
      </Box>
      {isThemeExpanded &&
        themes.map((theme) => {
          return (
            <Box
              value={theme.themeId}
              key={theme.themeId}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "2px",
                cursor: "pointer",
                hover: { backgroundColor: theme?.primaryColor },
              }}
              onClick={() => handleThemeChange(theme.themeId)}
            >
              {themeChangingLoader ? (
                <Box
                  sx={{
                    padding: "0.6rem",
                    marginRight: "5px",
                  }}
                >
                  <CircularProgress color="inherit" size="1rem" />
                </Box>
              ) : (
                <Box>
                  {" "}
                  <Radio
                    type="radio"
                    name="theme"
                    sx={{ borderColor: theme?.textColor }}
                    value={theme?.themeId}
                    checked={theme?.themeId === currentThemeId}
                    onChange={(e) => handleThemeChange(e.target.value)}
                  />
                </Box>
              )}
              <Box
                sx={{
                  backgroundColor: theme?.backgroundColor,
                  width: "100%",
                  height: "30px",
                  borderRadius: "5px",
                }}
              ></Box>
            </Box>
          );
        })}
    </Box>
  );
};

export default ColorsSelectionModal;
