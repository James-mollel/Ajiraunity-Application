import api from "../AxiosApi/Api";
import { useParams } from "react-router";
import {toast} from "react-hot-toast";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";

export default function VerifyEmailPage(){
    const {uid, token} = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const verifyUser = async()=>{
        try{
            const resp = await api.get(`user-authentications/verify-email/${uid}/${token}/`);
            if (resp.status === 200){
                toast.success(resp.data.message);

                setTimeout(()=>{
                    navigate("/user-login");
                }, 1500);

            }
        }catch(err){
             if (err.response){
                    const data = err.response.data;
                    
                    if (data.detail){
                        toast.error(data.detail);

                    } else if(typeof data === 'object'){
                        Object.entries(data).forEach(([key, value])=>{
                            const message = Array.isArray(value)? value.join(", ") : value;
                            toast.error(message)
                        });
                    }else{
                        toast.error("Unexpected error occur, Please try again later");
                    }
                }else{
                    toast.error("Network Error!.")
                }

            setTimeout(()=>{
                navigate("/user-login");
            },2500);
            
        }finally{
            setLoading(false);
        }
    }

     useEffect(()=>{
            verifyUser();
        },[uid,token])
    return(
        <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-indigo-50 via-white to-indigo-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
        {loading ? (
          <p className="text-gray-600 font-medium animate-pulse">Verifying your email, please wait...</p>
        ) : (
          <p className="text-gray-700 font-medium">Redirecting to login...</p>
        )}
      </div>
    </div>
    )
}