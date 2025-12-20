import { useState } from "react";
import WorkersPersonalInformations from "./WrkrsPersonalInfo";
import MainCareerDecideProfessional from "./ProfessionalCareer/MainCareer";
import ListAllProfessionalSkill from "./SkillsProfssnl/AllSkills";
import ProfessionalLanguages from "./LanguagesProfssnl/AllLanguage";
import ProfessionalEducation from "./EducationProfssnl/AllEducation";
import ProfessionalExperience from "./ExperienceProfssnl/AllExperience";



export default function ProfessionalWorkerProfile() {
    const [activeTab, setActiveTab] = useState("basicInfoTab");

    const tabs = [
        {id: "basicInfoTab", label: "Personal Information"},
        {id: "careerInfoTab", label: "Career Profile"},
        {id: "SkillsTab", label: "Skills & Expertise"},
        {id: "LanguagesTab", label: "Languages"},
        {id: "EducationTab", label: "Education History"}, 
        {id: "ExperienceTab", label: "Work Experience"}, 
    ];

    return(
        <div className="container mx-auto px-2">
            <div className="flex mt-9 md:mt-0 flex-row flex-nowrap overflow-x-auto py-4 sticky top-0 shadow-lg bg-white/40 backdrop-blur-md rounded-md  ">
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
                    {activeTab === "basicInfoTab" &&  <WorkersPersonalInformations/>}
                    {activeTab === "careerInfoTab" && <MainCareerDecideProfessional/> }
                    {activeTab === "SkillsTab" && <ListAllProfessionalSkill/> }
                    {activeTab === "LanguagesTab" && <ProfessionalLanguages/> }
                    {activeTab === "EducationTab" && <ProfessionalEducation/> }
                    {activeTab === "ExperienceTab" && <ProfessionalExperience/> }

                </div>
        </div>
    )
    
}
