import React, { Route, Routes } from "react-router-dom";
import { useState } from "react";
import { PrivateRoute } from "##/src/components/route/ProtectedRoute.jsx";
import { AdminRoute } from "##/src/components/route/AdminRoute.jsx";
import LoadingBar from "react-top-loading-bar";
import loadWithLazyLoader from "##/src/pages/lazyLoader/loadWithLazyLoader.js";

// Pages
const DashBoard = loadWithLazyLoader(() =>
  import("##/src/pages/DashBoard.jsx"),
);
const Clients = loadWithLazyLoader(() => import("##/src/pages/Clients.jsx"));
const Projects = loadWithLazyLoader(() => import("##/src/pages/Projects.jsx"));
const Holidays = loadWithLazyLoader(() => import("##/src/pages/Holidays.jsx"));
const Reports = loadWithLazyLoader(() => import("##/src/pages/Reports.jsx"));
const Users = loadWithLazyLoader(() => import("##/src/pages/Users.jsx"));
const Profile = loadWithLazyLoader(() => import("##/src/pages/Profile.jsx"));
const Logout = loadWithLazyLoader(() => import("##/src/pages/Logout.jsx"));
const InviteNewUser = loadWithLazyLoader(() =>
  import("##/src/pages/InviteNewUser.jsx"),
);
const InviteExistingUser = loadWithLazyLoader(() =>
  import("##/src/pages/InviteExistingUser.jsx"),
);
const ForgotPassword = loadWithLazyLoader(() =>
  import("##/src/components/ForgotPassword/ForgotPassword"),
);
const CreateNewPassword = loadWithLazyLoader(() =>
  import("##/src/components/ForgotPassword/CreateNewPasssword"),
);
const SignIn = loadWithLazyLoader(() => import("##/src/pages/SignIn.jsx"));
const SignUp = loadWithLazyLoader(() => import("##/src/pages/SignUp.jsx"));

function AppRoutes() {
  const [progress, setProgress] = useState(0);
  return (
    <>
      <LoadingBar height="3px" color="#f11946" progress={progress} />
      <Routes>
        <Route
          path="/dashboard"
          element={
            <PrivateRoute
              path="/dashboard"
              element={<DashBoard setProgress={setProgress} />}
            />
          }
        />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/clients"
          element={
            <AdminRoute
              path="/clients"
              element={<Clients setProgress={setProgress} />}
            />
          }
        />
        <Route
          path="/projects"
          element={
            <PrivateRoute
              path="/projects"
              element={<Projects setProgress={setProgress} />}
            />
          }
        />
        <Route
          path="/"
          element={<PrivateRoute path="/" element={<DashBoard />} />}
        />
        <Route
          path="/reports"
          element={
            <PrivateRoute
              path="/reports"
              element={<Reports setProgress={setProgress} />}
            />
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute
              path="/profile"
              element={<Profile setProgress={setProgress} />}
            />
          }
        />
        <Route
          path="/holidays"
          element={
            <PrivateRoute
              path="/holidays"
              element={<Holidays setProgress={setProgress} />}
            />
          }
        />
        <Route
          path="/users"
          element={
            <AdminRoute
              path="/users"
              element={<Users setProgress={setProgress} />}
            />
          }
        />
        <Route
          path="/logout"
          element={<PrivateRoute path="/logout" element={<Logout />} />}
        />
        <Route path="/invite-new" element={<InviteNewUser />} />
        <Route path="/invite-existing" element={<InviteExistingUser />} />
        <Route path="/resetpassword" element={<ForgotPassword />} />
        <Route
          path="/profile/forgetpassword/:id/:token"
          element={<CreateNewPassword />}
        />
      </Routes>
    </>
  );
}

export default AppRoutes;
