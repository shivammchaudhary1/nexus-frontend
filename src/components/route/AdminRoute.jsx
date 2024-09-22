import React, { Navigate } from "react-router-dom";
import { useAuth } from "##/src/context/AuthContext.jsx";
import { useEffect } from "react";
import { selectUserRole } from "##/src/app/workspaceSlice.js";
import { useSelector } from "react-redux";
import { selectMe } from "##/src/app/profileSlice.js";

function AdminRoute({ path, element }) {
  const { isAuthenticated, setRedirectPath, redirectUser } = useAuth();
  const isAdmin = useSelector(selectUserRole);
  const user = useSelector(selectMe);

  useEffect(() => {
    if (!isAuthenticated) {
      setRedirectPath(path);
    }

    if (!isAdmin && user) {
      return redirectUser("/dashboard");
    }
  }, [isAuthenticated, isAdmin, user]);

  return isAuthenticated ? element : <Navigate to="/signin" replace />;
}

export { AdminRoute };
