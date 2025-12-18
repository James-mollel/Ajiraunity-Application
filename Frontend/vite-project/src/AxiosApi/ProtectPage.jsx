import { useContext } from "react";
import { AuthContext } from "./AuthPages";
import { useNavigate , Navigate, replace} from "react-router";
import FullScreenLoader from "../Components/Loader";

export default function ProtectPages({children, allowedRole}) {

    const navigate = useNavigate();
    const {isAuthenticated,userRole,loading} = useContext(AuthContext);

    if (loading === true){
        return <FullScreenLoader/>
    }

    if (isAuthenticated === false ){
        return <Navigate to="/user-login/" replace/>;
    }

    if(allowedRole && allowedRole !== userRole){
        return <Navigate to="/user-login/"replace/>;
        
    }

    return children;

    

    
}