import { Navigate } from "react-router";
import { AuthContext } from "./AuthPages";
import { useContext } from "react";
import FullScreenLoader from "../Components/Loader";

export default function UserIsAuthenticated({children}) {
    const {isAuthenticated,userRole,loading} = useContext(AuthContext);

    if (loading){
        return <FullScreenLoader/>;
    }

    if (isAuthenticated){
        if (userRole === "WORKER"){
            return <Navigate to="/dashboard-user-job-seeker/" replace />;
        }

        if (userRole === "EMPLOYER"){
            return <Navigate to="/dashboard-user-employer/" replace />;
        }
    }
  return children;  
}