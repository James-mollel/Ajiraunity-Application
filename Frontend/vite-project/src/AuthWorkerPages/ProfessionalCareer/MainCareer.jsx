import api from "../../AxiosApi/Api";
import { useEffect, useState } from "react";
import FullScreenLoader from "../../Components/Loader";
import EditProfessionalCareer from "./UpdateCareer";
import ViewProfessionalCarrer from "./ViewCareer";

export default function MainCareerDecideProfessional() {
    const [careerInfo, setCareerInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mode, setMode] = useState("view");

    const fetchProfessionalWorkerCareer = async()=>{
        try{
            const resp = await api.get("user-job-seekers/professional/worker/user/");
            setCareerInfo(resp.data);
            setMode("view");

        }catch(err){
            if (err.response?.status === 404){
                setCareerInfo(null);
                setMode("edit")
            }
        }
        finally{
            setLoading(false);
        }
    }

    useEffect(()=>{
        fetchProfessionalWorkerCareer();
    }, []);


    if (loading){
       return <FullScreenLoader/>;
     }

    return(
        <div>
            {mode === "view" && <ViewProfessionalCarrer data = {careerInfo} onEdit={()=> setMode("edit")} />}

            {mode === "edit" &&
             <EditProfessionalCareer data={careerInfo} onSave = {fetchProfessionalWorkerCareer} onCancel={()=> setMode("view")} />}


        </div>
    )
}