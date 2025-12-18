import { createContext, useState , useContext, useEffect} from "react";
import api from "../../AxiosApi/Api";
import { AuthContext } from "../../AxiosApi/AuthPages";


export const EmployerCounterContex = createContext();

export default function EmployerCounterProvider({children}){
     const {isAuthenticated, userRole} = useContext(AuthContext);


         const [countJobs, setCountJobs] = useState(() => {
         const saved = localStorage.getItem("countJobs"); 
         return saved !== null ? JSON.parse(saved) : 0;
         });
     
     
         const [countApplicants, setCountApplicants] = useState(() => {
         const saved = localStorage.getItem("countApplicants"); 
         return saved !== null ? JSON.parse(saved) : 0;
         });

         const [countCompanies, setCountCompanies] = useState(() => {
         const saved = localStorage.getItem("countCompanies"); 
         return saved !== null ? JSON.parse(saved) : 0;
         });
     
         const [loading, setLoading] = useState(false);



    const fetchCountsEmployer = async()=>{
        setLoading(true);

        try{
            const [jobsResp, CompaniesResp, ApplicantsResp  ]= await Promise.all([
                 api.get("jobs/users/jobs/all-jobs-list/",{params: {page_size : 1}}),
                 api.get("jobs/users/company/user-list-creates/"),
                 api.get("jobs/details/employer/list/jobs-applicants/", {params : {page_size: 1}}),
            ]);

      const jobsTotal = jobsResp.data.count || 0;
      const companiesTotal = CompaniesResp.data.length || CompaniesResp.data.count || 0;
      const applicantTotal = ApplicantsResp.data.status_counts?.ALL || 0;

      setCountJobs(jobsTotal);
      setCountCompanies(companiesTotal);
      setCountApplicants(applicantTotal);

      // Update LocalStorage
      localStorage.setItem("countJobs", JSON.stringify(jobsTotal));
      localStorage.setItem("countCompanies", JSON.stringify(companiesTotal));
      localStorage.setItem("countApplicants", JSON.stringify(applicantTotal));

    }catch(err){
        toast.error("Fetch counts failed")
    
    
    }
     finally{
        setLoading(false);
    }

 }

 useEffect(()=>{
    if (isAuthenticated === true && userRole === "EMPLOYER"){
        fetchCountsEmployer();
    } else{
        return;
    }
    
 }, []);

   

    return(
        <EmployerCounterContex.Provider value={{countJobs, countCompanies, countApplicants, loading}} >
            {children}
        </EmployerCounterContex.Provider>
    )
    
}