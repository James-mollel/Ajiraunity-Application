import api from "./Api";
import { replace, useNavigate } from "react-router";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext()

export default function AuthProvider({children}) {

    const [userRole, setUserRole] = useState(null);
    const [Email, setEmail] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const authenticate = async()=>{
        try{
        const resp = await api.get("user-authentications/auth/user/user-current/");
        if (resp.status === 200){
            setIsAuthenticated(true);
            setUserRole(resp.data.user.role)
            setEmail(resp.data.user.email)
            return resp.data.user;
        }
    }catch(err){
        console.log(err);
        setIsAuthenticated(false);
        setUserRole(null);
        setEmail(null);
        // navigate("/user-login/", {replace: true})
        
    }finally{
        setLoading(false);
    }

    }

    useEffect(()=>{
        authenticate();
    },[]);
    

    const Logout = async()=>{
        try{
            const resp = await api.post("user-authentications/user/loggout/auth/",{});
        }catch(err){
            navigate("/user-login/", {replace: true})
        }
        setUserRole(null);
        setEmail(null);
        setIsAuthenticated(false);
        navigate("/user-login/", {replace: true})
    }

    return(
        <AuthContext.Provider value={{isAuthenticated, userRole,Email, loading, Logout, refreshAuth: authenticate}}>
            {children}
        </AuthContext.Provider>
    )
    
    
}