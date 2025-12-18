import { useState } from "react";
import api from "../../AxiosApi/Api";
import {toast} from "react-hot-toast";
import { Briefcase, Building2, ChevronDown, X, Loader2 } from 'lucide-react';

// Added a prop for successful creation callback
export default function CreateCompanyModel({onClose, onCompanyCreated}) {
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

   const handleCreateCompany = async(e)=>{
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
        if (logo){
            formData.append("logo", logo);
        }
        
        const resp = await api.post("jobs/users/company/user-list-creates/", formData, {
            headers:{
                "Content-Type": "multipart/form-data",
            },
        });
        if (resp.status === 201){
            toast.success(resp.data.message);
            // Call the success callback and close the modal
            if (onCompanyCreated) onCompanyCreated(); 
            onClose();
        }
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
        
    // True Modal Wrapper: fixed, full screen, centered, dark overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        {/* Modal Content Container: Scrollable on overflow, max width */}
        <div className="w-full max-w-3xl max-h-screen overflow-y-auto bg-white rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] relative">
        
            {/* Close Button: Absolute positioned for easy access */}
            <button
            onClick={onClose}
            className="absolute top-5 right-5 z-10 p-2 text-gray-400 bg-white rounded-full hover:bg-gray-100 hover:text-gray-700 transition"
            >
            <X className="w-6 h-6" />
            </button>
            
            {/* Form Container */}
            <form onSubmit={handleCreateCompany} className="p-8 sm:p-10 lg:p-12 space-y-8">
                
                {/* Form Header */}
                <header className="space-y-3 pb-6 border-b border-indigo-100">
                    <div className="flex items-center space-x-3 text-indigo-700">
                        <Building2 className="w-8 h-8 flex-shrink-0" />
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                            Create Company Profile
                        </h2>
                    </div>
                    <p className="text-md text-gray-500">
                        Fill in your company information. All fields are mandatory unless marked optional.
                    </p>
                </header>
                
                {/* Form Fields: Responsive grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                    
                    {/* Company Name */}
                    <div className="md:col-span-1">
                        <label htmlFor="company-name" className="block text-sm font-semibold text-gray-800 mb-2">Company Name <span className="text-red-500">*</span></label>
                        <input 
                            type="text" 
                            required 
                            id="company-name" 
                            value={CompanyName} 
                            onChange={(e)=>setCompanyName(e.target.value)} 
                            placeholder="Innovatech Solutions Ltd."
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                        />
                    </div>
                    {/* Industry (Select Dropdown) */}
                    <div className="md:col-span-1">
                    <label htmlFor="industry" className="block text-sm font-semibold text-gray-800 mb-2">
                        Industry <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <select
                            required
                            id="industry"
                            value={Industry}
                            onChange={(e) => setIndustry(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
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
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                    </div>
                    {Industry === "Other" && (
                    <div className="md:col-span-1">
                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                        Specify Industry <span className="text-red-500">*</span>
                        </label>
                        <input
                                type="text"
                                value={IndustryOther}
                                onChange={(e) => setIndustryOther(e.target.value)}
                                placeholder="e.g., Space Exploration"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl 
                                            focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                        />
                    </div>
                    )}
                    {/* Employees Size (Select) */}
                    <div className="md:col-span-1">
                        <label htmlFor="employees-size" className="block text-sm font-semibold text-gray-800 mb-2">Employees Size <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <select 
                                required 
                                id="employees-size" 
                                value={employeesSize} 
                                onChange={(e)=>setEmployeeSize(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
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
                        <label htmlFor="year-founded" className="block text-sm font-semibold text-gray-800 mb-2">Year Founded <span className="text-red-500">*</span></label>
                        <input 
                            type="number" 
                            id="year-founded"
                            value={yearFound}
                            onChange={(e)=>setYearFound(e.target.value)} 
                            required  
                            inputMode="numeric" 
                            placeholder="2020"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                        />
                    </div>
                    {/* Address (Full width) */}
                    <div className="md:col-span-2">
                        <label htmlFor="address" className="block text-sm font-semibold text-gray-800 mb-2">Company Address <span className="text-red-500">*</span></label>
                        <input 
                            type="text" 
                            id="address"
                            value={Address}
                            onChange={(e)=>setAddress(e.target.value)}
                            required 
                            placeholder="123 Corporate Drive, Suite 400"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                        />
                    </div>
                    {/* Website */}
                    <div className="md:col-span-1">
                        <label htmlFor="website" className="block text-sm font-semibold text-gray-800 mb-2">Company Website (Optional)</label>
                        <input 
                            type="url" 
                            id="website"
                            value={Website} 
                            onChange={(e)=>setWebsite(e.target.value)}
                            placeholder="https://yourcompany.com"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                        />
                    </div>
                    {/* Email */}
                    <div className="md:col-span-1">
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-2">Official Company Email <span className="text-red-500">*</span></label>
                        <input 
                            type="email" 
                            id="email"
                            value={Email} 
                            onChange={(e)=>setEmail(e.target.value)} 
                            required 
                            placeholder="contact@company.com"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                        />
                    </div>
                    {/* Description (Full width) */}
                    <div className="md:col-span-2">
                        <label htmlFor="description" className="block text-sm font-semibold text-gray-800 mb-2">About Company (Optional)</label>
                        <textarea 
                            id="description"
                            value={description} 
                            onChange={(e)=>setDescription(e.target.value)} 
                            rows="4"
                            placeholder="Describe your company's core business, values, and mission..."
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                        ></textarea>
                    </div>
                </div>
                {/* Separator for File Input */}
                <div className="pt-6 border-t border-gray-100">
                    <label 
                        htmlFor="company-logo"
                        className="block text-sm font-semibold text-gray-800 mb-2"
                    >
                        Upload Company Logo (Optional, .jpeg, .jpg, .png)
                    </label>
                <input
                        type="file"
                        id="company-logo"
                        accept="image/png, image/jpeg, image/jpg, image/webp"
                        onChange={(e) => setLogo(e.target.files[0])}
                        className="
                        w-full cursor-pointer text-sm text-gray-700
                        file:mr-4 file:py-2.5 file:px-6
                        file:rounded-xl file:border-0
                        file:text-sm file:font-bold
                        file:bg-indigo-50 file:text-indigo-700
                        hover:file:bg-indigo-100
                        transition duration-200
                        "
                    />
                    {/* Image Preview */}
                    {logo && (
                        <div className="mt-4 flex items-center space-x-4">
                        <img
                            src={URL.createObjectURL(logo)}
                            alt="Company Logo Preview"
                            className="h-16 w-16 object-cover rounded-xl border border-gray-200"
                        />
                        <span className="text-sm text-gray-600 font-medium">Image Selected: {logo.name}</span>
                        </div>
                    )}
                </div>
                
                {/* Submit Button */}
                <button 
                    disabled={submit} 
                    type="submit" 
                    className="w-full flex justify-center items-center py-3.5 px-6 rounded-xl shadow-lg text-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 transition duration-300 ease-in-out mt-8 transform hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {submit ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                            Saving...
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
    </div>
    )
}