
import { Building2, MapPin, DollarSign ,Award, Heart, LoaderIcon, } from "lucide-react";
import api from "../AxiosApi/Api";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router";


export default function JobCard ({ job, isIndividual = false }) {
  const cardHover = "hover:scale-[1.02] hover:shadow-xl transition-all duration-300";
  const borderColor = isIndividual ? "border-pink-200" : "border-indigo-200";
  const badgeBg = isIndividual ? "bg-pink-100 text-pink-700" : "bg-indigo-100 text-indigo-700";

  const [saved, setSaved] = useState(job.is_job_saved || false); 
  const [saveLoading, setSaveLoading] = useState(false);
  

  const formatSalary = (min, max, currency, period) => {
    if (min || max) {
        const minStr = min ? Number(min).toLocaleString() : 'N/A';
        const maxStr = max ? Number(max).toLocaleString() : 'N/A';
        const periodStr = period ? `/${period.toLowerCase().replace('per ', '')}` : '';
        return `${currency} ${minStr} - ${maxStr} ${periodStr}`;
    }
    return "Negotiable";
  };

/// ---------------- SAVE A JOB --------------
const handleSaveJob = async(e)=>{
    e.stopPropagation(); 
    e.preventDefault();
    
    setSaveLoading(true);
    try{
      const resp = await api.post("jobs/details/user/save-unsave/job/", {job_slug : job.slug});
      toast.success(resp.data.message)
      setSaved(resp.data.saved)

    } catch(err){
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

    }finally{
      setSaveLoading(false);
    }

   }


  return (
    <Link to={`/jobs-details/${job.slug}`} 
      className={`group relative bg-white rounded-2xl border-2 ${borderColor} p-6 flex flex-col justify-between
                  shadow-md ${cardHover} overflow-hidden`}
    >
      {/* Subtle Gradient Accent */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity 
                      ${isIndividual ? "bg-gradient-to-br from-pink-400 to-pink-600" : "from-indigo-400 to-indigo-600"}`} />

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          
               <h3 className="text-xl font-bold hover:underline underline-offset-4 text-gray-900 group-hover:text-indigo-600 transition line-clamp-2">
                   {job.title}
               </h3>
         

           <span className={`px-3 py-1.5 text-xs text-center font-bold rounded-full ${isIndividual ? "bg-pink-100 text-pink-700" : "bg-indigo-100 text-indigo-700"}`}>
            {isIndividual ? "Casual job" : "Professional job"}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
          <MapPin className="w-4 h-4 text-indigo-500" />
          <span className="line-clamp-1">
            {job.region_name}
            {job.district_name && ` • ${job.district_name}`}
            {job.ward_name && ` • ${job.ward_name}`}
          </span>
        </div>

        {!isIndividual && job.company_name && (
          <div className="flex items-center gap-3 py-3 border-t border-gray-100">
            <div className="w-10 h-10 rounded-lg bg-gray-100 border flex items-center justify-center overflow-hidden">
              {job.company_logo ? (
                <img src={job.company_logo} alt={job.company_name} className="w-full h-full object-cover" />
              ) : (
                <Building2 className="w-5 h-5 text-gray-500" />
              )}
            </div>
            <div>
               <p className="text-sm font-medium text-gray-700 truncate">{job.company_name}</p>
               <p className="text-xs text-gray-500">Company</p>
            </div>
            
          </div>
        )}

        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-2 text-green-600 font-bold">
            <DollarSign className="w-5 h-5" />
            <span className="text-sm">{formatSalary(job.salary_min, job.salary_max, job.currency, job.payment_period_display)}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <Award className="w-4 h-4 text-indigo-500" />
            <span className="text-sm">{job.experience_level_display || "Any Level"}</span>
          </div>
        </div>

      </div>

      <div className="mt-5 pt-4 border-t border-dashed
       border-gray-200 text-xs text-gray-500 flex
       justify-between items-center relative z-10">
        <div>
        Posted {new Date(job.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        {job.deadline && (
          <>
            {" • "}Deadline: <span className="text-red-600 font-medium">
              {new Date(job.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </span>
          </>
        )}
     </div>
    <div className='flex-shrink-0'>
           {saveLoading ? (
                  <LoaderIcon size={25} className="animate-spin text-indigo-500" /> 
                    ) : (
                        <Heart 
                            // Pass the event object to handleSaveJob
                            onClick={(e) => handleSaveJob(e)} 
                            size={25} 
                            className={`cursor-pointer transition-colors ${saved ? "fill-red-600 text-red-600" : "text-gray-400 hover:text-red-600"}`}
                        />
                    )}
             </div>
      </div>
    </Link>
  );
};