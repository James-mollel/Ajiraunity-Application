


import { useParams, Link } from "react-router-dom";
import api from "../AxiosApi/Api";
import { useContext, useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import {
    Heart, Flag, MapPin, DollarSign, Briefcase, Award, GraduationCap, Users, Clock,
    Building2, Mail, Globe, MessageSquare, CheckCircle, UploadCloud, ChevronRight, X, LoaderIcon
} from 'lucide-react';
import { AuthContext } from "../AxiosApi/AuthPages";
import FullScreenLoader from "../Components/Loader";

// --- Helper Functions ---
const formatSalary = (min, max, currency, period) => {
    if (min || max) {
        const minStr = min ? Number(min).toLocaleString() : 'N/A';
        const maxStr = max ? Number(max).toLocaleString() : 'N/A';
        const periodStr = period ? `/${period.toLowerCase().replace('per ', '')}` : '';
        return `${currency} ${minStr} - ${maxStr} ${periodStr}`;
    }
    return "Negotiable";
};

// --- Main Component ---
export default function JobDetailsPage() {
    const [job, setJob] = useState(null); // Initialize as null for check
    const [loading, setLoading] = useState(true);
    const [isApply, setIsApply] = useState(false);

    // Modal/UI State
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false); // New state for report

    // Application State
    const [userProfile, setUserProfile] = useState({});
    const [applyMethod, setApplyMethod] = useState("");
    const [coverLetter, setCoverLetter] = useState("");
    const [cv, setCv] = useState(null);

    // Auth & Route
    const { isAuthenticated, userRole } = useContext(AuthContext);
    const { JobSlug } = useParams();

    // Saved Job State
    const [saved, setSaved] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    
    // Check if CV is required based on job type and if user has a CV
    const isCvRequired = job?.post_type === "COMPANY" && !userProfile.current_cv;


    // Memoized Script for external applications (avoids defining inside render)
    const Script = useMemo(() => {
        if (!job || !userProfile) return "";
        return `Hello, I am interested to apply in this job '${job.title}'.

👤 Full Name: ${userProfile.full_name || 'N/A'}
💼 Profession: ${userProfile.job_title || 'N/A'}
📞 Phone: ${userProfile.phone_number || 'N/A'}

Here is my complete profile and application details:
🔗 {{application_url}}

Thank you for the opportunity.`;
    }, [job, userProfile]);
                    
    // --- FETCH HANDLES ---

    const fetchJobDetails = async () => {
        try {
            const resp = await api.get(`jobs/users/retrieve/job/${JobSlug}`);
            setJob(resp.data);
            // Initialize saved state based on fetched data
            setSaved(resp.data.is_job_saved || false); 
        } catch (err) {
            toast.error("Failed to fetch job details");
        } finally {
            setLoading(false);
        }
    };

    const fetchProfile = async () => {
        try {
            const resp = await api.get("jobs/details/user/jobseeker/user-data/");
            setUserProfile(resp.data);
        } catch (err) {
            console.error("Failed to fetch profile");
        }
    };

    useEffect(() => {
        fetchJobDetails();
    }, [JobSlug]);

    useEffect(() => {
        if (isAuthenticated && userRole === "WORKER") {
            fetchProfile();
        }
    }, [isAuthenticated, userRole]);


    // --- ACTION HANDLES ---

    const handleSave = async (e) => {
        e.stopPropagation();
        e.preventDefault();

        if (!isAuthenticated) {
            setShowLoginModal(true);
            return;
        }

        setSaveLoading(true);
        try {
            const { data } = await api.post("jobs/details/user/save-unsave/job/", { job_slug: JobSlug });
            toast.success(data.message);
            setSaved(data.saved);
        } catch (err) {
            toast.error(err.response?.status === 401 ? "Please login to save jobs" : "Failed to update saved status");
        } finally {
            setSaveLoading(false);
        }
    };
    
    const handleApplyClick = (method) => {
        setApplyMethod(method);
        
        if (!isAuthenticated) {
            setShowLoginModal(true);
            return;
        }
        if (userRole !== "WORKER") {
            toast.error("Only Job seekers can apply for jobs!");
            return;
        }

        showApplyModal(true)
        
        // If the method is external and requires no data submission, execute immediately
        if (method === "WEBSITE" || method === "WHATSAPP" || method === "EMAIL") {
             // For external application, we can choose to execute the final navigation/opening logic here
             // or still use the handleJobApplication for consistent tracking on the backend.
             // For this refactor, we stick to the backend tracking method.
             handleJobApplication({ preventDefault: () => {} }); // Call with a dummy event
        } else if (method === "IN_PLATFORM") {
            setShowApplyModal(true);
        }
    };


    const handleJobApplication = async (e) => {
        e.preventDefault();

        // Application logic validation (only for IN_PLATFORM if modal is shown)
        if (applyMethod === "IN_PLATFORM") {
            if (coverLetter.trim().length < 20) {
                toast.error("Cover letter must be at least 20 characters long.");
                return;
            }
            if (isCvRequired && !cv) {
                toast.error("CV required for this job! Please upload one.");
                return;
            }
        }
        
        
        
        try {
            setIsApply(true);
            const formData = new FormData();
            formData.append("job_slug", JobSlug);
            formData.append("application_method", applyMethod);
            
            if (applyMethod === "IN_PLATFORM") {
                formData.append("cover_letter", coverLetter);
                if (cv) {
                    formData.append("cv", cv);
                }
            }

            const resp = await api.post('jobs/details/user/applications-apply/jobs/', formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            if (resp.status === 201) {
                toast.success(resp.data.message);
                setShowApplyModal(false);
                
                // --- External Redirection ---
                if (applyMethod === "WHATSAPP") {
                    const url = `https://wa.me/${job.apply_whatsapp}?text=${encodeURIComponent(Script)}`;
                    window.open(url, "_blank");
                } else if (applyMethod === "EMAIL") {
                    const subject = `Application for ${job.title}`;
                    const url = `mailto:${job.apply_email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(Script)}`;
                    window.location.href = url;
                } else if (applyMethod === "WEBSITE") {
                    window.open(job.apply_website, "_blank");
                }
            }
        } catch (err) {
            // ... (Improved error handling remains the same) ...
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
        } finally {
            setIsApply(false);
        }
    };


    if (loading) {
        return <FullScreenLoader />;
    }
    
    if (!job) {
        return <div className="text-center py-20 text-xl text-gray-500">Job not found.</div>;
    }


    const isCompanyPost = job.post_type === "COMPANY";
    
    const JobFeature = ({icon: Icon, label, value, colorClass = "text-indigo-600"}) => (
        <div className="flex items-center space-x-3 text-sm">
            <Icon className={`w-5 h-5 ${colorClass}`} />
            <div className="flex flex-col">
                <span className="text-gray-500 font-medium">{label}</span>
                <span className="font-semibold text-gray-800">{value}</span>
            </div>
        </div>
    );
    
    const ApplicationMethodButton = ({ method, label, icon: Icon, email, website, whatsapp }) => {
        const isActive = applyMethod === method;
        const isDisabled = (method === 'EMAIL' && !email) || (method === 'WEBSITE' && !website) || (method === 'WHATSAPP' && !whatsapp) || (method === 'IN_PLATFORM' && !job.apply_in_app);

        return (
            <button
                onClick={() => handleApplyClick(method)}
                disabled={isDisabled}
                className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition duration-200 ${
                    isActive
                        ? "border-indigo-500 bg-indigo-50 shadow-md"
                        : "border-gray-200 bg-white hover:bg-gray-50"
                } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
                <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-indigo-600" />
                    <span className="font-semibold text-gray-800">{label}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-500" />
            </button>
        );
    };


    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* --- HEADER & ACTIONS --- */}
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
                    <div className="flex items-center gap-4">
                        <h1 className="text-4xl font-extrabold text-gray-900">{job.title}</h1>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        {/* Save Button */}
                        <button
                            onClick={handleSave}
                            disabled={saveLoading}
                            className="p-3 rounded-full bg-white border border-gray-300 shadow-sm hover:bg-gray-100 transition"
                        >
                            {saveLoading ? (
                                <LoaderIcon className="w-6 h-6 animate-spin text-indigo-600" />
                            ) : (
                                <Heart className={`w-6 h-6 transition-all ${saved ? "fill-red-500 text-red-500 scale-110" : "text-gray-400 hover:text-red-500"}`} />
                            )}
                        </button>
                        
                        {/* Report Button */}
                        <button 
                            onClick={() => setShowReportModal(true)}
                            className="flex items-center space-x-2 px-4 py-3 bg-white border border-gray-300 text-red-600 rounded-xl shadow-sm hover:bg-red-50 transition font-medium"
                        >
                            <Flag className="w-5 h-5" />
                            <span>Report Job</span>
                        </button>
                    </div>
                </div>

                <div className="lg:grid lg:grid-cols-3 lg:gap-10">
                    
                    {/* --- LEFT COLUMN: JOB DETAILS (2/3 width) --- */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* 1. KEY FEATURES CARD */}
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">Job Overview</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6">
                                <JobFeature icon={DollarSign} label="Salary" value={formatSalary(job.salary_min, job.salary_max, job.currency, job.payment_period_display)} colorClass="text-green-600" />
                                <JobFeature icon={MapPin} label="Location" value={`${job.region_name} . ${job.district_name} ${job.ward_name}`} />
                                <JobFeature icon={Briefcase} label="Job Type" value={job.job_type_display || 'N/A'} />
                                <JobFeature icon={Award} label="Experience" value={job.experience_level_display || 'Any Level'} />
                                <JobFeature icon={GraduationCap} label="Education" value={job.education_level_display || 'N/A'} />
                                <JobFeature icon={Users} label="Positions" value={`${job.positions_needed} Needed`} />
                            </div>
                        </div>
                        
                        {/* 2. MAIN DESCRIPTION & SUMMARY */}
                        <div className="bg-white p-6 rounded-2xl shadow-lg space-y-6 border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-800">Job Summary</h2>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{job.job_summary}</p>
                        </div>

                        {/* 3. COMPANY SPECIFIC DETAILS */}
                        {isCompanyPost && (
                            <div className="bg-white p-6 rounded-2xl shadow-lg space-y-6 border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-800">Duties & Requirements</h2>
                                
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-700 mb-2 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-indigo-500"/> Duties</h3>
                                    <div className="text-gray-600 whitespace-pre-wrap pl-3" dangerouslySetInnerHTML={{__html: job.duties}}></div>
                                </div>
                                
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-700 mb-2 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-indigo-500"/> Required Skills</h3>
                                    <div className="text-gray-600 whitespace-pre-wrap pl-3" dangerouslySetInnerHTML={{__html: job.skills_required}}></div>
                                </div>
                            </div>
                        )}

                        {/* 4. DEADLINE */}
                        <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg text-red-800 font-semibold flex items-center gap-2">
                            <Clock className="w-5 h-5" />
                            <span>Apply before: {new Date(job.deadline).toLocaleDateString()}</span>
                        </div>
                        
                        {/* 5. COMPANY INFO CARD */}
                        {isCompanyPost && job.company_name && (
                            <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center gap-5 border border-gray-100">
                                <div className="w-20 h-20 rounded-xl bg-gray-100 border flex items-center justify-center overflow-hidden flex-shrink-0">
                                    {job.company_logo ? (
                                        <img src={job.company_logo} alt={`${job.company_name} logo`} className="w-full h-full object-cover" />
                                    ) : (
                                        <Building2 className="w-10 h-10 text-gray-500" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">{job.company_name}</h3>
                                    <p className="text-gray-600 text-sm">{job.company_employees_size} Employees</p>
                                    <div className="flex gap-4 mt-2 text-sm">
                                        {job.company_website && (
                                            <a href={job.company_website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline flex items-center gap-1">
                                                <Globe className="w-4 h-4"/> Website
                                            </a>
                                        )}
                                        <p className="text-gray-500 flex items-center gap-1">
                                            <MapPin className="w-4 h-4"/> {job.company_address || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                    </div>

                    {/* --- RIGHT COLUMN: APPLICATION PANEL (1/3 width) --- */}
                    <div className="lg:col-span-1 mt-8 lg:mt-0 space-y-6">
                        <div className="sticky top-20 bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                            <h2 className="text-2xl font-bold text-indigo-600 mb-6">Apply Now</h2>

                            <p className="text-sm text-gray-600 mb-4">Select your preferred application method below:</p>

                            <div className="space-y-3">
                                <ApplicationMethodButton 
                                    method="IN_PLATFORM" 
                                    label="Apply In-App" 
                                    icon={Briefcase} 
                                    isApp={job.apply_in_app}
                                />
                                <ApplicationMethodButton 
                                    method="EMAIL" 
                                    label="Via Email" 
                                    icon={Mail} 
                                    email={job.apply_email}
                                />
                                <ApplicationMethodButton 
                                    method="WHATSAPP" 
                                    label="Via WhatsApp" 
                                    icon={MessageSquare} 
                                    whatsapp={job.apply_whatsapp}
                                />
                                <ApplicationMethodButton 
                                    method="WEBSITE" 
                                    label="Via Company Website" 
                                    icon={Globe} 
                                    website={job.apply_website}
                                />
                            </div>
                            
                            <hr className="my-5 border-gray-200" />
                            
                            <p className="text-xs text-gray-500 text-center">
                                Posted on: {new Date(job.created_at).toLocaleDateString()}
                                {isCompanyPost ? ` by ${job.company_name}` : ' by Individual'}
                            </p>
                        </div>
                    </div>
                </div>

            </div>

            {/* --- MODALS (Replaced basic div with clean modal structure) --- */}
            
            {/* Login Required Modal */}
            {showLoginModal && (
                <Modal onClose={() => setShowLoginModal(false)} title="Login Required">
                    <p className="text-lg text-gray-700 mb-6">You must be logged in as a **Job Seeker** to apply for or save jobs.</p>
                    <div className="space-y-3">
                        <Link to="/user-login" className="block w-full text-center px-4 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition">
                            Login Now
                        </Link>
                        <Link to="/account-type" className="block w-full text-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition">
                            Create Account
                        </Link>
                    </div>
                </Modal>
            )}

            {/* In-Platform Application Modal */}
            {showApplyModal && (
                <Modal onClose={() => setShowApplyModal(false)} title={`Applying for: ${job.title}`}>
                    <form onSubmit={handleJobApplication} className="space-y-5">
                        <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                            <h3 className="font-semibold text-indigo-700">Applicant Details</h3>
                            <p className="text-sm text-indigo-600">Full Name: {userProfile.full_name || 'N/A'}</p>
                            <p className="text-sm text-indigo-600">Email: {userProfile.email || 'N/A'}</p>
                        </div>
                        
                        {/* Cover Letter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Cover Letter (Min 20 characters)</label>
                            <textarea
                                value={coverLetter}
                                onChange={(e) => setCoverLetter(e.target.value)}
                                placeholder="State why you are the best fit for this job..."
                                rows="5"
                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>

                        {/* CV Requirement */}
                        {isCvRequired && (
                            <div className="p-4 border-2 border-dashed border-red-300 rounded-lg bg-red-50">
                                <label className="block text-sm font-bold text-red-700 mb-2 flex items-center gap-2">
                                    <UploadCloud className="w-5 h-5"/> CV Required for this job*
                                </label>
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={(e) => setCv(e.target.files[0])}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                    required={isCvRequired && !userProfile.current_cv}
                                />
                            </div>
                        )}

                        {/* Existing CV */}
                        {userProfile.current_cv && (
                            <div className="bg-green-50 p-3 rounded-lg flex justify-between items-center text-sm text-green-700">
                                <span>Using current CV: {userProfile.current_cv.split('/').pop()}</span>
                                <a href={userProfile.current_cv} target="_blank" rel="noopener noreferrer" className="font-semibold underline">View</a>
                            </div>
                        )}
                        
                        <button 
                            type="submit" 
                            disabled={isApply} 
                            className="w-full flex justify-center items-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition disabled:bg-indigo-300"
                        >
                            {isApply ? <LoaderIcon className="w-5 h-5 animate-spin"/> : <CheckCircle className="w-5 h-5"/>}
                            {isApply ? "Submitting Application...." : "Submit Application"}
                        </button>
                    </form>
                </Modal>
            )}

            {/* Report Job Modal (Simplified) */}
            {showReportModal && (
                <Modal onClose={() => setShowReportModal(false)} title="Report Job">
                    <p className="text-lg text-gray-700 mb-6">Are you sure you want to report this job for inappropriate or false content?</p>
                    {/* Placeholder for actual reporting form */}
                    <button 
                        onClick={() => { toast.success("Job reported successfully (Placeholder)"); setShowReportModal(false); }}
                        className="w-full px-4 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
                    >
                        Confirm Report
                    </button>
                </Modal>
            )}

        </div>
    );
}

// --- Generic Modal Component for Reusability ---
const Modal = ({ children, title, onClose }) => (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-[9999] p-4 transition-opacity duration-300">
        <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl relative animate-in fade-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
                    <X className="w-6 h-6" />
                </button>
            </div>
            <div className="p-6">
                {children}
            </div>
        </div>
    </div>
);




///////////////////////////////



{/* 
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">

             {/* --- HEADER & ACTIONS --- */}
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
                            <div className="flex items-center gap-4">
                                <h1 className="text-4xl font-extrabold text-gray-900">{job.title}</h1>
                            </div>
                            
                            <div className="flex items-center space-x-4">
                                {/* Save Button */}
                                <button
                                    onClick={handleSave}
                                    disabled={saveLoading}
                                    className="p-3 rounded-full bg-white border border-gray-300 shadow-sm hover:bg-gray-100 transition"
                                >
                                    {saveLoading ? (
                                        <LoaderIcon className="w-6 h-6 animate-spin text-indigo-600" />
                                    ) : (
                                        <Heart className={`w-6 h-6 transition-all ${saved ? "fill-red-500 text-red-500 scale-110" : "text-gray-400 hover:text-red-500"}`} />
                                    )}
                                </button>
                                
                                {/* Report Button */}
                                <button 
                                    onClick={()=> isAuthenticated ? setShowReportJobModel(true) : setShowLoginModal(true) }
                                    className="flex items-center space-x-2 px-4 py-3 bg-white border border-gray-300 text-red-600 rounded-xl shadow-sm hover:bg-red-50 transition font-medium"
                                >
                                    <Flag className="w-5 h-5" />
                                    <span>Report Job</span>
                                </button>
                            </div>
                        </div>



        {/* Job Information Section */}
        <div className="p-6 space-y-8">
          {job.post_type === "COMPANY" && (
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Company Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-medium">{job.company_name}</h3>
                  <p className="text-gray-600">Employees: {job.company_employees_size}</p>
                  <p className="text-gray-600"><MapPinIcon/>: {job.company_address}</p>
                  {job.company_website && (
                    <div>
                        <Globe/>
                        <a href={job.company_website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          Visit Website
                        </a>
                     </div>
                  )}
                </div>
                {job.company_logo ? (
                  <img src={job.company_logo} alt={`${job.company_name} logo`} className="w-32 h-32 object-contain rounded" />
                ): (
                  <Building2 className="w-10 h-10 text-gray-500" />

                )}
              </div>
            </section>
          )}

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Job Information</h2>
            <div className="space-y-2 text-gray-700">
              <p><strong>Posted By:</strong> {job.post_type === "COMPANY" ? "Company" : "Individual"}</p>
              {job.post_type === "COMPANY" && <p><strong>Job Type:</strong> {job.job_type_display}</p>}
              <p><strong>Education Level:</strong> {job.education_level_display}</p>
              <p><strong>Experience Level:</strong> {job.experience_level_display || "Any level"}</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Job Requirements</h2>
            <div className="space-y-2 text-gray-700">
              <p><strong>Gender:</strong> {job.gender_display}</p>
              <p><strong>Positions Needed:</strong> {job.positions_needed}</p>
              <p><strong>Apply Before:</strong> {new Date(job.deadline).toLocaleDateString()}</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Salary</h2>
            <p className="text-gray-700">
              <strong>Range:</strong> {job.currency} {job.salary_min} - {job.salary_max} <span className="text-sm">({job.payment_period_display})</span>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Job Location</h2>
            <div className="space-y-2 text-gray-700">
              <p><strong>Region:</strong> {job.region_name}</p>
              <p><strong>District:</strong> {job.district_name}</p>
              <p><strong>Ward:</strong> {job.ward_name}</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Job Summary</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{job.job_summary}</p>
            {job.post_type === "COMPANY" && (
              <>
                <h3 className="text-xl font-medium mt-4 mb-2">Duties</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{job.duties}</p>
                <h3 className="text-xl font-medium mt-4 mb-2">Skills Required</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{job.skills_required}</p>
              </>
            )}
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Application Methods</h2>
            <p className="text-gray-600 mb-4">Select your preferred method to apply:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {job.apply_email && (
                <button
                  onClick={() => { handleApplyButton("EMAIL")}}
                  className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                >
                  Apply via Email
                </button>
              )}
              {job.apply_website && (
                <button
                  onClick={() => { handleApplyButton("WEBSITE") }}
                  className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
                ><Globe/>
                  Apply via company Website
                </button>
              )}
              {job.apply_in_app && (
                <button
                  onClick={() => { handleApplyButton("IN_PLATFORM") }}
                  className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition"
                >
                  Apply in this platform (Recommended)
                </button>
              )}
              {job.apply_whatsapp && (
                <button
                  onClick={() => { handleApplyButton("WHATSAPP")}}
                  className="bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-700 transition"
                >
                  Apply via WhatsApp
                </button>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">Login Required</h2>
            <p className="text-gray-600 mb-4">To access this feature, please login or create an account.</p>
            <div className="flex flex-col gap-2">
              <Link to="/user-login" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 text-center">
                Login Now
              </Link>
              <Link to="/account-type" className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 text-center">
                Create Account
              </Link>
              <button onClick={() => setShowLoginModal(false)} className="bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full overflow-y-auto max-h-[80vh]">
            <h2 className="text-xl font-bold mb-4">Are you sure you want to apply {job.title}</h2>
            <div className="mb-4 text-gray-700">
                <h2>Confirm your informations</h2>
              <p><strong className="text-gray-500 font-extrabold">Full Name</strong> {userProfile.full_name || "-"}</p>
              <p><strong>Job Title:</strong> {userProfile.job_title || "-"}</p>
              <p><strong>Email:</strong> {userProfile.email}</p>
              <p><strong>Phone:</strong> {userProfile.phone_number || "-"}</p>
            </div>
            <form onSubmit={handleJobApplication} className="space-y-4">
              {applyMethod === "IN_PLATFORM" && (
                <div>
                  <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700">Cover Letter (Required)</label>
                  {coverLetterError && <p className="text-red-500">{coverLetterError}</p>}
                  <textarea
                    id="coverLetter"
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Why are you applying for this job?"
                    className="w-full p-2 border border-gray-300 rounded mt-1"
                    rows={4}
                    required
                  />
                </div>
              )}

              {job.post_type === "COMPANY" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">CV (Required)</label>
                  {userProfile.current_cv ? (
                    <div className="mt-1">
                      <p className="text-gray-600"> Using current CV: {userProfile.current_cv.split('/').pop()}</p>
                      <a href={userProfile.current_cv} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        View / Download
                      </a>
                      <p className="text-sm text-gray-500 mt-2">Upload a new CV (optional):</p>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setCv(e.target.files[0])}
                        className="mt-1"
                      />
                    </div>
                  ) : (
                    <div className="mt-1">
                      {cvError && <p className="text-red-500">{cvError}</p>}
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setCv(e.target.files[0])}
                        required
                        className="w-full"
                      />
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isApplying}
                  className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 disabled:opacity-50"
                >
                  {isApplying ? "Applying..." : "Apply Now"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div>
  {showReportJobModel && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Report Job: {job.title}</h2>
      <form onSubmit={handleReportJob} className="space-y-4">
        <div>
          <label className="block font-medium">Reason <span className="text-red-500">*</span></label>
          {reasonError && <p className="text-red-500 text-sm">{reasonError}</p>}
          <select 
            value={reason} 
            onChange={(e) => setReason(e.target.value)}
            className="w-full p-2 border rounded mt-1"
            required
          >
            <option value="">-- Select reason --</option>
            <option value="FAKE">Fake Job</option>
            <option value="SPAM">Spam</option>
            <option value="INAPPROPRIATE">Inappropriate Content</option>
            <option value="EXPIRED">Job Expired</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <div>
          <label className="block font-medium">Description <span className="text-red-500">*</span></label>
          {descriptionError && <p className="text-red-500 text-sm">{descriptionError}</p>}
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Please explain why you're reporting this job..."
            className="w-full p-2 border rounded mt-1"
            rows={4}
            required
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={() => {
              setShowReportJobModel(false);
              setReason("");
              setDescription("");
              setReasonError("");
              setDescriptionError("");
            }}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isReport}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          >
            {isReport ? "Reporting..." : "Report Job"}
          </button>
        </div>
      </form>
    </div>
  </div>
)}
      </div>
    </div>
  );
}
''.   */}











///////////////////RETURNS ==============

<div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
    {/* Main Container */}
    <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Job Card */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        
        {/* Hero Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white px-6 py-10 sm:px-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{job.title}</h1>
              <div className="flex items-center gap-4 mt-4 text-indigo-100">
                {job.post_type === "COMPANY" ? (
                  <>
                    <Building2 className="w-5 h-5" />
                    <span className="font-medium">{job.company_name}</span>
                  </>
                ) : (
                  <>
                    <Users className="w-5 h-5" />
                    <span>Individual Employer</span>
                  </>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleSave}
                disabled={saveLoading}
                className="p-4 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all duration-200"
              >
                {saveLoading ? (
                  <LoaderIcon className="w-6 h-6 animate-spin text-white" />
                ) : (
                  <Heart className={`w-6 h-6 transition-all ${saved ? "fill-white text-white scale-110" : "text-white/80"}`} />
                )}
              </button>

              <button
                onClick={() => isAuthenticated ? setShowReportJobModel(true) : setShowLoginModal(true)}
                className="flex items-center gap-2 px-5 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl hover:bg-white/30 transition-all font-medium"
              >
                <Flag className="w-5 h-5" />
                <span>Report</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 lg:p-10 space-y-10">

          {/* Company Info Card */}
          {job.post_type === "COMPANY" && (
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <Building2 className="w-7 h-7 text-indigo-600" />
                Company Information
              </h2>
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-gray-900">{job.company_name}</h3>
                  <div className="space-y-3 text-gray-700">
                    <p className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-indigo-600" />
                      {job.company_employees_size}
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-indigo-600" />
                      {job.company_address}
                    </p>
                    {job.company_website && (
                      <a href={job.company_website} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium">
                        <Globe className="w-5 h-5" />
                        Visit Website <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex justify-center">
                  {job.company_logo ? (
                    <img src={job.company_logo} alt={job.company_name} className="w-40 h-40 object-contain rounded-2xl shadow-lg" />
                  ) : (
                    <div className="w-40 h-40 bg-gray-200 border-2 border-dashed border-gray-400 rounded-2xl flex items-center justify-center">
                      <Building2 className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
              <div className="flex items-center gap-3 text-gray-600">
                <Briefcase className="w-6 h-6 text-indigo-600" />
                <span className="font-medium">Job Type</span>
              </div>
              <p className="mt-2 text-lg font-semibold text-gray-900">
                {job.post_type === "COMPANY" ? job.job_type_display : "Full-time"}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
              <div className="flex items-center gap-3 text-gray-600">
                <DollarSign className="w-6 h-6 text-green-600" />
                <span className="font-medium">Salary Range</span>
              </div>
              <p className="mt-2 text-lg font-bold text-green-700">
                {job.currency} {job.salary_min.toLocaleString()} - {job.salary_max.toLocaleString()}
                <span className="block text-sm font-normal text-gray-600">per {job.payment_period_display}</span>
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
              <div className="flex items-center gap-3 text-gray-600">
                <Calendar className="w-6 h-6 text-purple-600" />
                <span className="font-medium">Apply Before</span>
              </div>
              <p className="mt-2 text-lg font-semibold text-gray-900">
                {new Date(job.deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Details Sections */}
          <div className="space-y-8">
            {/* Job Details */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Job Details</h3>
              <div className="grid sm:grid-cols-2 gap-5 text-gray-700">
                <p><span className="font-medium">Education:</span> {job.education_level_display}</p>
                <p><span className="font-medium">Experience:</span> {job.experience_level_display || "Any level"}</p>
                <p><span className="font-medium">Gender:</span> {job.gender_display}</p>
                <p><span className="font-medium">Positions:</span> {job.positions_needed}</p>
              </div>
            </div>

            {/* Location */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-red-600" />
                Location
              </h3>
              <div className="space-y-2 text-gray-700">
                <p><strong>Region:</strong> {job.region_name}</p>
                <p><strong>District:</strong> {job.district_name}</p>
                <p><strong>Ward:</strong> {job.ward_name}</p>
              </div>
            </div>

            {/* Description & Duties */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Job Summary</h3>
                <div className="bg-gray-50 rounded-xl p-6 prose prose-lg max-w-none text-gray-700 whitespace-pre-wrap">
                  {job.job_summary}
                </div>
              </div>

              {job.post_type === "COMPANY" && (
                <>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Key Responsibilities</h3>
                    <div className="bg-blue-50 rounded-xl p-6 prose prose-lg max-w-none text-gray-700 whitespace-pre-wrap">
                      {job.duties}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Required Skills</h3>
                    <div className="bg-purple-50 rounded-xl p-6 prose prose-lg max-w-none text-gray-700 whitespace-pre-wrap">
                      {job.skills_required}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Apply Buttons - Sticky on Mobile */}
          <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 -mx-6 sm:-mx-10 -mb-10 p-6 sm:p-8 mt-10">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-800 mb-5">Apply for this Job</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {job.apply_in_app && (
                  <button
                    onClick={() => handleApplyButton("IN_PLATFORM")}
                    className="group flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-4 px-6 rounded-xl hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  >
                    <CheckCircle className="w-6 h-6" />
                    Apply on Platform (Recommended)
                  </button>
                )}
                {job.apply_email && (
                  <button onClick={() => handleApplyButton("EMAIL")} className="flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold py-4 px-6 rounded-xl hover:shadow-xl transform hover:scale-105 transition-all">
                    <Mail className="w-6 h-6" />
                    Apply via Email
                  </button>
                )}
                {job.apply_whatsapp && (
                  <button onClick={() => handleApplyButton("WHATSAPP")} className="flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-4 px-6 rounded-xl hover:shadow-xl transform hover:scale-105 transition-all">
                    <Phone className="w-6 h-6" />
                    WhatsApp
                  </button>
                )}
                {job.apply_website && (
                  <button onClick={() => handleApplyButton("WEBSITE")} className="flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 px-6 rounded-xl hover:shadow-xl transform hover:scale-105 transition-all">
                    <Link2 className="w-6 h-6" />
                    Company Website
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


     {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full overflow-y-auto max-h-[80vh]">
            <h2 className="text-xl font-bold mb-4">Are you sure you want to apply {job.title}</h2>
            <div className="mb-4 text-gray-700">
                <h2>Confirm your informations</h2>
              <p><strong className="text-gray-500 font-extrabold">Full Name</strong> {userProfile.full_name || "-"}</p>
              <p><strong>Job Title:</strong> {userProfile.job_title || "-"}</p>
              <p><strong>Email:</strong> {userProfile.email}</p>
              <p><strong>Phone:</strong> {userProfile.phone_number || "-"}</p>
            </div>
            <form onSubmit={handleJobApplication} className="space-y-4">
              {applyMethod === "IN_PLATFORM" && (
                <div>
                  <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700">Cover Letter (Required)</label>
                  {coverLetterError && <p className="text-red-500">{coverLetterError}</p>}
                  <textarea
                    id="coverLetter"
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Why are you applying for this job?"
                    className="w-full p-2 border border-gray-300 rounded mt-1"
                    rows={4}
                    required
                  />
                </div>
              )}

              {job.post_type === "COMPANY" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">CV (Required)</label>
                  {userProfile.current_cv ? (
                    <div className="mt-1">
                      <p className="text-gray-600"> Using current CV: {userProfile.current_cv.split('/').pop()}</p>
                      <a href={userProfile.current_cv} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        View / Download
                      </a>
                      <p className="text-sm text-gray-500 mt-2">Upload a new CV (optional):</p>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setCv(e.target.files[0])}
                        className="mt-1"
                      />
                    </div>
                  ) : (
                    <div className="mt-1">
                      {cvError && <p className="text-red-500">{cvError}</p>}
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setCv(e.target.files[0])}
                        required
                        className="w-full"
                      />
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isApplying}
                  className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 disabled:opacity-50"
                >
                  {isApplying ? "Applying..." : "Apply Now"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div>
  {showReportJobModel && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Report Job: {job.title}</h2>
      <form onSubmit={handleReportJob} className="space-y-4">
        <div>
          <label className="block font-medium">Reason <span className="text-red-500">*</span></label>
          {reasonError && <p className="text-red-500 text-sm">{reasonError}</p>}
          <select 
            value={reason} 
            onChange={(e) => setReason(e.target.value)}
            className="w-full p-2 border rounded mt-1"
            required
          >
            <option value="">-- Select reason --</option>
            <option value="FAKE">Fake Job</option>
            <option value="SPAM">Spam</option>
            <option value="INAPPROPRIATE">Inappropriate Content</option>
            <option value="EXPIRED">Job Expired</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <div>
          <label className="block font-medium">Description <span className="text-red-500">*</span></label>
          {descriptionError && <p className="text-red-500 text-sm">{descriptionError}</p>}
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Please explain why you're reporting this job..."
            className="w-full p-2 border rounded mt-1"
            rows={4}
            required
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={() => {
              setShowReportJobModel(false);
              setReason("");
              setDescription("");
              setReasonError("");
              setDescriptionError("");
            }}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isReport}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          >
            {isReport ? "Reporting..." : "Report Job"}
          </button>
        </div>
      </form>
    </div>
  </div>
)}




    {/* Modals remain the same (Login, Apply, Report) - already perfect */}
    {/* Just make sure to style them consistently with rounded-xl, better inputs, etc. if needed */}
  </div>
);





{/* 
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">

             {/* --- HEADER & ACTIONS --- */}
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
                            <div className="flex items-center gap-4">
                                <h1 className="text-4xl font-extrabold text-gray-900">{job.title}</h1>
                            </div>
                            
                            <div className="flex items-center space-x-4">
                                {/* Save Button */}
                                <button
                                    onClick={handleSave}
                                    disabled={saveLoading}
                                    className="p-3 rounded-full bg-white border border-gray-300 shadow-sm hover:bg-gray-100 transition"
                                >
                                    {saveLoading ? (
                                        <LoaderIcon className="w-6 h-6 animate-spin text-indigo-600" />
                                    ) : (
                                        <Heart className={`w-6 h-6 transition-all ${saved ? "fill-red-500 text-red-500 scale-110" : "text-gray-400 hover:text-red-500"}`} />
                                    )}
                                </button>
                                
                                {/* Report Button */}
                                <button 
                                    onClick={()=> isAuthenticated ? setShowReportJobModel(true) : setShowLoginModal(true) }
                                    className="flex items-center space-x-2 px-4 py-3 bg-white border border-gray-300 text-red-600 rounded-xl shadow-sm hover:bg-red-50 transition font-medium"
                                >
                                    <Flag className="w-5 h-5" />
                                    <span>Report Job</span>
                                </button>
                            </div>
                        </div>



        {/* Job Information Section */}
        <div className="p-6 space-y-8">
          {job.post_type === "COMPANY" && (
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Company Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-medium">{job.company_name}</h3>
                  <p className="text-gray-600">Employees: {job.company_employees_size}</p>
                  <p className="text-gray-600"><MapPinIcon/>: {job.company_address}</p>
                  {job.company_website && (
                    <div>
                        <Globe/>
                        <a href={job.company_website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          Visit Website
                        </a>
                     </div>
                  )}
                </div>
                {job.company_logo ? (
                  <img src={job.company_logo} alt={`${job.company_name} logo`} className="w-32 h-32 object-contain rounded" />
                ): (
                  <Building2 className="w-10 h-10 text-gray-500" />

                )}
              </div>
            </section>
          )}

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Job Information</h2>
            <div className="space-y-2 text-gray-700">
              <p><strong>Posted By:</strong> {job.post_type === "COMPANY" ? "Company" : "Individual"}</p>
              {job.post_type === "COMPANY" && <p><strong>Job Type:</strong> {job.job_type_display}</p>}
              <p><strong>Education Level:</strong> {job.education_level_display}</p>
              <p><strong>Experience Level:</strong> {job.experience_level_display || "Any level"}</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Job Requirements</h2>
            <div className="space-y-2 text-gray-700">
              <p><strong>Gender:</strong> {job.gender_display}</p>
              <p><strong>Positions Needed:</strong> {job.positions_needed}</p>
              <p><strong>Apply Before:</strong> {new Date(job.deadline).toLocaleDateString()}</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Salary</h2>
            <p className="text-gray-700">
              <strong>Range:</strong> {job.currency} {job.salary_min} - {job.salary_max} <span className="text-sm">({job.payment_period_display})</span>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Job Location</h2>
            <div className="space-y-2 text-gray-700">
              <p><strong>Region:</strong> {job.region_name}</p>
              <p><strong>District:</strong> {job.district_name}</p>
              <p><strong>Ward:</strong> {job.ward_name}</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Job Summary</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{job.job_summary}</p>
            {job.post_type === "COMPANY" && (
              <>
                <h3 className="text-xl font-medium mt-4 mb-2">Duties</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{job.duties}</p>
                <h3 className="text-xl font-medium mt-4 mb-2">Skills Required</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{job.skills_required}</p>
              </>
            )}
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Application Methods</h2>
            <p className="text-gray-600 mb-4">Select your preferred method to apply:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {job.apply_email && (
                <button
                  onClick={() => { handleApplyButton("EMAIL")}}
                  className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                >
                  Apply via Email
                </button>
              )}
              {job.apply_website && (
                <button
                  onClick={() => { handleApplyButton("WEBSITE") }}
                  className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
                ><Globe/>
                  Apply via company Website
                </button>
              )}
              {job.apply_in_app && (
                <button
                  onClick={() => { handleApplyButton("IN_PLATFORM") }}
                  className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition"
                >
                  Apply in this platform (Recommended)
                </button>
              )}
              {job.apply_whatsapp && (
                <button
                  onClick={() => { handleApplyButton("WHATSAPP")}}
                  className="bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-700 transition"
                >
                  Apply via WhatsApp
                </button>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">Login Required</h2>
            <p className="text-gray-600 mb-4">To access this feature, please login or create an account.</p>
            <div className="flex flex-col gap-2">
              <Link to="/user-login" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 text-center">
                Login Now
              </Link>
              <Link to="/account-type" className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 text-center">
                Create Account
              </Link>
              <button onClick={() => setShowLoginModal(false)} className="bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full overflow-y-auto max-h-[80vh]">
            <h2 className="text-xl font-bold mb-4">Are you sure you want to apply {job.title}</h2>
            <div className="mb-4 text-gray-700">
                <h2>Confirm your informations</h2>
              <p><strong className="text-gray-500 font-extrabold">Full Name</strong> {userProfile.full_name || "-"}</p>
              <p><strong>Job Title:</strong> {userProfile.job_title || "-"}</p>
              <p><strong>Email:</strong> {userProfile.email}</p>
              <p><strong>Phone:</strong> {userProfile.phone_number || "-"}</p>
            </div>
            <form onSubmit={handleJobApplication} className="space-y-4">
              {applyMethod === "IN_PLATFORM" && (
                <div>
                  <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700">Cover Letter (Required)</label>
                  {coverLetterError && <p className="text-red-500">{coverLetterError}</p>}
                  <textarea
                    id="coverLetter"
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Why are you applying for this job?"
                    className="w-full p-2 border border-gray-300 rounded mt-1"
                    rows={4}
                    required
                  />
                </div>
              )}

              {job.post_type === "COMPANY" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">CV (Required)</label>
                  {userProfile.current_cv ? (
                    <div className="mt-1">
                      <p className="text-gray-600"> Using current CV: {userProfile.current_cv.split('/').pop()}</p>
                      <a href={userProfile.current_cv} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        View / Download
                      </a>
                      <p className="text-sm text-gray-500 mt-2">Upload a new CV (optional):</p>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setCv(e.target.files[0])}
                        className="mt-1"
                      />
                    </div>
                  ) : (
                    <div className="mt-1">
                      {cvError && <p className="text-red-500">{cvError}</p>}
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setCv(e.target.files[0])}
                        required
                        className="w-full"
                      />
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isApplying}
                  className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 disabled:opacity-50"
                >
                  {isApplying ? "Applying..." : "Apply Now"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div>
  {showReportJobModel && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Report Job: {job.title}</h2>
      <form onSubmit={handleReportJob} className="space-y-4">
        <div>
          <label className="block font-medium">Reason <span className="text-red-500">*</span></label>
          {reasonError && <p className="text-red-500 text-sm">{reasonError}</p>}
          <select 
            value={reason} 
            onChange={(e) => setReason(e.target.value)}
            className="w-full p-2 border rounded mt-1"
            required
          >
            <option value="">-- Select reason --</option>
            <option value="FAKE">Fake Job</option>
            <option value="SPAM">Spam</option>
            <option value="INAPPROPRIATE">Inappropriate Content</option>
            <option value="EXPIRED">Job Expired</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <div>
          <label className="block font-medium">Description <span className="text-red-500">*</span></label>
          {descriptionError && <p className="text-red-500 text-sm">{descriptionError}</p>}
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Please explain why you're reporting this job..."
            className="w-full p-2 border rounded mt-1"
            rows={4}
            required
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={() => {
              setShowReportJobModel(false);
              setReason("");
              setDescription("");
              setReasonError("");
              setDescriptionError("");
            }}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isReport}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          >
            {isReport ? "Reporting..." : "Report Job"}
          </button>
        </div>
      </form>
    </div>
  </div>
)}
      </div>
    </div>
  );
}
''.   */}







\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\




 {showLoginModal && (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6">
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl p-6 sm:p-8 max-w-sm w-full animate-fadeInUp relative">
      
      {/* Close Button */}
      <button 
        onClick={() => setShowLoginModal(false)} 
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
        aria-label="Close Login Modal"
      >
        <X className="w-5 h-5" /> {/* Placeholder: Import X icon */}
      </button>

      {/* Header */}
      <h2 className="text-2xl font-extrabold text-gray-900 mb-2 border-b pb-2">👋 Login Required</h2>
      <p className="text-gray-600 mb-6 text-sm">To access this feature, please log in or create an account.</p>
      
      {/* Action Buttons */}
      <div className="space-y-4">
        {/* Primary Action */}
        <Link 
          to="/user-login" 
          className="w-full flex items-center justify-center gap-3 bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-indigo-700 transition-all active:scale-95"
        >
          <Mail className="w-5 h-5" />
          Login to Continue
        </Link>
        
        {/* Secondary Action */}
        <Link 
          to="/account-type" 
          className="w-full flex items-center justify-center gap-3 bg-emerald-500 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-emerald-600 transition-all active:scale-95"
        >
          <CheckCircle className="w-5 h-5" />
          Create New Account
        </Link>
        
        {/* Cancel Button - Tertiary Action */}
        <button 
          onClick={() => setShowLoginModal(false)} 
          className="w-full bg-white border border-gray-300 text-gray-700 font-medium py-3 px-6 rounded-lg hover:bg-gray-50 transition-all mt-2"
        >
          Not Right Now
        </button>
      </div>
    </div>
  </div>
)}




{showApplyModal && (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl p-6 sm:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto animate-fadeInUp relative">
      
      {/* Close Button */}
      <button 
        type="button"
        onClick={() => {
          setShowApplyModal(false);
          // Reset state here
        }}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
        aria-label="Close Application Modal"
      >
        <X className="w-6 h-6" /> {/* Placeholder: Import X icon */}
      </button>

      {/* Header */}
      <h2 className="text-3xl font-extrabold text-gray-900 mb-2 flex items-center gap-3">
        <Briefcase className="w-8 h-8 text-indigo-600" />
        Apply for <span className="text-indigo-600 truncate max-w-xs sm:max-w-md">{job.title}</span>
      </h2>
      <p className="text-sm text-gray-500 mb-6">Review your information before submitting your application.</p>
      
      {/* Profile Confirmation Card */}
      <div className="bg-indigo-50/50 border border-indigo-200 rounded-xl p-5 mb-8">
        <h3 className="font-bold text-lg text-gray-800 mb-3 border-b border-indigo-200 pb-2">✅ Your Profile Details</h3>
        <div className="grid sm:grid-cols-2 gap-y-3 gap-x-4 text-sm text-gray-700">
          <p className="flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <strong className="font-semibold">Name:</strong> {userProfile.full_name || "N/A"}
          </p>
          <p className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-indigo-600" />
            <strong className="font-semibold">Email:</strong> {userProfile.email || "N/A"}
          </p>
          <p className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-600" />
            <strong className="font-semibold">Current Role:</strong> {userProfile.job_title || "N/A"}
          </p>
          <p className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-indigo-600" />
            <strong className="font-semibold">Phone:</strong> {userProfile.phone_number || "N/A"}
          </p>
        </div>
      </div>

      <form onSubmit={handleJobApplication} className="space-y-8">
        
        {/* Cover Letter Section */}
        {applyMethod === "IN_PLATFORM" && (
          <div>
            <label htmlFor="coverLetter" className="block text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              Cover Letter (Required)
            </label>
            {coverLetterError && <p className="text-red-500 text-sm mb-2 flex items-center gap-1"><AlertCircle className="w-4 h-4" /> {coverLetterError}</p>}
            <textarea
              id="coverLetter"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Why are you the perfect fit for this role? Highlight your skills and enthusiasm..."
              className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none"
              rows={6}
              required
            />
          </div>
        )}

        {/* CV/Resume Section */}
        {job.post_type === "COMPANY" && (
          <div>
            <label className="block text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              CV / Resume (Required)
            </label>
            
            {userProfile.current_cv ? (
              <div className="space-y-4">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex justify-between items-center">
                  <p className="text-sm text-gray-700 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    **Current CV:** {userProfile.current_cv.split('/').pop()}
                  </p>
                  <a 
                    href={userProfile.current_cv} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-indigo-600 hover:text-indigo-800 font-medium text-sm transition-colors flex items-center gap-1"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View
                  </a>
                </div>
                
                <p className="text-sm text-gray-500">To use a different CV, upload a new one below (optional):</p>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setCv(e.target.files[0])}
                  className="w-full file:mr-4 file:py-3 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200 transition-all cursor-pointer border border-gray-300 rounded-lg p-2"
                />
              </div>
            ) : (
              <div>
                {cvError && <p className="text-red-500 text-sm mb-2 flex items-center gap-1"><AlertCircle className="w-4 h-4" /> {cvError}</p>}
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setCv(e.target.files[0])}
                  required
                  className="w-full file:mr-4 file:py-3 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200 transition-all cursor-pointer border border-gray-300 rounded-lg p-2"
                />
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={() => {
              setShowApplyModal(false);
              // Reset state here
            }}
            className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isApplying}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isApplying ? <LoaderIcon className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />} {/* Placeholder: Import Send icon */}
            {isApplying ? "Submitting..." : "Submit Application"}
          </button>
        </div>
      </form>
    </div>
  </div>
)}




{showReportJobModel && (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6">
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full animate-fadeInUp relative">
      
      {/* Close Button */}
      <button 
        type="button"
        onClick={() => {
          setShowReportJobModel(false);
          // Reset state here
        }} 
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
        aria-label="Close Report Modal"
      >
        <X className="w-6 h-6" /> {/* Placeholder: Import X icon */}
      </button>

      {/* Header */}
      <h2 className="text-2xl font-extrabold text-gray-900 mb-2 flex items-center gap-3 border-b pb-2">
        <Flag className="w-7 h-7 text-red-600" />
        Report Job
      </h2>
      <p className="text-sm text-gray-500 mb-6">You are reporting: **{job.title}**</p>
      
      <form onSubmit={handleReportJob} className="space-y-6">
        
        {/* Reason Select */}
        <div>
          <label className="block text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            Reason for Report (Required)
          </label>
          {reasonError && <p className="text-red-500 text-sm mb-2 flex items-center gap-1"><AlertCircle className="w-4 h-4" /> {reasonError}</p>}
          <select 
            value={reason} 
            onChange={(e) => setReason(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all bg-white appearance-none"
            required
          >
            <option value="" disabled>-- Select a reason --</option>
            <option value="FAKE">Fake Job Posting</option>
            <option value="SPAM">Spam or Scam</option>
            <option value="INAPPROPRIATE">Inappropriate Content</option>
            <option value="EXPIRED">Job is Expired</option>
            <option value="OTHER">Other Issue</option>
          </select>
        </div>

        {/* Description Textarea */}
        <div>
          <label className="block text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-red-600" />
            Detailed Description (Required)
          </label>
          {descriptionError && <p className="text-red-500 text-sm mb-2 flex items-center gap-1"><AlertCircle className="w-4 h-4" /> {descriptionError}</p>}
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Please provide details about why you're reporting this job. Be specific to help us investigate..."
            className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all resize-none"
            rows={5}
            required
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={() => {
              setShowReportJobModel(false);
              // Reset state here
            }}
            className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isReport}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isReport ? <LoaderIcon className="w-5 h-5 animate-spin" /> : <Flag className="w-5 h-5" />}
            {isReport ? "Reporting..." : "Submit Report"}
          </button>
        </div>
      </form>
    </div>
  </div>
)}
