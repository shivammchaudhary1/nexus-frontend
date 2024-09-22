import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  CssBaseline,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { selectMe } from "##/src/app/profileSlice.js";
import {
  addClient,
  deleteClient,
  fetchClientsforSelectedWorkspace,
  selectClients,
  updateClient,
} from "##/src/app/clientSlice.js";
import { selectCurrentTheme } from "##/src/app/themeSlice.js";
import { FONTS } from "##/src/utility/utility.js";
import { notify } from "##/src/app/alertSlice.js";
import AddClient from "##/src/components/client/AddClient.jsx";
import ClientRow from "##/src/components/client/ClientRow.jsx";
import DeleteModal from "##/src/components/common/DeleteModal.jsx";
import { selectUserRole, selectWorkspace } from "##/src/app/workspaceSlice.js";

const Clients = ({ setProgress }) => {
  const [open, setOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [clientIdToDelete, setClientIdToDelete] = useState(null);
  const [updateModalOpen, setUpdateModalOpen] = useState({});
  const [buttonLoading, setButtonLoading] = useState(false);
  const dispatchToRedux = useDispatch();
  const clients = useSelector(selectClients);
  const user = useSelector(selectMe);
  const theme = useSelector(selectCurrentTheme);
  const isAdmin = useSelector(selectUserRole);
  const workspace = useSelector(selectWorkspace);

  const tableHeadStyle = {
    fontFamily: FONTS.subheading,
    fontSize: "16px",
    fontWeight: "bold",
    color: "#5a5a5a",
  };

  function handleClose() {
    setOpen(false);
  }

  const handleAddClient = async (clientName) => {
    try {
      setProgress(30);
      await dispatchToRedux(
        addClient({
          clientName,
          userId: user._id,
          workspaceId: user.currentWorkspace,
        }),
      );

      setProgress(100);
      dispatchToRedux(
        notify({ type: "success", message: "Client Added Successfully" }),
      );
      setOpen(false);
    } catch (error) {
      dispatchToRedux(
        notify({
          type: "error",
          message: "Error adding client. Please try again.",
        }),
      );
    }
  };

  const handleDeleteClient = async () => {
    try {
      if (clientIdToDelete) {
        setButtonLoading(true);
        setProgress(30);
        await dispatchToRedux(
          deleteClient({
            id: clientIdToDelete,
          }),
        );
        setClientIdToDelete(null);
      }
      setButtonLoading(false);
      setProgress(100);
      dispatchToRedux(
        notify({ type: "success", message: "Client Deleted Successfully" }),
      );
      setDeleteModalOpen(false);
    } catch (error) {
      setProgress(100);
      dispatchToRedux(
        notify({
          type: "error",
          message: "Error deleting client. Please try again.",
        }),
      );
    }
  };

  const handleUpdateClient = async (newClientName, clientId) => {
    try {
      if (!newClientName) {
        dispatchToRedux(
          notify({
            type: "warning",
            message: "Please enter a client name before updating a client.",
          }),
        );
      } else if (clientId && newClientName.trim() !== "") {
        setProgress(30);
        setButtonLoading(true);
        await dispatchToRedux(
          updateClient({
            id: clientId,
            clientName: newClientName,
          }),
        );
        setProgress(100);
        setButtonLoading(false);
        dispatchToRedux(
          notify({ type: "success", message: "Client Updated Successfully" }),
        );
        setUpdateModalOpen({ ...updateModalOpen, [clientId]: false });
      }
    } catch (error) {
      setButtonLoading(false);
      setProgress(100);
      dispatchToRedux(
        notify({
          type: "error",
          message: "Error updating client. Please try again.",
        }),
      );
    }
  };

  const openUpdateModal = (clientId) => {
    setUpdateModalOpen({ ...updateModalOpen, [clientId]: true });
  };

  const handleDelete = (id) => {
    setClientIdToDelete(id);
    setDeleteModalOpen(true);
  };

  useEffect(() => {
    async function handleFetchClients() {
      try {
        await dispatchToRedux(fetchClientsforSelectedWorkspace()).unwrap();
      } catch (error) {
        dispatchToRedux(
          notify({
            type: "error",
            message: `Failed to get the clients: ${error.message}`,
          }),
        );
      }
    }
    handleFetchClients();
  }, [workspace.selectedWorkspace]);

  return (
    <>
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
          Clients
        </Typography>
        <CssBaseline />
        <Container maxWidth="100%">
          <Box
            sx={{
              position: "absolute",
              top: "145px",
              right: "22px",
              cursor: "pointer",
              padding: "7px",
              zIndex: 1000, // To ensure it's above other elements
            }}
            onClick={() => setOpen(true)}
          >
            <Typography
              variant="h6"
              fontWeight="800"
              color={theme?.secondaryColor}
            >
              + Add Client
            </Typography>
          </Box>

          <TableContainer sx={{ mt: "20px", maxHeight: "70vh" }}>
            <Table
              sx={{
                boxShadow: "none",
                "& .MuiTableCell-root": {
                  padding: "10px 0px",
                },
              }}
              size="small"
              aria-label="a dense table"
              stickyHeader
            >
              <TableHead>
                <TableRow
                  sx={{
                    borderTop: "1px solid #ddd",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  <TableCell sx={tableHeadStyle}>Client Name</TableCell>
                  <TableCell sx={tableHeadStyle}>Created On</TableCell>
                  <TableCell sx={tableHeadStyle}>Action</TableCell>
                  <TableCell sx={tableHeadStyle}>Delete</TableCell>
                </TableRow>
              </TableHead>
              {isAdmin &&
                (clients.length ? (
                  <TableBody>
                    {clients.map((client) => (
                      <ClientRow
                        key={client._id}
                        client={client}
                        onEdit={openUpdateModal}
                        onDelete={handleDelete}
                        onUpdate={handleUpdateClient}
                        onClose={setUpdateModalOpen}
                        open={updateModalOpen}
                        theme={theme}
                        isAdmin={isAdmin}
                        buttonLoading={buttonLoading}
                      />
                    ))}
                  </TableBody>
                ) : (
                  <TableBody>
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        sx={{ textAlign: "center", backgroundColor: "#eee" }}
                      >
                        <Typography sx={{ py: "30px" }}>
                          No Data to show Clients
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                ))}
            </Table>
          </TableContainer>

          <DeleteModal
            open={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            onDelete={handleDeleteClient}
            title={"Delete Client"}
            text={
              "Client will be removed permanently, Are you sure you want to delete this client?"
            }
            theme={theme}
            buttonLoading={buttonLoading}
          />
          <AddClient
            open={open}
            onClose={handleClose}
            onSave={handleAddClient}
            theme={theme}
            title={"Add New Client"}
          />
        </Container>
      </Box>
    </>
  );
};

export default Clients;
