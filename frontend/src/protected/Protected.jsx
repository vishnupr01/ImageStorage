import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export const ProtectedRoutes = ({ children }) => {
  const { isAuthenticated,loading} = useContext(AuthContext);
    console.log("isAuthenticated:",isAuthenticated);
    if(loading){
      return null
    }
  return isAuthenticated ? children : <Navigate to="/login" />;
};