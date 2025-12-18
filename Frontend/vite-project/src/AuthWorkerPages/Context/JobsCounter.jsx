import { createContext, useContext, useEffect, useState } from "react";
import api from "../../AxiosApi/Api";
import toast from "react-hot-toast";
import { AuthContext } from "../../AxiosApi/AuthPages";


export const  JobsCounterContext = createContext()
export default function JobsCounterProvider({children}) {

    const {isAuthenticated, userRole} = useContext(AuthContext);


    const [countAppliedJobs, setCountAppliedJobs] = useState(() => {
    const saved = localStorage.getItem("countApplied"); 
    return saved !== null ? JSON.parse(saved) : 0;
    });


    const [countSavedJobs, setCountSavedJobs] = useState(() => {
    const saved = localStorage.getItem("countSaved"); 
    return saved !== null ? JSON.parse(saved) : 0;
    });

    const [loading, setLoading] = useState(false);



    const fetchCounts = async()=>{
        setLoading(true);

        try{
            const [appliedCount, savedCount] = await Promise.all([
                api.get("jobs/details/user/list-jobs/applications/"),
                api.get("jobs/details/user/list/jobs-saved/")
            ]);

      const appliedLen = appliedCount.data.length;
      const savedLen = savedCount.data.length;

      setCountAppliedJobs(appliedLen);
      setCountSavedJobs(savedLen);

      // Update LocalStorage
      localStorage.setItem("countApplied", JSON.stringify(appliedLen));
      localStorage.setItem("countSaved", JSON.stringify(savedLen));
    }catch(err){
        toast.error("Fetch counts failed")
    
    
    }
     finally{
        setLoading(false);
    }

 }

 useEffect(()=>{
    if (isAuthenticated === true && userRole === "WORKER"){
        fetchCounts();
    }
    
 }, []);

   

    return(
        <JobsCounterContext.Provider value={{countAppliedJobs, countSavedJobs, loading}} >
            {children}
        </JobsCounterContext.Provider>
    )
    
}