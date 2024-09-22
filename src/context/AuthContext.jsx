import React, { createContext, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAuthenticated } from "##/src/app/authSlice.js";
import { logout } from "##/src/app/authSlice.js";
import { useLocation, useNavigate } from "react-router-dom";
import { OPEN_PATHS, UNRESTRICTED_PATHS } from "##/src/utility/utility.js";
import Header from "##/src/components/header/Header.jsx";
import Footer from "##/src/components/footer/Footer.jsx";
import FetchApi from "##/src/client.js";
import { config } from "##/src/utility/config/config.js";
import { setMe } from "##/src/app/profileSlice.js";
import { setIsAuthenticated } from "##/src/app/authSlice.js";
import { setProjects } from "##/src/app/projectSlice.js";
import { setWorkspaces } from "##/src/app/workspaceSlice.js";
import { setEntries } from "##/src/app/timerSlice.js";
import { setClients } from "##/src/app/clientSlice.js";
import { setUsers } from "##/src/app/userDetailsSlice.js";

const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const navigate = useNavigate();
  const dispatchToRedux = useDispatch();
  const [redirectPath, setRedirectPath] = useState(null);
  const isAuthenticated = useSelector(selectAuthenticated);
  const location = useLocation();
  // console.log(OPEN_PATHS, location.pathname);
  function logoutUser() {
    // Clear local storage
    localStorage.clear();
    dispatchToRedux(logout());
    window.location.reload();
  }

  const redirectUser = (path) => {
    return navigate(path);
  };

  useEffect(() => {
    async function checkAuth() {
      try {
        const date = new Date();
        const {
          user,
          entries,
          isAuthenticated: isLoggedIn,
          projects,
          workspaces,
          clients,
          lastEntryDate,
          users,
        } = await FetchApi.fetch(`${config.api}/api/auth/isAuthenticated`, {
          credentials: "include",
          method: "POST",
          body: {
            loginDate: new Date(
              date.getUTCFullYear(),
              date.getUTCMonth(),
              date.getUTCDate(),
            ),
          },
        });

        dispatchToRedux(setMe({ user }));
        dispatchToRedux(setIsAuthenticated({ isAuthenticated: isLoggedIn }));
        dispatchToRedux(setProjects({ projects: projects }));
        dispatchToRedux(setWorkspaces({ workspaces: workspaces }));
        dispatchToRedux(
          setEntries({ entries, reFetchRequired: true, lastEntryDate }),
        );
        dispatchToRedux(setClients({ clients: clients }));
        dispatchToRedux(setUsers({ users: users }));
      } catch (error) {
        logoutUser();
      }
    }
    if (isAuthenticated) {
      checkAuth();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (location.pathname === "/") {
      return navigate("/dashboard");
    }
    if ((UNRESTRICTED_PATHS.includes(location.pathname) || OPEN_PATHS.includes(location.pathname.split("/")[2])) && isAuthenticated) {
      return navigate("/dashboard");
    }
  }, [location.pathname, isAuthenticated]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        logoutUser,
        setRedirectPath,
        redirectPath,
        redirectUser,
      }}
    >
      {isAuthenticated &&
        !OPEN_PATHS.includes(location.pathname.split("/")[2]) && <Header />}
      {children}
      {isAuthenticated &&
        !OPEN_PATHS.includes(location.pathname.split("/")[2]) && <Footer />}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};
