import { useState, useEffect } from "react";
import api from "../../AxiosApi/Api";
import {toast} from "react-hot-toast";
import { Briefcase, Building2, ChevronDown, X, Loader2, ArrowLeft } from 'lucide-react';
import { useParams, useNavigate } from "react-router";
import FullScreenLoader from "../../Components/Loader";

// Added a prop for successful creation callback
export default function EditCompanyDetails() {
    const [CompanyName, setCompanyName] = useState("")
    const [Industry, setIndustry] = useState("");
    const [IndustryOther, setIndustryOther] = useState("")

    const [employeesSize, setEmployeeSize] = useState("")
    const [yearFound, setYearFound] = useState("");
    const [Address, setAddress] = useState("")
    const [Website, setWebsite] = useState("")
    const [Email, setEmail] = useState("");
    const [description, setDescription] =useState("")
    const [logo, setLogo] =useState(null);
    const [submit, setIsSubmit] = useState(false);

    //=========== EDIT COMPANY =======

    const [loading, setLoading] = useState(true);
    const { CompPk } = useParams();
    const navigate = useNavigate();

    // --- Data Fetching ---
    const fetchCompany = async () => {
        try {
            const resp = await api.get(`jobs/users/company/user-retrieve/${CompPk}/comp/`);
            if (!resp.data){
                return;
            }
            setCompanyName(resp.data.name || "")
            setIndustry(resp.data.industry || "")
            setEmployeeSize(resp.data.employees_size || "")
            setYearFound(resp.data.year_founded || "")
            setAddress(resp.data.address || "")
            setWebsite(resp.data.website || "")
            setEmail(resp.data.email || "")
            setDescription(resp.data.description || "");

            if (resp.data.logo){
                setLogo(resp.data.logo_url)
            }


        } catch (err) {
            toast.error(
                err.response 
                ? "Failed to fetch company details. The company may not exist or an error occurred." 
                : "Network error. Please check your connection."
            );
            // Optionally redirect if company is not found
            if (err.response && err.response.status === 404) {
                setTimeout(() => navigate(`/dashboard-user-employer/view-company-detail/${CompPk}`), 2000);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompany();
    }, [CompPk]);

    if (loading){
        return <FullScreenLoader/>;
    }


    //=========== EDIT COMPANY =======

   const handleEditCompany = async(e)=>{
    e.preventDefault();
    const currentYrs = new Date().getFullYear();
    if (Number(yearFound) < 1700 || Number(yearFound) > currentYrs){
        toast.error("Enter a valid founding year");
        return;
    }
    setIsSubmit(true);
    try{
        const formData = new FormData();
        formData.append("name", CompanyName);
        formData.append("employees_size", employeesSize);
        formData.append("year_founded", yearFound);
        formData.append("address", Address);
        formData.append("website", Website);
        formData.append("email", Email);
        formData.append("description", description);
        const CorrectIndustry = Industry === "Other" ? IndustryOther : Industry;
        formData.append("industry", CorrectIndustry);
        if (logo instanceof File){
            formData.append("logo", logo);
        }
        
        const resp = await api.patch(`jobs/users/company/user-retrieve/${CompPk}/comp/`, formData, {
            headers:{
                "Content-Type": "multipart/form-data",
            },
        });
            toast.success("Company updated successfully");
         setTimeout(() => navigate(`/dashboard-user-employer/view-company-detail/${CompPk}`), 2000);
       
          
    }catch(err){
          if (err.response){
                const datas = err.response.data;
                   
                if (datas.detail){
                    toast.error(datas.detail);
                }
                else if (typeof datas === "object"){
                    Object.entries(datas).forEach(([key, value])=>{
                        const messages = Array.isArray(value)? value.join(", "): value;
                        toast.error(messages);
                    });
                }else{
                    toast.error("Unexpected error occurred, Please try again later");
                }
         }else{
            toast.error("Network error. Try again later");
         }
    }finally{
        setIsSubmit(false);
    }
   }
    

return (
  
    <div className="min-h-screen flex items-center justify-center sm:p-6">
   
            <form 
                onSubmit={handleEditCompany} 
                className="bg-white rounded-xl shadow-2xl w-full max-w-4xl p-8 sm:p-12 lg:p-14 space-y-10 transform transition-all duration-500"
            >

                {/* Header: Clearer separation, bolder typography, more vibrant colors */}
                <header className="space-y-3 pb-8 border-b border-gray-200">
                    <div className="flex items-center space-x-4 text-indigo-600 mt-7 md:mt-0">
                       <ArrowLeft className="cursor-pointer text-black"  onClick={()=>navigate(-1)}/>
                        <div className="flex items-center gap-2">
                            <Building2 className="w-6 h-6 lg:h-8 lg:w-8 flex-shrink-0 text-indigo-600" /> 
                            <h2 className="text-xl lg:text-3xl font-extrabold text-gray-900 tracking-tight">
                                Edit Company Profile 
                            </h2>                       
                        </div>
                    </div>
                    {/* Subtitle: Improved readability */}
                    <p className="text-gray-500 text-lg">
                        Update your company's essential information and details below.
                    </p>
                </header>

           
                {/* Form Grid: Added more horizontal spacing (gap-x-10), kept vertical spacing. */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-7 sm:gap-y-9">

               
                    {/* Input Field Group Styling */}
                    <div className="md:col-span-1">
                        <label htmlFor="company-name" className="block text-sm font-semibold text-gray-700 mb-2">Company Name <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            required
                            id="company-name"
                            value={CompanyName}
                            onChange={(e)=>setCompanyName(e.target.value)}
                            placeholder="Innovatech Solutions Ltd."
                            // Modern input style: Slightly thicker border on hover/focus, smooth corners
                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition duration-300 shadow-sm hover:border-gray-400"
                        />
                    </div>
                    
                    {/* Industry (Select Dropdown) */}
                    <div className="md:col-span-1">
                    <label htmlFor="industry" className="block text-sm font-semibold text-gray-700 mb-2">
                        Industry <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <select
                            required
                            id="industry"
                            value={Industry}
                            onChange={(e) => setIndustry(e.target.value)}
                            // Modern select style
                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition duration-300 shadow-sm hover:border-gray-400"
                            >
                                    <option value="">- Select Industry -</option>
                                    <option value="Technology">Technology</option>
                                    <option value="Software Development">Software Development</option>
                                    <option value="AI & Machine Learning">AI & Machine Learning</option>
                                    <option value="Finance & Banking">Finance & Banking</option>
                                    <option value="Insurance">Insurance</option>
                                    <option value="Healthcare">Healthcare</option>
                                    <option value="Pharmaceuticals">Pharmaceuticals</option>
                                    <option value="Education">Education</option>
                                    <option value="Manufacturing">Manufacturing</option>
                                    <option value="Agriculture">Agriculture</option>
                                    <option value="Construction & Real Estate">Construction & Real Estate</option>
                                    <option value="Transport & Logistics">Transport & Logistics</option>
                                    <option value="Retail & E-commerce">Retail & E-commerce</option>
                                    <option value="Hospitality & Tourism">Hospitality & Tourism</option>
                                    <option value="Energy & Utilities">Energy & Utilities</option>
                                    <option value="Mining">Mining</option>
                                    <option value="Telecommunications">Telecommunications</option>
                                    <option value="Media & Entertainment">Media & Entertainment</option>
                                    <option value="Advertising & Marketing">Advertising & Marketing</option>
                                    <option value="Consulting">Consulting</option>
                                    <option value="Government & Public Sector">Government & Public Sector</option>
                                    <option value="NGOs & Nonprofit">NGOs & Nonprofit</option>
                                    <option value="Other">Other (Specify)</option>
                        </select>
                        {/* Chevron Icon: More subtle color */}
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                    </div>
                    
                    {/* Conditional Input */}
                    {Industry === "Other" && (
                        <div className="md:col-span-1">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Specify Industry <span className="text-red-500">*</span>
                            </label>
                            <input
                                    type="text"
                                    value={IndustryOther}
                                    onChange={(e) => setIndustryOther(e.target.value)}
                                    placeholder="e.g., Space Exploration"
                                    // Modern input style
                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition duration-300 shadow-sm hover:border-gray-400"
                                    required
                            />
                        </div>
                    )}
                    
                    {/* Employees Size (Select) */}
                    <div className="md:col-span-1">
                        <label htmlFor="employees-size" className="block text-sm font-semibold text-gray-700 mb-2">Employees Size <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <select
                                required
                                id="employees-size"
                                value={employeesSize}
                                onChange={(e)=>setEmployeeSize(e.target.value)}
                                // Modern select style
                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition duration-300 shadow-sm hover:border-gray-400"
                            >
                                <option value="">- Select size -</option>
                                <option value="self_employed">Self Employed</option>
                                <option value="1-10">1–10 employees</option>
                                <option value="11-50">11–50 employees</option>
                                <option value="51-200">51–200 employees</option>
                                <option value="201-500">201–500 employees</option>
                                <option value="501-1000">501–1,000 employees</option>
                                <option value="1001-5000">1,001–5,000 employees</option>
                                <option value="5001-10000">5,001–10,000 employees</option>
                                <option value="10000+">10,000+ employees</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                    
                    {/* Year Founded */}
                    <div className="md:col-span-1">
                        <label htmlFor="year-founded" className="block text-sm font-semibold text-gray-700 mb-2">Year Founded <span className="text-red-500">*</span></label>
                        <input
                            type="number"
                            id="year-founded"
                            value={yearFound}
                            onChange={(e)=>setYearFound(e.target.value)}
                            required
                            inputMode="numeric"
                            placeholder="2020"
                            // Modern input style
                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition duration-300 shadow-sm hover:border-gray-400"
                        />
                    </div>
                    
                    {/* Address (Full width) */}
                    <div className="md:col-span-2">
                        <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">Company Address <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            id="address"
                            value={Address}
                            onChange={(e)=>setAddress(e.target.value)}
                            required
                            placeholder="123 Corporate Drive, Suite 400"
                            // Modern input style
                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition duration-300 shadow-sm hover:border-gray-400"
                        />
                    </div>
                    
                    {/* Website */}
                    <div className="md:col-span-1">
                        <label htmlFor="website" className="block text-sm font-semibold text-gray-700 mb-2">Company Website (Optional)</label>
                        <input
                            type="url"
                            id="website"
                            value={Website}
                            onChange={(e)=>setWebsite(e.target.value)}
                            placeholder="https://yourcompany.com"
                            // Modern input style
                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition duration-300 shadow-sm hover:border-gray-400"
                        />
                    </div>
                    
                    {/* Email */}
                    <div className="md:col-span-1">
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Official Company Email <span className="text-red-500">*</span></label>
                        <input
                            type="email"
                            id="email"
                            value={Email}
                            onChange={(e)=>setEmail(e.target.value)}
                            required
                            placeholder="contact@company.com"
                            // Modern input style
                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition duration-300 shadow-sm hover:border-gray-400"
                        />
                    </div>
                    
                    {/* Description (Full width) */}
                    <div className="md:col-span-2">
                        <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">About Company (Optional)</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e)=>setDescription(e.target.value)}
                            rows="4"
                            placeholder="Describe your company's core business, values, and mission..."
                            // Modern textarea style
                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition duration-300 shadow-sm hover:border-gray-400 resize-none"
                        ></textarea>
                    </div>
                </div>
                
                {/* File Input Section: Clearer visual grouping */}
                <div className="pt-8 border-t border-gray-200 mt-10"> 
                    <label
                        htmlFor="company-logo"
                        className="block text-sm font-semibold text-gray-700 mb-3"
                    >
                        Upload Company Logo (Optional, .jpeg, .jpg, .png)
                    </label>
                <input
                        type="file"
                        id="company-logo"
                        accept="image/png, image/jpeg, image/jpg, image/webp"
                        onChange={(e) => setLogo(e.target.files[0])}
                        // Styled file input for better appearance
                        className="
                        w-full cursor-pointer text-sm text-gray-600
                        file:mr-4 file:py-3 file:px-6
                        file:rounded-xl file:border-0
                        file:text-base file:font-semibold
                        file:bg-indigo-50 file:text-indigo-600
                        hover:file:bg-indigo-100
                        transition duration-300
                        "
                    />
                    {/* Image Preview */}
                    {logo && (
                        <div className="mt-5 flex items-center space-x-5 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
                        <img
                            src={logo && logo instanceof File ? 
                            URL.createObjectURL(logo)
                            : logo}
                            alt="Company Logo Preview"
                            // Softer border and rounded corners for preview
                            className="h-14 w-14 object-contain rounded-full border-2 border-indigo-300 p-1 bg-white"
                        />
                        <span className="text-sm text-gray-800 font-medium truncate">
                            {logo && logo instanceof File ? (
                                <>Selected **{logo.name} </>
                            ):(
                             <> Current logo </>
                             )}
                        </span>
                        </div>
                    )}
                </div>

                {/* Submit Button: Stronger presence, more pronounced hover effect */}

                <button
                    disabled={submit}
                    type="submit"
                    className="w-full flex justify-center items-center py-3.5 px-6 rounded-xl shadow-xl text-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 transition duration-300 ease-in-out mt-10 transform hover:scale-[1.01] hover:shadow-2xl disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-md"
                >
                    {submit ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                            Saving Changes...
                        </>
                    ) : (
                        <>
                            <Building2 className="w-5 h-5 mr-3" />
                            Save Company Profile
                        </>
                    )}
                </button>
            </form>
        </div>

    )
}