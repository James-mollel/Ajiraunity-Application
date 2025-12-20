import { useState, useEffect } from "react";
import api from "../AxiosApi/Api"
import {toast} from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, BookIcon, BookOpen, DollarSign, MailIcon, MapPin, UserCogIcon } from "lucide-react";


export default function PostProfessionalJobs() {

    const navigate = useNavigate();

    const [categories, setCategories] = useState([])
    const [regions, setRegions] = useState([])
    const [districts, setDistricts] = useState([])
    const [wards, setWards] = useState([])

    // =========LOCATION DATA =========

    const [region, setRegion] = useState("")
    const [district, setDistrict] = useState("")
    const [ward, setWard] = useState("")

    // ==========DATA ============

    const [companies,setCompanies] = useState([]);


    const [title, setTitle] = useState("");
    const [company, setCompany] = useState("");
    const [jobType, setJobType] = useState("");
    const [education_level, setEducationLevel] = useState("");
    const [experience_level, setExperienceLevel] = useState("");

    const [category, setCategory] = useState("");
    const [gender, setGender] = useState("");


    const [max_salary, setMaxSalary] = useState("");
    const [min_salary, setMinSalary] = useState("");
    const [salary_visible, setSalaryvisible] = useState(false);
    const [currency, setCurrency] = useState("");

    const [payment_period, setPaymentPeriod] = useState("");
    const [positionNeeded, setPositionNeeded] = useState("");
    const [deadlineDate, setDeadlineDate] = useState("");
    const [jobSummary, setJobSummary] = useState("");

    const [duties, setDuties] = useState("")
    const [skills_required, setSkillsRequired] = useState("")

    const [throughEmail, setThroughtEmail] = useState("")
    const [throughWhatsupp, setThroughtWhatsupp] = useState("")
    const [throughYourWeb, setThroughtYourWeb] = useState("")
    const [throughInapp, setThroughtInapp] = useState(true);

    const [submit, setIsSubmit] = useState(false);

    const fetchCompanies = async()=>{
        try{
            const resp = await api.get("jobs/users/company/user-list-creates/")
            setCompanies(resp.data);
        }catch(err){
            if (err.response){
                toast.error("Failed to load companies details")
            }else{
                toast.error("Network error. Try again later");
            }
        }
    }


     const fetchProfessionalCategories = async()=>{
                try{
                  const resp = await api.get("jobs/users/category/category-professional/");
                  setCategories(resp.data);
                  
                }catch(err){ 
                  toast.error("failed to laad jobs category.Try again later")
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
         await fetchProfessionalCategories();
         await fetchRegions();
         await fetchCompanies();
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
        
        if (throughWhatsupp.trim() !== "" && !phoneRegex.test(throughWhatsupp)){
            toast.error("WhatsApp number must start with +255 and contain 9 digits. Example: +255712345678");
            return;
        }

        if (!throughEmail && !throughInapp && !throughWhatsupp && !throughYourWeb){
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
            formData.append("job_type", jobType);
            formData.append("education_level", education_level);
            formData.append("experience_level",experience_level)
            formData.append("gender", gender);
            formData.append("salary_max", max_salary);
            formData.append("salary_min", min_salary);
            formData.append("salary_visible",salary_visible);
            formData.append("currency", currency);
            formData.append("payment_period", payment_period);
            formData.append("positions_needed", positionNeeded);
            formData.append("deadline", deadlineDate);
            formData.append("job_summary", jobSummary);
            formData.append("duties",duties);
            formData.append("skills_required", skills_required);

            formData.append("apply_website", throughYourWeb);
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
            if (company){
                formData.append("company_id",company)
            }

            const resp = await api.post("jobs/users/jobs/company-based/create/", formData);
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
 <div className=" md:p-8 bg-gray-100 min-h-screen">
    <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-xl p-6 sm:p-8 lg:p-10">
        <div className="flex items-center space-x-4 mt-9 md:mt-0 mb-4">
            <ArrowLeft className="cursor-pointer" onClick={()=>navigate(-1)}/>
            <h2 className="text-xl lg:text-3xl font-extrabold text-gray-900 border-b-4 border-indigo-600 pb-3">
                ✨ Post Professional Job
            </h2>
                    
        </div>

        <form onSubmit={handleSubmitJob} className="space-y-10">

            {/* Job Requirements & Details Section */}
            <section className="bg-white p-6 rounded-lg border border-gray-200 shadow-md">
                <h3 className="text-2xl font-bold text-indigo-700 mb-6 flex items-center">
                    <BookIcon  className="h-6 w-6 mr-2 text-indigo-500" />
                    Job Details
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Title */}
                    <div className="col-span-1 sm:col-span-2 lg:col-span-1">
                        <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-1">
                            Job Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title} required
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Software Developer, Accountant, HR Officer"
                            className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 placeholder-gray-400"
                        />
                    </div>

                    {/* Company */}
                    <div>
                        <label htmlFor="company" className="block text-sm font-semibold text-gray-700 mb-1">
                            Hiring Company <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="company"
                            value={company}
                            required
                            onChange={(e) => setCompany(e.target.value)}
                            className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white transition duration-200 appearance-none"
                        >
                            <option value="">- Select Company -</option>
                            {companies.map((comp) => (
                                <option key={comp.id} value={comp.id}>
                                    {comp.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Category */}
                    <div>
                        <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-1">
                            Job Category <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="category"
                            value={category}
                            required
                            onChange={(e) => setCategory(e.target.value)}
                            className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white transition duration-200 appearance-none"
                        >
                            <option value="">- Select Category -</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.display_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    {/* Job Type */}
                    <div>
                        <label htmlFor="job_type" className="block text-sm font-semibold text-gray-700 mb-1">
                            Job Type <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="job_type"
                            value={jobType}
                            required
                            onChange={(e) => setJobType(e.target.value)}
                            className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white transition duration-200 appearance-none"
                        >
                            <option value="">- Select Type -</option>
                            <option value="full_time">Full Time</option>
                            <option value="part_time">Part Time</option>
                            <option value="contract">Contract</option>
                            <option value="temporary">Temporary</option>
                            <option value="internship">Internship</option>
                            <option value="freelance">Freelance</option>
                            <option value="remote">Remote</option>
                        </select>
                    </div>

                    {/* Positions Needed */}
                    <div>
                        <label htmlFor="positions" className="block text-sm font-semibold text-gray-700 mb-1">
                            Positions Needed <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            id="positions"
                            value={positionNeeded}
                            onChange={(e) => setPositionNeeded(e.target.value)}
                            min={1}
                            required
                            placeholder="1"
                            className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 placeholder-gray-400"
                        />
                    </div>
                    
                    {/* Deadline Date */}
                    <div>
                        <label htmlFor="deadline" className="block text-sm font-semibold text-gray-700 mb-1">
                            Application Deadline <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            id="deadline"
                            required
                            value={deadlineDate}
                            min={new Date().toISOString().split("T")[0]}
                            onChange={(e) => setDeadlineDate(e.target.value)}
                            className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                        />
                    </div>

                </div>
            </section>
            
            {/* Candidate Requirements Section */}
            <section className="bg-white p-6 rounded-lg border border-gray-200 shadow-md">
                <div className="mb-6 flex items-center">
                   <UserCogIcon className="h-8 w-8 mr-2 text-indigo-500" />
                   <p className="text-2xl font-bold text-indigo-700"> Applicant Requirements</p>  
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    
                    {/* Gender */}
                    <div>
                        <label htmlFor="gender" className="block text-sm font-semibold text-gray-700 mb-1">
                            Preferred Gender <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="gender"
                            required
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white transition duration-200 appearance-none"
                        >
                            <option value="">- Select Gender -</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="any">Any (Not Preference)</option>
                        </select>
                    </div>
                    
                    {/* Experience Level */}
                    <div>
                        <label htmlFor="experience_level" className="block text-sm font-semibold text-gray-700 mb-1">
                            Experience Level <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="experience_level"
                            required
                            value={experience_level}
                            onChange={(e) => setExperienceLevel(e.target.value)}
                            className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white transition duration-200 appearance-none"
                        >
                            <option value="">- Select Level -</option>
                            <option value="no_experience">No Experience Required</option>
                            <option value="entry">Entry Level (0-2 years)</option>
                            <option value="mid">Mid Level (3-5 years)</option>
                            <option value="senior">Senior Level (5+ years)</option>
                            <option value="executive">Executive / Director</option>
                        </select>
                    </div>

                    {/* Education Level */}
                    <div>
                        <label htmlFor="education" className="block text-sm font-semibold text-gray-700 mb-1">
                            Education Level <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="education"
                            required
                            value={education_level}
                            onChange={(e) => setEducationLevel(e.target.value)}
                            className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white transition duration-200 appearance-none"
                        >
                            <option value="">- Select Level -</option>
                            <option value="none">No Education Required</option>
                            <option value="primary">Primary Education</option>
                            <option value="secondary">Secondary Education / High School</option>
                            <option value="certificate">Certificate</option>
                            <option value="diploma">Diploma</option>
                            <option value="bachelor">Bachelor’s Degree</option>
                            <option value="master">Master’s Degree</option>
                            <option value="phd">Doctorate (PhD)</option>
                        </select>
                    </div>
                </div>
            </section>


            {/* Job Description Section - Combined Textareas */}
            <section className="bg-white p-6 rounded-lg border border-gray-200 shadow-md space-y-8">
                <div className=" mb-6 flex items-center">
                    <BookOpen className="h-6 w-6 mr-2 text-indigo-500" />
                     <p className="text-2xl font-bold text-indigo-700"> Job Description </p> 
                </div>
                
                {/* Job Summary */}
                <div>
                    <label htmlFor="summary" className="block text-sm font-semibold text-gray-700 mb-1">
                        Job Summary <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        id="summary"
                        value={jobSummary}
                        onChange={(e) => setJobSummary(e.target.value)}
                        required
                        rows={3}
                        className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 placeholder-gray-400"
                        placeholder="Write a brief overview of the role, key objectives, and who it reports to."
                    ></textarea>
                </div>

                {/* Duties */}
                <div>
                    <label htmlFor="duties" className="block text-sm font-semibold text-gray-700 mb-1">
                        Core Duties & Responsibilities
                    </label>
                    <textarea
                        id="duties"
                        value={duties}
                        onChange={(e) => setDuties(e.target.value)}
                        
                        rows={5}
                        className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 placeholder-gray-400"
                        placeholder="List specific tasks and responsibilities (e.g.,  Develop scalable web applications, Prepare monthly financial reports,  Manage project timelines)."
                    ></textarea>
                </div>

                {/* Skills required */}
                <div>
                    <label htmlFor="skills_requird" className="block text-sm font-semibold text-gray-700 mb-1">
                        Required Skills & Qualifications 
                    </label>
                    <textarea
                        id="skills_required"
                        value={skills_required}
                        onChange={(e) => setSkillsRequired(e.target.value)}
                        rows={3}
                        className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 placeholder-gray-400"
                        placeholder="Specify essential skills and qualifications e.g., React.js, CPA license, 3+ years experience."
                    ></textarea>
                </div>
            </section>
            
            {/* Salary & Location Section */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Salary & Payment Section */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-md">
                    <div className=" mb-6 flex items-center">
                        <DollarSign className="h-6 w-6 mr-2 text-indigo-500"  />
                        <p className="text-2xl font-bold text-indigo-700"> Compensation & Salary </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                        {/* Minimum Salary */}
                        <div>
                            <label htmlFor="min_salary" className="block text-sm font-semibold text-gray-700 mb-1">
                                Min Salary 
                            </label>
                            <input
                                type="number"
                                id="min_salary"
                                value={min_salary}
                                onChange={(e) => setMinSalary(e.target.value)}
                                min={0}
                                placeholder="800000"
                                className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 placeholder-gray-400"
                            />
                        </div>
                        
                        {/* Maximum Salary */}
                        <div>
                            <label htmlFor="max_salary" className="block text-sm font-semibold text-gray-700 mb-1">
                                Max Salary
                            </label>
                            <input
                                type="number"
                                id="max_salary"
                                value={max_salary}
                                onChange={(e) => setMaxSalary(e.target.value)}
                                placeholder="1200000"
                                min={0}
                                className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 placeholder-gray-400"
                            />
                        </div>
                        
                        {/* Currency */}
                        <div>
                            <label htmlFor="currency" className="block text-sm font-semibold text-gray-700 mb-1">
                                Currency
                            </label>
                            <select
                                id="currency"
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value)}
                                className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white transition duration-200 appearance-none"
                            >
                                <option value="TZS">TZS</option>
                                <option value="USD">USD</option>
                            </select>
                        </div>
                        
                        {/* Payment Period */}
                        <div>
                            <label htmlFor="payment_period" className="block text-sm font-semibold text-gray-700 mb-1">
                                Payment Period
                            </label>
                            <select
                                id="payment_period"
                                value={payment_period}
                                onChange={(e) => setPaymentPeriod(e.target.value)}
                                className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white transition duration-200 appearance-none"
                            >
                                <option value="">- Select Period -</option>
                                <option value="hourly">Per Hour</option>
                                <option value="daily">Per Day</option>
                                <option value="weekly">Per Week</option>
                                <option value="monthly">Per Month</option>
                                <option value="annually">Per Year</option>
                                <option value="piecework">Per Task</option>
                            </select>
                        </div>

                        {/* Salary Visibility */}
                        <div className="col-span-2 pt-2">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="salary_visibility"
                                    checked={salary_visible}
                                    onChange={(e) => setSalaryvisible(e.target.checked)}
                                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                />
                                <label htmlFor="salary_visibility" className="ml-2 block text-sm font-medium text-gray-700">
                                    Show salary range publicly
                                </label>
                            </div>
                        </div>
                    </div>
                </div>


                {/* Job Location Section */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-md">
                    <div className=" mb-6 flex items-center">
                        <MapPin className="h-6 w-6 mr-2 text-indigo-500"/> 
                          <p className="text-2xl font-bold text-indigo-700">Job Location</p> 
                    </div>
                    <p className="text-sm text-gray-500 mb-4">Specify the physical job location.</p>
                    
                    <div className="grid grid-cols-1 gap-6">
                        {/* Region */}
                        <div>
                            <label htmlFor="region" className="block text-sm font-semibold text-gray-700 mb-1">
                                Region <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="region"
                                value={region}
                                required
                                onChange={(e) => onRegionChange(e.target.value)}
                                className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white transition duration-200 appearance-none"
                            >
                                <option value="">- Select Region -</option>
                                {regions.map((r) => (
                                    <option key={r.id} value={r.id}>
                                        {r.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* District */}
                        <div>
                            <label htmlFor="district" className="block text-sm font-semibold text-gray-700 mb-1">
                                District <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="district"
                                value={district}
                                required
                                onChange={(e) => onDistrictsChange(e.target.value)}
                                className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white transition duration-200 appearance-none"
                            >
                                <option value="">- Select District -</option>
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
                            <label htmlFor="ward" className="block text-sm font-semibold text-gray-700 mb-1">
                                Ward <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="ward"
                                value={ward}
                                required
                                onChange={(e) => setWard(e.target.value)}
                                className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white transition duration-200 appearance-none"
                            >
                                <option value="">- Select Ward -</option>
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
            </section>

            {/* Application Methods Section */}
            <section className="bg-white p-6 rounded-lg border border-gray-200 shadow-md">
                <div className=" mb-6 flex items-center">
                    <MailIcon  className="h-6 w-6 mr-2 text-indigo-500" />
                    <p className="text-2xl font-bold text-indigo-700 ">Application Channels</p> 
                </div>
                <p className="text-sm text-gray-500 mb-4 italic">Specify how applicants should submit their applications (Select at least one).</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-center">
                    {/* Through Email */}
                    <div className="md:col-span-1">
                        <label htmlFor="email_app" className="block text-sm font-semibold text-gray-700 mb-1">
                            Receive Applications via Company email
                        </label>
                        <input
                            type="email"
                            id="email_app"
                            value={throughEmail}
                            onChange={(e) => setThroughtEmail(e.target.value)}
                            placeholder="e.g. careers@company.co.tz"
                            className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 placeholder-gray-400"
                        />
                    </div>

                    {/* Through Website */}
                    <div className="md:col-span-1">
                        <label htmlFor="web_app" className="block text-sm font-semibold text-gray-700 mb-1">
                            Receive Applications via Company Website 
                        </label>
                        <input
                            type="url"
                            id="web_app"
                            value={throughYourWeb}
                            onChange={(e) => setThroughtYourWeb(e.target.value)}
                            placeholder="e.g. https://company.co.tz/jobs/apply"
                            className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 placeholder-gray-400"
                        />
                    </div>
                    
                    {/* Through WhatsApp */}
                    <div className="md:col-span-1">
                        <label htmlFor="whatsapp_app" className="block text-sm font-semibold text-gray-700 mb-1">
                            Receive Applications via WhatsApp
                        </label>
                        <input
                            type="tel"
                            inputMode="tel"
                            id="whatsapp_app"
                            value={throughWhatsupp}
                            onChange={(e) => setThroughtWhatsupp(e.target.value)}
                            placeholder="e.g., +255..."
                            className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 placeholder-gray-400"
                        />
                    </div>

                    {/* In-App */}
            

                    <div className="md:col-span-1">
                        <div className="flex items-center p-3 border border-gray-300 rounded-lg shadow-sm bg-gray-50 hover:bg-gray-100 transition">
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
            </section>

            {/* Submit Button */}
            <div className="pt-4">
                <button disabled={submit}
                    type="submit"
                    className="w-full inline-flex justify-center py-3 px-6 border border-transparent shadow-xl text-xl font-bold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out transform hover:scale-[1.01] disabled:bg-indigo-400 disabled:cursor-not-allowed"
                >
                    {submit ? "Publishing Job..." : "Publish Job Post"} 
                </button>
            </div>
        </form>
    </div>
</div>





    )
    
}


