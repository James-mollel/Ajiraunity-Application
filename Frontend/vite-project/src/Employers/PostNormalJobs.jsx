import { useState, useEffect } from "react";
import api from "../AxiosApi/Api"
import {toast} from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";


export default function PostNormalIndividualJobs() {

    const navigate = useNavigate();

    const [categories, setCategories] = useState([])
    const [regions, setRegions] = useState([])
    const [districts, setDistricts] = useState([])
    const [wards, setWards] = useState([])

    const [region, setRegion] = useState("")
    const [district, setDistrict] = useState("")
    const [ward, setWard] = useState("")

    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [gender, setGender] = useState("");
    const [education_level, setEducationLevel] = useState("");
    const [max_salary, setMaxSalary] = useState("");
    const [min_salary, setMinSalary] = useState("");
    const [currency, setCurrency] = useState("");
    const [payment_period, setPaymentPeriod] = useState("");
    const [positionNeeded, setPositionNeeded] = useState("");
    const [deadlineDate, setDeadlineDate] = useState("");
    const [jobSummary, setJobSummary] = useState("");

    const [throughEmail, setThroughtEmail] = useState("")
    const [throughWhatsupp, setThroughtWhatsupp] = useState("")
    const [throughInapp, setThroughtInapp] = useState(true);

    const [submit, setIsSubmit] = useState(false);






     const fetchNormalCategories = async()=>{
                try{
                  const resp = await api.get("jobs/users/category/categories-informal/");
                  setCategories(resp.data);
                  
                }catch(err){ 
                  toast.error("failed to fetch jobs category. Please try again later")
                }
              }


     const fetchRegions = async()=>{
          try{
            const resp = await api.get("locations/users/all/regions/");
            setRegions(resp.data);
          }catch(err){
            if (err.response){
              toast.error("Failed to fetch regions!. Please try again later.")
            }
            toast.error("Network Error. Please try again later!")
          }
        };

        const fetchDistricts = async(regionId)=>{
          if (!regionId){
            setDistricts([]);
            return;
          }
          try{
            const resp = await api.get("locations/users/all/districts/",{params: {region_id: regionId}});
            setDistricts(resp.data);
          }catch(err){
             if (err.response){
              toast.error("failed to fetch districts!. Please try again later.")
            }
            toast.error("Network error. Please try again later!")
          }
          
        };

        const fetchWards = async(districtId)=>{
          if (!districtId){
            setWards([]);
            return;
          }
          try{
            const resp = await api.get("locations/users/all/wards/list/", {params:{district_id: districtId}});
            setWards(resp.data);
          }catch(err){
            if (err.response){
              toast.error("failed to fetch wards!. Please try again later.")
            }
            toast.error("Network error. Please try again later!")
          }
        }




    useEffect(()=>{
      const fetchInitData = async()=>{
         await   fetchNormalCategories();
         await fetchRegions();
      }
      fetchInitData();
    },[]); 

    const onRegionChange = async(value)=>{
        setRegion(value);
        setDistrict("")
        setWard("")

        setDistricts([]);
        setWards([]);

        await fetchDistricts(value);
    }


    const onDistrictsChange= async(value)=>{
        setDistrict(value);
        setWard("")
        setWards([])

        await fetchWards(value);
    }

    const phoneRegex = /^\+255[0-9]{9}$/;

    const handleSubmitJob = async (e)=>{
        e.preventDefault();
        
        if (throughWhatsupp && !phoneRegex.test(throughWhatsupp)){
            toast.error("WhatsApp number must start with +255 and contain 9 digits. Example: +255712345678");
            return;
        }

        if (!throughEmail && !throughInapp && !throughWhatsupp){
            toast.error("Atleast one application method is required!")
            return;
        }

        if (jobSummary.trim().length < 20){
            toast.error("Job summary is too small atleast 20 characters")
            return;
        }
        if (new Date(deadlineDate) < Date.now()){
            toast.error("Deadline date must not be in the past");
            return;
        }

        setIsSubmit(true);


        try{
            const formData = new FormData();
            formData.append("title", title);
            formData.append("education_level", education_level);
            formData.append("gender", gender);
            formData.append("salary_max", max_salary);
            formData.append("salary_min", min_salary);
            formData.append("currency", currency);
            formData.append("payment_period", payment_period);
            formData.append("positions_needed", positionNeeded);
            formData.append("deadline", deadlineDate);
            formData.append("job_summary", jobSummary);
            formData.append("apply_in_app", throughInapp);
            formData.append("apply_email", throughEmail);
            formData.append("apply_whatsapp", throughWhatsupp);

            if (region){
                formData.append("region_id", region)
            }
            if (district){
                formData.append("district_id", district)
            }
            if (ward){
                formData.append("ward_id", ward)
            }
            if (category){
                formData.append("category_id", category)
            }

            const resp = await api.post("jobs/users/jobs/individual/create/", formData);
            if (resp.status === 201){
                toast.success(resp.data.message)
                setTimeout(() => {
                    navigate("/dashboard-user-employer/success-job-post-message/")
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
                        toast.error("Failed to create a job, Please try again later");
                    }
                }else{
                    toast.error("Network error!.")
                }
        }finally{
            setIsSubmit(false);
        }
    }






    return(

<div className="p-4 sm:p-6 md:p-8 min-h-screen">
    <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl p-6 sm:p-8">

        <div className="flex justify-between items-center mb-8 mt-4">
                <ArrowLeft size={30} className="cursor-pointer" onClick={()=> navigate(-1)}/>
                <h2 className="text-2xl font-bold text-gray-900 border-b-2 pb-2">
                    Post Casual / Daily Job
                </h2>
          </div>

        <form onSubmit={handleSubmitJob} className="space-y-8">
            {/* Job Details Section */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
                
                      <h3 className="text-xl font-semibold text-indigo-700 mb-4">Job Details</h3>
              
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Title */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                           Job Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title} required
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="eg. fundi ujenzi, dada wa kazi, etc."
                            className="block w-full px-4 py-2 border border-gray-300 rounded-lg outline-none shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                            Job Category
                        </label>
                        <select
                            id="category"
                            value={category}
                            required
                            onChange={(e) => setCategory(e.target.value)}
                            className="block w-full px-4 py-2 border border-gray-300 rounded-lg outline-none shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white transition duration-150"
                        >
                            <option value="">-select Category-</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Gender */}
                    <div>
                        <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                            Preferred Gender
                        </label>
                        <select
                            id="gender"
                            required
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            className="block w-full px-4 py-2 border outline-none border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white transition duration-150"
                        >
                            <option value="">select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="any">Any (Not Preference)</option>
                        </select>
                    </div>
                    
                    {/* Education Level */}
                    <div>
                        <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-1">
                            Education level (optional)
                        </label>
                        <select
                            id="education"
                            value={education_level}
                            onChange={(e) => setEducationLevel(e.target.value)}
                            className="block w-full px-4 py-2 border outline-none border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white transition duration-150"
                        >
                            <option value="">-select-</option>
                            <option value="none">No Education Required</option>
                            <option value="primary">Primary Education</option>
                            <option value="secondary">Secondary Education / High School</option>
                            <option value="certificate">Certificate</option>
                            <option value="diploma">Diploma</option>
                        </select>
                    </div>

                    {/* Positions Needed */}
                    <div>
                        <label htmlFor="positions" className="block text-sm font-medium text-gray-700 mb-1">
                            Number of Workers Needed
                        </label>
                        <input
                            type="number"
                            id="positions"
                            value={positionNeeded}
                            onChange={(e) => setPositionNeeded(e.target.value)}
                            min={1}
                            required
                            className="block w-full px-4 py-2 border outline-none border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                        />
                    </div>
                    
                    {/* Deadline Date */}
                    <div>
                        <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">
                            Application Deadline                        </label>
                        <input
                            type="date"
                            id="deadline"
                            required
                            value={deadlineDate}
                            min={new Date().toISOString().split("T")[0]}
                            onChange={(e) => setDeadlineDate(e.target.value)}
                            className="block w-full px-4 py-2 border outline-none border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                        />
                    </div>
                </div>
            </div>

            {/* Salary & Payment Section */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
                <h3 className="text-xl font-semibold text-indigo-700 mb-4">Salary and Payment</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Minimum Salary */}
                    <div>
                        <label htmlFor="min_salary" className="block text-sm font-medium text-gray-700 mb-1">
                            Minimum Salary
                        </label>
                        <input
                            type="number"
                            id="min_salary"
                            value={min_salary}
                            onChange={(e) => setMinSalary(e.target.value)}
                            min={0}
                            placeholder="9000"
                            className="block w-full px-4 py-2 border outline-none border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                        />
                    </div>
                    
                    {/* Maximum Salary */}
                    <div>
                        <label htmlFor="max_salary" className="block text-sm font-medium text-gray-700 mb-1">
                            Maximum Salary
                        </label>
                        <input
                            type="number"
                            id="max_salary"
                            value={max_salary}
                            onChange={(e) => setMaxSalary(e.target.value)}
                            placeholder="10000"
                            min={0}
                            className="block w-full px-4 py-2 border outline-none border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                        />
                    </div>

                    {/* Currency */}
                    <div>
                        <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                            Currency
                        </label>
                        <select
                            id="currency"
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            className="block w-full px-4 py-2 border outline-none border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white transition duration-150"
                        >
                            <option value="TZS">TZS</option>
                            <option value="USD">USD</option>
                        </select>
                    </div>
                    
                    {/* Payment Period */}
                    <div>
                        <label htmlFor="payment_period" className="block text-sm font-medium text-gray-700 mb-1">
                            Payment Period
                        </label>
                        <select
                            id="payment_period"
                            required
                            value={payment_period}
                            onChange={(e) => setPaymentPeriod(e.target.value)}
                            className="block w-full px-4 py-2 border outline-none border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white transition duration-150"
                        >
                            <option value="">-select-</option>
                            <option value="hourly">Per Hour</option>
                            <option value="daily">Per Day</option>
                            <option value="weekly">Per Week</option>
                            <option value="monthly">Per Month</option>
                            <option value="annually">Per Year</option>
                            <option value="piecework">Per Task </option>
                        </select>
                    </div>
                </div>
            </div>


            {/* Job Location Section */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
                <h3 className="text-xl font-semibold text-indigo-700 mb-4">Job Location</h3>
                <p className="text-sm text-gray-500 mb-4">Where is the job physically located?</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Region */}
                    <div>
                        <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">
                            Region
                        </label>
                        <select
                            id="region"
                            value={region}
                            required
                            onChange={(e) => onRegionChange(e.target.value)}
                            className="block w-full px-4 py-2 border outline-none border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white transition duration-150"
                        >
                            <option value="">-select Region-</option>
                            {regions.map((r) => (
                                <option key={r.id} value={r.id}>
                                    {r.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* District */}
                    <div>
                        <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">
                            District
                        </label>
                        <select
                            id="district"
                            value={district}
                            required
                            onChange={(e) => onDistrictsChange(e.target.value)}
                            className="block w-full px-4 py-2  outline-none border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white transition duration-150"
                        >
                            <option value="">-select District-</option>
                            {/* Assuming districts array is populated based on region selection */}
                            {districts.map((d) => (
                                <option key={d.id} value={d.id}>
                                    {d.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Ward */}
                    <div>
                        <label htmlFor="ward" className="block text-sm font-medium text-gray-700 mb-1">
                            Ward
                        </label>
                        <select
                            id="ward"
                            value={ward}
                            required
                            onChange={(e) => setWard(e.target.value)}
                            className="block w-full px-4 py-2 border outline-none border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white transition duration-150"
                        >
                            <option value="">-select Ward-</option>
                            {/* Assuming wards array is populated based on district selection */}
                            {wards.map((w) => (
                                <option key={w.id} value={w.id}>
                                    {w.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
            
            {/* Job Summary */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
                <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-1">
                    Job Summary
                </label>
                <textarea
                    id="summary"
                    value={jobSummary}
                    onChange={(e) => setJobSummary(e.target.value)}
                    required
                    rows={6}
                    className="block w-full px-4 py-2 border outline-none border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                    placeholder="Provide a detailed description of the job, responsibilities, and requirements."
                ></textarea>
            </div>

            {/* Application Methods Section */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
                <h3 className="text-xl font-semibold text-indigo-700 mb-4">How Job Seekers Apply</h3>
                <p className="text-sm text-gray-500 mb-4">Specify how applicants should submit their applications (Select at least one)</p>

                <div className="space-y-4">
                    {/* Through Email */}
                    <div>
                        <label htmlFor="email_app" className="block text-sm font-medium text-gray-700 mb-1">
                            Receive Applications Through  Email
                        </label>
                        <input
                            type="email"
                            id="email_app"
                            value={throughEmail}
                            onChange={(e) => setThroughtEmail(e.target.value)}
                            placeholder="youremail@xyz.co.xy"
                            className="block w-full px-4 py-2 outline-none border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                        />
                    </div>
                    
                    {/* Through WhatsApp */}
                    <div>
                        <label htmlFor="whatsapp_app" className="block text-sm font-medium text-gray-700 mb-1">
                            Receive Applications Through WhatsApp
                        </label>
                        <input
                            type="tel"
                            inputMode="tel"
                            id="whatsapp_app"
                            value={throughWhatsupp}
                            onChange={(e) => setThroughtWhatsupp(e.target.value)}
                            placeholder="e.g., +255..."
                            className="block w-full px-4 py-2 outline-none border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                        />
                    </div>

                    {/* In-App */}
                      
                        <div className="flex items-center px-3 py-4 border border-gray-300 rounded-lg shadow-sm bg-white/60 hover:bg-gray-100 transition">
                            <input
                            type="checkbox"
                            id="inapp_app"
                            checked={throughInapp}
                            onChange={(e) => setThroughtInapp(e.target.checked)}
                            className="h-5 w-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                            />
                            <label
                            htmlFor="inapp_app"
                            className="ml-3 text-sm font-semibold text-gray-700"
                            >
                            Receive Applications via This Platform
                            </label>
                        </div>
                </div>
            </div>

            {/* Submit Button */}
            <div className="pt-5">
                <button disabled={submit}
                    type="submit"
                    className="w-full inline-flex justify-center py-3 px-6 border border-transparent shadow-lg text-lg font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out transform hover:scale-[1.01]"
                >
                   {submit ? "Publishing a job.....":"Publish Job Post"} 
                </button>
            </div>
        </form>
    </div>
</div>

    )
    
}


