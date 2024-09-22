import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useAuth } from "##/src/context/AuthContext.jsx";
function Logout() {
  const dispatchToRedux = useDispatch();
  const {logoutUser} = useAuth();
  useEffect(() => {
    async function logout() {
      try {
        await logoutUser();
      } catch (error) {
        console.error(error);
      }
    }
    logout();
  }, [dispatchToRedux]);
  return null;
}
export default Logout;