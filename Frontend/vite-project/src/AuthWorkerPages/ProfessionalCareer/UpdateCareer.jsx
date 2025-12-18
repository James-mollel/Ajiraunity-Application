import { useState, useEffect } from "react";
import api from "../../AxiosApi/Api";
import {toast} from "react-hot-toast";

export default function EditProfessionalCareer({data,onSave,onCancel}) {
   
    const [job_title, setJobTitle] = useState(data.job_title || "");
    const [category, setCategory] = useState(data.category?.id || "");
    const [salary, setSalary] = useState(data.salary || "");
    const [currency, setCurrency] = useState(data.currency || "");
    const [payment_period, setPaymentPeriod] = useState(data.payment_period || "");
    const [linkedIn, setLinkedInUrl] = useState(data.linkedIn || "");
    const [portfolio, setPortfolioUrl] = useState(data.portfolio || "");
    const [gitHub, setGitHubUrl] = useState(data.gitHub || "");
    const [cv, setCvFile] = useState(null);
    const [employment_status, setEmploymentStatus] = useState(data.employment_status || "");
    const [experience_yrs, setExperienceYrs] = useState(data.experience_yrs || "");
    const [education_level, setEducationLevel] = useState(data.education_level || "");
    const [description, setDescription] = useState(data.description || "");
    
  
    const [categories,setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showDialog, setShowDialog] = useState(false);

    const backendURL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000"; 

    const fetchCategories = async()=>{
                try{
                  const resp = await api.get("jobs/users/category/category-professional/");
                  setCategories(resp.data);
                  console.log(resp.data);
            
                }catch(err){ 
                  console.log(err)
                }
              }


    useEffect(()=>{
      const fetch = async()=>{
         await fetchCategories();
      }
      fetch();
    },[]); 


    const handleSubmit= async(e)=>{
        e.preventDefault();
        setShowDialog(true);
    };

    const handleMakePublic = ()=>{
        finalSubmitToBackend(true);
    }

    const handleNotNow=()=>{
        finalSubmitToBackend(false);
    }
        
    
        const finalSubmitToBackend = async (isPublic) => {
            setLoading(true);
        
            try {
                const formData = new FormData();
                 formData.append("job_title",job_title)
                 formData.append("prof_salary",salary)
                 formData.append("prof_currency", currency)
                 formData.append("prof_payment_period",payment_period)
                 formData.append("linkedIn",linkedIn)
                 formData.append("portfolio",portfolio)
                 formData.append("gitHub",gitHub)
                 formData.append("employment_status",employment_status)
                 formData.append("experience_yrs",experience_yrs)
                 formData.append("education_level",education_level)
                 
                 formData.append("prof_description",description)
                 formData.append("public_visible",isPublic)

                if (category){
                    formData.append("category_id", parseInt(category));
                }
                if (cv instanceof File){
                  formData.append("cv",cv)
                }
                const resp  = await api.patch("user-job-seekers/professional/worker/user/", formData);
                toast.success("Profile updated successfully?.")
                 await onSave();
                 
            }catch(err){
                 if (err.response){
                    const data = err.response.data;

                    if (data.detail){
                       toast.error(data.detail)
                    }
                    
                    else if (typeof data === 'object'){
                      Object.entries(data).forEach(([key, value])=>{
                        const message = Array.isArray(value) ? value.join(", ") : value;
                        toast.error(message);
                      });
                    }else{
                      toast.error("Unexpected error occur, Please try again later!.")
                    }

                  }else{
                    toast.error("Network error, Please try again later!.")
                  }
            console.log("Error saving a profile ", err);
            }finally{
                setLoading(false);
                setShowDialog(false);
            }

            
        };
        
            
              return (
                <div className="w-full flex justify-center py-4 relative">
                  <div className="w-full max-w-xl bg-white/70 shadow-lg rounded-lg p-6">
                   <div>

                   </div>
                    
            
                    <form className="space-y-4" onSubmit={handleSubmit}>
                      {/* Title */}
                      <div className="flex flex-col space-y-1">
                        <label className="text-base text-neutral-900">Job title</label>
                        <input
                          name="title"
                          onChange={(e)=> setJobTitle(e.target.value)}
                          value={job_title}
                          type="text"
                          required
                          className="w-full bg-white outline-none focus:ring-2 focus:ring-gray-800 rounded-lg py-2 px-4 text-lg border border-gray-300"
                          placeholder="e.g. Software developer, Teacher, Accountant"
                        />
                      </div>
            
                      {/* Category */}
                      <div className="flex flex-col space-y-1">
                        <label className="text-base text-neutral-900">Job category</label>
                        <select
                          name="category"
                          value={category}
                          onChange={(e)=>setCategory(e.target.value)}
                           required
                          className="w-full bg-white focus:ring-2 focus:ring-gray-800 outline-none rounded-lg py-2 px-4 text-lg text-gray-600 border border-gray-300"
                        >
                          <option value="">- Select category -</option>
                            {categories.map((c)=>(
                              <option key={c.id} value={c.id}>{c.display_name}</option>
                            ))}
                        </select>
                      </div>
            
                      {/* Salary */}
                      <div className="flex flex-row space-x-4 items-center">
                          <div className="flex flex-col space-y-1">
                              <label className="text-base text-neutral-900">
                                Expected salary
                              </label>
                              <input
                                name="salary"
                                onChange={(e)=>setSalary(e.target.value)}
                                value={salary}
                                type="number"
                                required
                                placeholder="10000"
                                className="w-full bg-white outline-none focus:ring-2 focus:ring-gray-800 rounded-lg py-2 px-4 text-lg border border-gray-300"
                              />
                          </div>

                       <div className="flex flex-col space-y-1">
                          <label className="text-base text-neutral-900">Currency</label>
                            <select
                              onChange={(e)=>setCurrency(e.target.value)}
                              value={currency}
                              name="currency" 
                              required 
                              className="w-full bg-white outline-none focus:ring-2 focus:ring-gray-800 rounded-lg py-2 px-4 text-lg text-gray-600 border border-gray-300"
                              >
                              <option value="">- Select -</option>
                              <option value="TZS">TZS</option>
                              <option value="USD">USD</option>
                            </select>
                      </div>
                    </div>
            
                      {/* Salary per */}
                      <div className="flex flex-col space-y-1">
                        <label className="text-base text-neutral-900">Payment period</label>
                        <select
                          onChange={(e)=>setPaymentPeriod(e.target.value)}
                          value={payment_period}
                          name="payment_period"
                          required
                          className="w-full bg-white outline-none focus:ring-2 focus:ring-gray-800 rounded-lg py-2 px-4 text-lg text-gray-600 border border-gray-300"
                        >
                          <option value="">- Select -</option>
                          <option value="hour">Per Hour</option>
                          <option value="day">Per Day</option>
                          <option value="week">Per Week</option>
                          <option value="month">Per Month</option>
                          <option value="project">Per Project</option> 
                        </select>
                      </div>
            
                     <div className="flex flex-col space-y-1">
                        <label className="text-base text-neutral-900">linkedIn url</label>
                        <input
                          name="linkedIn"
                          onChange={(e)=> setLinkedInUrl(e.target.value)}
                          value={linkedIn}
                          type='url'
                          
                          className="w-full bg-white outline-none focus:ring-2 focus:ring-gray-800 rounded-lg py-2 px-4 text-lg border border-gray-300"
                          placeholder="https://linkedin.xyz"
                        />
                      </div>

                      <div className="flex flex-col space-y-1">
                        <label className="text-base text-neutral-900">Portfolio url</label>
                        <input
                          name="portfolio"
                          onChange={(e)=> setPortfolioUrl(e.target.value)}
                          value={portfolio}
                          type='url'
                          
                          className="w-full bg-white outline-none focus:ring-2 focus:ring-gray-800 rounded-lg py-2 px-4 text-lg border border-gray-300"
                          placeholder="https://xyz"
                        />
                      </div>

                      <div className="flex flex-col space-y-1">
                        <label className="text-base text-neutral-900">gitHub url</label>
                        <input
                          name="gitHub"
                          onChange={(e)=> setGitHubUrl(e.target.value)}
                          value={gitHub}
                          type='url'
                          
                          className="w-full bg-white outline-none focus:ring-2 focus:ring-gray-800 rounded-lg py-2 px-4 text-lg border border-gray-300"
                          placeholder="https://github.xyz"
                        />
                      </div>


            
                      <div className="flex flex-col space-y-1">
                        <label className="text-base text-neutral-900">Employment status</label>
                        <select
                          onChange={(e)=>setEmploymentStatus(e.target.value)}
                          value={employment_status}
                          name="employment_status"
                          required
                          className="w-full bg-white outline-none focus:ring-2 focus:ring-gray-800 rounded-lg py-2 px-4 text-lg text-gray-600 border border-gray-300"
                        >
                          <option value="">- Select -</option>
                          <option value="employed">Employed</option>
                          <option value="unemployed">Unemployed</option>
                          <option value="freelancer">Freelancer</option>
                          <option value="self_employed">Self-employed</option>
                          <option value="student">Student</option>
                          <option value="intern">Intern</option>
                          <option value="contract">Contract</option>
                          <option value="looking">Open to opportunities</option>
                        </select>
                      </div>


                      <div className="flex flex-col space-y-1">
                        <label className="text-base text-neutral-900">Years of Experience</label>
                        <select
                          onChange={(e)=>setExperienceYrs(e.target.value)}
                          value={experience_yrs}
                          name="experience_yrs"
                          required
                          className="w-full bg-white outline-none focus:ring-2 focus:ring-gray-800 rounded-lg py-2 px-4 text-lg text-gray-600 border border-gray-300"
                        >
                          <option value="">- Select -</option>
                          <option value="0_1">0–1 years</option>
                          <option value="1_2">1–2 years</option>
                          <option value="2_3">2–3 years</option>
                          <option value="3_5">3–5 years</option>
                          <option value="5_7">5–7 years</option>
                          <option value="7_10">7–10 years</option>
                          <option value="10_plus">10+ years</option>
                        </select>
                      </div>




                      <div className="flex flex-col space-y-1">
                        <label className="text-base text-neutral-900">Education level</label>
                        <select
                          onChange={(e)=>setEducationLevel(e.target.value)}
                          value={education_level}
                          name="education_level"
                          required
                          className="w-full bg-white outline-none focus:ring-2 focus:ring-gray-800 rounded-lg py-2 px-4 text-lg text-gray-600 border border-gray-300"
                        >
                          <option value="">- Select -</option>
                          <option value="none">No formal education</option>
                          <option value="primary">Primary School</option>
                          <option value="secondary">Secondary School / High School</option>
                          <option value="certificate">Certificate</option>
                          <option value="diploma">Diploma</option>
                          <option value="bachelor">Bachelor's Degree</option>
                          <option value="master">Master's Degree</option>
                          <option value="phd">PhD / Doctorate</option>
                        </select>
                      </div>


                      <div className="flex flex-col space-y-1">
                        <label className="text-base text-neutral-900">CV Upload (PDF/DOC/DOCX)</label>
                        <input
                          type="file"
                          accept=".pdf, .doc, .docx"
                          className="w-full bg-white outline-none focus:ring-2 focus:ring-gray-800 rounded-lg py-2 px-4 text-lg border border-gray-300"
                          onChange={(e)=> setCvFile(e.target.files[0])}
                        />
                        {data?.current_cv && (
                            <p className="text-sm text-red-700 font-semibold mt-1">
                              Current CV: <a href={ backendURL + data.current_cv} rel="noopener noreferrer" target="_blank" className=" underline" >{data.current_cv.split("/").pop()}</a>
                            </p>
                        )}
                      </div>


            
                      {/* Description */}
                      <div className="flex flex-col space-y-1">
                        <label className="text-base text-neutral-900">Profile Summary</label>
                        <textarea
                          onChange={(e)=>setDescription(e.target.value)}
                          value={description}
                          name="description"
                          rows="5"
                          required
                          placeholder="Describe yourself and your experience..."
                          className="w-full bg-white outline-none focus:ring-2 focus:ring-gray-800 rounded-lg p-4 text-lg border border-gray-300"
                        ></textarea>
                      </div>
            
                      {/* Submit button */}
                <div className="flex items-center justify-between" >
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-gray-900 hover:bg-gray-700 text-white py-2 px-4 rounded-md text-lg transition shadow-md"
                             >
                            {loading ? "Saving..." : "Save"}
                        </button>

                    <button 
                           type="button"
                           onClick={onCancel}
                           className="py-2 px-4 bg-red-700 rounded-md text-gray-300 hover:bg-red-400 text-lg shadow-md"
                         >
                        Cancel
                    </button>
                      </div>
                     
                    </form>
                  </div>
            
                  {/* ===== DIALOG OVERLAY ===== */}
                  {showDialog && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4">
                      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-3">
                          Make Your Profile Public?
                        </h3>
                        <p className="text-gray-600 mb-6">
                          Your profile is ready. Would you like employers to see it
                          immediately?
                        </p>
            
                        <div className="flex justify-end space-x-3">
                          <button
                            onClick={handleNotNow} disabled={loading}
                            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-800 hover:bg-gray-100"
                          >
                           {loading ? "wait..": "Not now"} 
                          </button>
                          <button
                            onClick={handleMakePublic} disabled={loading}
                            className="px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-700"
                          >
                           {loading? "wait...": "Make Public"} 
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
        </div>
            
 )
             
    
}