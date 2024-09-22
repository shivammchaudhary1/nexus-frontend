import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectAlert } from "##/src/app/alertSlice.js";
import AppRoutes from "##/src/pages/AppRoutes.jsx";
import Notification from "##/src/components/alert/AlertMessage";
import { selectLoading } from "./app/loadingSlice";
import Loader from "##/src/components/loading/Loader";

function App() {
  const [open, setOpen] = useState(false);

  const alert = useSelector(selectAlert);
  useEffect(() => {
    if (alert.message) {
      setOpen(true);
    }
  }, [alert]);
  const loading = useSelector(selectLoading);
  return (
    <div>
      <Notification open={open} setOpen={setOpen} />
      {loading ? <Loader /> : <AppRoutes />}
    </div>
  );
}

export default App;
