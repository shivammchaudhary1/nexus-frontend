import React from "react";
import {Button} from "@mui/material";

export const DeleteButton = ({onDelete, theme}) => {
  return (
    <Button variant="contained"
      sx={{
        backgroundColor:theme?.secondaryColor,
        width:"96%",
        fontSize:"16px",
        ":hover":{
          backgroundColor: theme?.secondaryColor
        }
      }}
      onClick={onDelete}
    >
    Delete
    </Button> 
  );
};
