import React, { useEffect, useState } from "react";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";

const EditApplyLeaveModal = ({
  open,
  handleClose,
  initialData = {},
  onSubmit,
  theme,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    startDate: "",
    endDate: "",
    numberOfDays: "",
    description: "",
    type: "",
    dailyDetails: [],
    ...initialData,
  });

  useEffect(() => {
    if (initialData && initialData.startDate && initialData.endDate) {
      // Convert date strings to Date objects
      setFormData((prevData) => ({
        ...prevData,
        title: initialData.title,
        numberOfDays: initialData.numberOfDays,
        dailyDetails: initialData.dailyDetails,
        description: initialData.description,
        type: initialData.type,
        startDate: new Date(initialData.startDate).toISOString().split("T")[0],
        endDate: new Date(initialData.endDate).toISOString().split("T")[0],
      }));
    }
  }, [initialData]);

  // console.log("fromData", formData);

  const handleFieldChange = (field, value) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          alignItems: "center",
          backgroundColor: "#FFFFFF",
          padding: "10px",
          width: "80%",
          borderRadius: "5px",
          position: "relative",
          paddingBottom: "10px",
        }}
      >
        {" "}
        <Typography
          sx={{
            color: theme.secondaryColor,
            fontSize: "18px",
            padding: "10px",
            textAlign: "center",
          }}
        >
          Update Applied Leave
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            padding: "10px",
            borderRadius: "5px",
            gap: "12px",
            paddingBottom: "10px",
          }}
        >
          <Box>
            <TextField
              label="Title"
              value={formData?.title}
              onChange={(e) => handleFieldChange("title", e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Type"
              value={formData?.type}
              onChange={(e) => handleFieldChange("title", e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Start Date"
              type="date"
              value={formData?.startDate}
              onChange={(e) => handleFieldChange("startDate", e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="End Date"
              type="date"
              value={formData?.endDate}
              onChange={(e) => handleFieldChange("endDate", e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Number of Days"
              type="number"
              value={formData?.numberOfDays}
              onChange={(e) =>
                handleFieldChange("numberOfDays", e.target.value)
              }
              fullWidth
              margin="normal"
            />
            <TextField
              label="Description"
              multiline
              rows={4}
              value={formData?.description}
              onChange={(e) => handleFieldChange("description", e.target.value)}
              fullWidth
              margin="normal"
            />
            {/* Assuming dailyDetails is an array of objects with day and duration properties */}
          </Box>
          <Box
            sx={{
              maxHeight: "550px",
              overflow: "auto",
              width: "96%",
            }}
          >
            {formData?.dailyDetails &&
              formData.dailyDetails.map((detail, index) => (
                <Box key={index}>
                  <TextField
                    label={`Day ${index + 1}`}
                    type="date"
                    value={new Date(detail.day).toISOString().split("T")[0]}
                    onChange={(e) => {
                      const updatedDetails = [...formData.dailyDetails];
                      updatedDetails[index].day = new Date(
                        e.target.value,
                      ).toISOString();
                      handleFieldChange("dailyDetails", updatedDetails);
                    }}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label={`Duration ${index + 1}`}
                    value={detail.duration}
                    onChange={(e) => {
                      const updatedDetails = [...formData.dailyDetails];
                      updatedDetails[index].duration = e.target.value;
                      handleFieldChange("dailyDetails", updatedDetails);
                    }}
                    fullWidth
                    margin="normal"
                  />
                </Box>
              ))}
          </Box>
        </Box>
        <Box sx={{ textAlign: "right" }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: theme?.secondaryColor,
              paddingLeft: "2.5rem",
              paddingRight: "2.5rem",
              fontWeight: "bold",
              color: "white",
              ":hover": {
                backgroundColor: theme?.secondaryColor,
              },
              marginRight: "1rem",
            }}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditApplyLeaveModal;
