import React, { Navigate, Route } from "react-router-dom";
import { useAuth } from "##/src/context/AuthContext.jsx";
import { useEffect } from "react";

function PrivateRoute({ path, element }) {
  const { isAuthenticated, setRedirectPath } = useAuth();

  useEffect(()=>{
    if(!isAuthenticated){
      setRedirectPath(path);
    }
  },[isAuthenticated]);

  return (isAuthenticated ? element : <Navigate to="/signin" replace />);
}

export { PrivateRoute };
