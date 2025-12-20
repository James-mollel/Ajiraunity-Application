import { useState } from "react";
import PersonalInfoNormalWorker from "./WrkrsPersonalInfo";
import MainCareerDecide from "./NormalCareer/MainCareer";
// import CareerInfoNormalWorker from "./CareerInfo";


export default function NormalWorkerProfile() {
    const [activeTab, setActiveTab] = useState("basicInfo");

    const tabs = [
        {id: "basicInfo", label: "Personal Information"},
        {id: "careerInfo", label: "Career Information"},
    ];

    return(
        <div className="container mx-auto px-2">
            <div className="flex mt-9 md:mt-0 flex-row flex-nowrap shadow-lg rounded-md sticky top-0 bg-white/50 backdrop-blur-md overflow-x-auto py-4">
                {tabs.map((tab)=>(
                    <button key={tab.id} onClick={()=> setActiveTab(tab.id)}
                    className={`pb-3 px-2 text-sm font-extrabold relative flex-shrink-0 mx-1
                        ${activeTab === tab.id
                            ? "text-blue-700 font-semibold": "text-gray-600" }`}
                    >
                        {tab.label}
                        {activeTab === tab.id && (
                            <span className="absolute left-0 right-0 -bottom-[1px] h-[2px] bg-blue-600 rounded-full"></span>
                        )}
                    </button>
                ))}
              </div>
                <div className="mt-8" >
                    {activeTab === "basicInfo" &&  <PersonalInfoNormalWorker/>}
                    {activeTab === "careerInfo" && <MainCareerDecide/> }

                </div>
        </div>
    )
    
}
