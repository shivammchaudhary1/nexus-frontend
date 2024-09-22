import React, { useEffect, useState } from "react";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { CloseRounded, MenuRounded } from "@mui/icons-material";
import { MENU_LABELS, MENU_PATH_ICONS, MENUS } from "##/src/utility/footer.js";
import { NavLink } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { useSelector } from "react-redux";
import { selectUserRole } from "##/src/app/workspaceSlice.js";
import { selectMe } from "##/src/app/profileSlice.js";
import {
  selectCurrentTheme,
} from "##/src/app/themeSlice.js";
import { capitalizeFirstWord } from "##/src/utility/miscellaneous/capitalize.js";

export default function Footer() {
  const [state, setState] = React.useState({
    bottom: false,
  });
  const [selectedMenu, setSelectedMenu] = useState("dashboard");

  const user = useSelector(selectMe);
  const isAdmin = useSelector(selectUserRole);
  const theme = useSelector(selectCurrentTheme);


  useEffect(() => {
    const pageTitle = MENU_LABELS[selectedMenu];
    document.title = pageTitle ? `${pageTitle}` : "Nexus";
  }, [selectedMenu]);

  const ThemedDrawer = styled(Drawer)({
    ".MuiDrawer-paperAnchorBottom": {
      width: "300px !important",
      borderTopLeftRadius: "12px !important",
      borderTopRightRadius: "12px !important",
      backgroundColor: `${theme?.secondaryColor} !important`,
      color: `${theme?.textColor} !important`,
      img: {
        width: "26px !important",
        filter: "brightness(0) invert(1) !important",
      },
      a: {
        color: `${theme?.textColor} !important`,
      },
    },
    ".MuiCollapse-wrapper": {
      background: `${theme?.primaryColor} !important`,
      ".MuiListItem-root:hover": {
        color: `${theme?.textHover} !important`,
      },
    },
    ".MuiListItem-button:hover": {
      color: `${theme?.textHover} !important`,
    },
  });

  const toggleDrawer = (anchor, open, menu) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
    setSelectedMenu(menu);
  };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
    >
      <List>
        <ListItem
          onClick={toggleDrawer(anchor, false)}
          onKeyDown={toggleDrawer(anchor, false)}
          sx={{
            cursor: "pointer",
            paddingTop: "8px",
            paddingBottom: "8px",
            paddingLeft: "16px",
            paddingRight: "16px",
          }}
        >
          <ListItemIcon>
            <Box
              sx={{
                border: "1px solid #fff",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "30px",
                width: "30px",
                boxSizing: "border-box",
              }}
            >
              <CloseRounded sx={{ color: theme?.textColor }} />
            </Box>
          </ListItemIcon>
          <ListItemText primary={capitalizeFirstWord(user?.name)} />
        </ListItem>

        <Divider
          style={{
            opacity: 1,
            margin: 0,
            border: 0,
            borderTop: "1px solid gold",
          }}
        />
        {MENUS.map((menu, index) => {
          const menuIcon = MENU_PATH_ICONS[menu].Icon;
          const link = MENU_PATH_ICONS[menu].link;
          const label = MENU_LABELS[menu];
          const isAdminOnly =
            (MENU_PATH_ICONS[menu].adminOnly && isAdmin) ||
            !MENU_PATH_ICONS[menu].adminOnly;
          return (
            isAdminOnly && (
              <ListItem
                key={`${menu.link}+${index}`}
                onClick={toggleDrawer(anchor, false, menu)}
                onKeyDown={toggleDrawer(anchor, false)}
                sx={{
                  cursor: "pointer",
                  paddingTop: "8px",
                  paddingBottom: "8px",
                  paddingLeft: "16px",
                  paddingRight: "16px",
                }}
                component={NavLink}
                to={link}
              >
                <ListItemIcon>
                  <img src={menuIcon} alt={label} />
                </ListItemIcon>
                <ListItemText primary={label} />
              </ListItem>
            )
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: "0px",
        display: "flex",
        alignItems: "center",
        height: "40px",
        ":hover": { cursor: "pointer" },
      }}
    >
      {["bottom"].map((anchor) => (
        <React.Fragment key={anchor}>
          <Box
            onClick={toggleDrawer(anchor, true)}
            className="ThemedButton"
            sx={{
              background: `${theme?.secondaryColor}`,
              width: 250,
              borderTopRightRadius: "10px",
            }}
          >
            <IconButton>
              <Box
                sx={{
                  border: "1px solid #fff",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "30px",
                  width: "30px",
                  boxSizing: "border-box",
                }}
              >
                <MenuRounded sx={{ color: theme?.textColor }} />
              </Box>
            </IconButton>
            <span style={{ color: `${theme?.textColor}`, marginLeft: "20px" }}>
              {capitalizeFirstWord(user?.name)}
            </span>
          </Box>

          <ThemedDrawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            {list(anchor)}
          </ThemedDrawer>
        </React.Fragment>
      ))}
    </Box>
  );
}
