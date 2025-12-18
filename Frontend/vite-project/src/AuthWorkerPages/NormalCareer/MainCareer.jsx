import UserEditCareer from "./CareerEdit";
import UserViewCareer from "./CareerView";
import api from "../../AxiosApi/Api";
import { useEffect, useState } from "react";
import FullScreenLoader from "../../Components/Loader";

export default function MainCareerDecide() {
    const [careerInfo, setCareerInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mode, setMode] = useState("view");

    const fetchNormalWorkerCareer = async()=>{
        try{
            const resp = await api.get("user-job-seekers/user/normal/worker/");
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
        fetchNormalWorkerCareer();
    }, []);


    if (loading){
       return <FullScreenLoader/>;
     }

    return(
        <div>
            {mode === "view" && <UserViewCareer data = {careerInfo} onEdit={()=> setMode("edit")} />}

            {mode === "edit" &&
             <UserEditCareer data={careerInfo} onSave = {fetchNormalWorkerCareer} onCancel={()=> setMode("view")} />}


        </div>
    )
}