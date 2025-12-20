import { useParams, Link } from "react-router-dom";
import api from "../AxiosApi/Api";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Heart, Flag, MapPin, Globe, Building2, Users, Briefcase,
  Calendar, DollarSign, Clock, Mail, Phone, Link2, AlertCircle,
  CheckCircle, Loader2 as LoaderIcon, ExternalLink, FileText,
  Loader, X , Send, Loader2, User, UserCheck, BadgeInfo, AlertTriangle, UserPlus
} from 'lucide-react';  
import { AuthContext } from "../AxiosApi/AuthPages";
import FullScreenLoader from "../Components/Loader";

export default function JobDetailsPage() {

  const backendURL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000"; 

  const [job, setJob] = useState({});
  const [loading, setLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showReportJobModel, setShowReportJobModel] = useState(false);

  const [userProfile, setUserProfile] = useState({});

  // APPLY ----------------JOB----------
  const [applyMethod, setApplyMethod] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [cv, setCv] = useState(null);
  const [coverLetterError, setCoverLetterError] = useState("")
  const [cvError, setCvError] = useState("")
  const [isReport, setIsReport] = useState(false);


  // -----------REPORT A JOB ----------
  const [description, setDescription] = useState("")
  const [reason, setReason] = useState("")
  const [descriptionError, setDescriptionError] = useState("");
  const [reasonError, setReasonError] = useState("");



  const { isAuthenticated, userRole } = useContext(AuthContext);
  const { JobSlug } = useParams();

  const [saved, setSaved] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  // Base script template
  const scriptTemplate = `
Hello,

I am interested in this job  "${job.title || ''}".

Applicant Details:-
Full Name:  ${userProfile.full_name || ''}
Profession:  ${userProfile.job_title || ''}
Phone Number:   ${userProfile.phone_number || ''}


You can view my complete profile and application details using the link below:
 {{application_url}}


 Thank you for your time and consideration.
  `;


  // Fetch user profile
  const fetchProfile = async () => {
    try {
      const resp = await api.get("jobs/details/user/jobseeker/user-data/");
      setUserProfile(resp.data);
    } catch (err) {
      setUserProfile({});
    }
  };

  useEffect(() => {
    if (isAuthenticated && userRole === "WORKER") {
      fetchProfile();
    }
  }, [isAuthenticated, userRole]);

  // Handle save/unsave job
  const handleSave = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    if(!isAuthenticated){
      setShowLoginModal(true);
      return;
    }

    setSaveLoading(true); 
    try {
      const { data } = await api.post("jobs/details/user/save-unsave/job/", { job_slug: job.slug });
      toast.success(data.message);
      setSaved(data.saved);
    } catch (err) {
       
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
      setSaveLoading(false);
    }
  };

  // Fetch job details
  const fetchJobDetails = async () => {
    try {
      const resp = await api.get(`jobs/users/retrieve/job/${JobSlug}`);
      setJob(resp.data);
      setSaved(resp.data.is_job_saved || false);
    } catch (err) {
      toast.error("Failed to fetch job details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobDetails();
  }, [JobSlug]);

  // HANDLE APPLY BUTTON ===========

  const handleApplyButton = (method)=>{
    if (isAuthenticated === false){
      setShowLoginModal(true);
      return;
    }
    if (userRole !== "WORKER"){
      toast.error("Only job seeker can apply for jobs!");
      return;
    }
    setApplyMethod(method);
    console.log(method)
    setShowApplyModal(true);
  }

  // Handle job application
  const handleJobApplication = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setShowLoginModal(true);
      setShowApplyModal(false);
      return;
    }
    if (userRole !== "WORKER") {
      toast.error("Only job seekers can apply for jobs!");
      return;
    }


    if (applyMethod === "IN_PLATFORM" && coverLetter.trim().length < 20) {
      setCoverLetterError("Cover letter must be at least 20 characters!");
      return;
    }
    if (job.post_type === "COMPANY" && userProfile.current_cv === null && cv===null) {
      setCvError("CV is required for this job!")
      return;
    }

    try {
      setIsApplying(true);
      const formData = new FormData();
      formData.append("job_slug", JobSlug);
      formData.append("application_method", applyMethod);
      formData.append("cover_letter", coverLetter);
      if (cv) {
        formData.append("cv", cv);
      }

      const resp = await api.post('jobs/details/user/applications-apply/jobs/', formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (resp.status === 201) {
        toast.success(resp.data.message);
        const applicationUrl = resp.data.application_url 
        const script = scriptTemplate.replace('{{application_url}}', applicationUrl);

        if (applyMethod === "WHATSAPP") {
          const url = `https://wa.me/${job.apply_whatsapp}?text=${encodeURIComponent(script)}`;
          window.open(url, "_blank");
        } else if (applyMethod === "EMAIL") {
          const subject = `Job Application for ${job.title}`;
          const url = `mailto:${job.apply_email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(script)}`;
          window.location.href = url;
        } else if (applyMethod === "WEBSITE") {
          window.open(job.apply_website, "_blank");
        }

        setShowApplyModal(false);
        setApplyMethod("");
        setCoverLetter("");
        setCv(null);
      }
    } catch (err) {
      if (err.response) {
        const data = err.response.data;
        if (data.detail) {
          toast.error(data.detail);
        } else if (typeof data === 'object') {
          Object.entries(data).forEach(([key, value]) => {
            const message = Array.isArray(value) ? value.join(", ") : value;
            toast.error(message);
          });
        } else {
          toast.error("Unexpected error occurred. Please try again later.");
        }
      } else {
        toast.error("Network error!");
      }
    } finally {
      setIsApplying(false);
    }
  };


  // HANDLE ----------REPORT ------------JOB======
  const handleReportJob = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    setShowReportJobModel(true);

    if (description === ""){
      setDescriptionError("Descriptions is required")
      return;
    }
    else if (description.trim().length < 20){
      setDescriptionError("Description must be at least 20 characters!")
      return;
    }

    if (reason === ""){
      setReasonError("Reason is required!")
      return;
    }

    setIsReport(true);
    try{
      const resp = await api.post("jobs/details/user/report-invalid/jobs/",
         {
          job_slug : JobSlug,
          reason : reason,
          description : description,

        });

        toast.success("Job reported successfully!");
        setShowReportJobModel(false);
    }catch(err){
       if (err.response) {
        const data = err.response.data;
        if (data.detail) {
          toast.error(data.detail);
        } else if (typeof data === 'object') {
          Object.entries(data).forEach(([key, value]) => {
            const message = Array.isArray(value) ? value.join(", ") : value;
            toast.error(message);
          });
        } else {
          toast.error("Unexpected error occurred. Please try again later.");
        }
      } else {
        toast.error("Network error!");
      }
    }finally{
      setIsReport(false);
    }

   
  };

  if (loading) {
    return <FullScreenLoader />;
  }


return (
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
                  <Loader className="w-6 h-6 animate-spin text-red-600" />
                ) : (
                  <Heart className={`w-6 h-6 transition-all ${saved ? "fill-red-600 text-red-600 scale-110" : "text-red-600"}`} />
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
                    <img src={job.company_logo} alt={job.company_name} className="w-28 h-28 object-contain rounded-2xl shadow-lg" />
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
                <BadgeInfo className="w-6 h-6 text-indigo-600" />
                <span className="font-medium">Posted by</span>
              </div>
              <p className="mt-2 text-lg font-semibold text-gray-900">
                {job.post_type === "COMPANY" ? "Company" : "Individual"}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
              <div className="flex items-center gap-3 text-gray-600">
                <DollarSign className="w-6 h-6 text-green-600" />
                <span className="font-medium">Salary Range</span>
              </div>
              <p className="mt-2 text-lg font-bold text-green-700">
                {job.currency} {Number(job.salary_min).toLocaleString()} - {Number(job.salary_max).toLocaleString()}
                <span className="block text-sm font-normal text-gray-600">{job.payment_period_display}</span>
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

              <div className="grid grid-cols-1 md:grid-cols-2  gap-5 text-gray-700">
                <div className="flex items-start flex-col space-y-1 py-2 px-4 border rounded-lg bg-gray-50">
                    <p  className="font-medium text-gray-800">Education</p>
                    <p className="text-gray-500"> {job.education_level_display}</p>
                </div>

                 <div className="flex items-start flex-col space-y-1 py-2 px-4 border rounded-lg bg-gray-50">
                    <p  className="font-medium text-gray-800">Experience</p>
                    <p className="text-gray-500">  {job.experience_level_display || "Any level"}</p>
                </div>
                 <div className="flex items-start flex-col space-y-1 py-2 px-4 border rounded-lg bg-gray-50">
                    <p  className="font-medium text-gray-800">Gender</p>
                    <p className="text-gray-500"> {job.gender_display}</p>
                </div>

                 <div className="flex items-start flex-col space-y-1 py-2 px-4 border rounded-lg bg-gray-50">
                    <p  className="font-medium text-gray-800">Positions</p>
                    <p className="text-gray-500">{job.positions_needed}</p>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-indigo-600" />
                Location
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="border py-2 px-4 bg-gray-50 rounded-xl space-y-2">
                   <p className="text-lg font-medium">Region</p>
                   <p className="text-gray-500">{job.region_name}</p>
                </div>
                <div className="border py-2 px-4 bg-gray-50 rounded-xl space-y-2">
                   <p className="text-lg font-medium">District</p>
                   <p className="text-gray-500">{job.district_name}</p>
                </div>
                <div className="border py-2 px-4 bg-gray-50 space-y-2 rounded-xl">
                   <p className="text-lg font-medium">Ward</p>
                   <p className="text-gray-500">{job.ward_name}</p>
                </div>
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

 {/* MODELS  */}


{/* Reusable Modal Overlay */}
{showLoginModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
    <div 
      className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
    >
      <div className="p-8">
        <h2 id="login-modal-title" className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          Login Required
        </h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          To access this feature, please log in or create an account.
        </p>

        <div className="grid gap-4">
          <Link
            to="/user-login"
            className="group flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Login with Email
          </Link>

          <Link
            to="/account-type"
            className="group flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Create New Account
          </Link>

          <button
            onClick={() => setShowLoginModal(false)}
            className="text-gray-700 font-medium py-4 px-6 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all duration-200"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  </div>
)}

{/* Apply Job Modal */}
{showApplyModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
    <div 
      className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[92vh] flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-labelledby="apply-modal-title"
    >
      <div className="p-8 overflow-y-auto flex-1">
        <h2 id="apply-modal-title" className="text-xl md:text-3xl font-bold text-gray-900 border-b pb-2 mb-6">
          Apply for <span className="text-indigo-600">{job.title}</span>
        </h2>

        {/* User Info Card */}
        <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-6 mb-7 border border-indigo-100">
          <h3 className="font-semibold text-lg text-gray-800 mb-4 text-center">
          
            Confirm Your Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {[
              { icon: User, label: "Full name", value: userProfile.full_name },
              { icon: Briefcase, label: "Title", value: userProfile.job_title },
              { icon: Mail, label: "Email", value: userProfile.email },
              { icon: Phone, label: "Phone", value: userProfile.phone_number },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <item.icon className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                <div>
                  <span className="font-bold text-gray-500">{item.label}</span>
                  <p className="font-semibold text-sm text-gray-800 truncate">{item.value || "—"}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleJobApplication} className="space-y-7">
          {/* Cover Letter */}
          {applyMethod === "IN_PLATFORM" && (
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-3">
                <FileText className="w-5 h-5 text-indigo-600" />
                Cover Letter <span className="text-red-500">*</span>
              </label>
              {coverLetterError && (
                <p className="text-red-600 text-sm flex items-center gap-1 mb-2">
                  <AlertCircle className="w-4 h-4" /> {coverLetterError}
                </p>
              )}
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Tell them why you're the perfect candidate..."
                className="w-full p-4 rounded-xl border border-gray-300 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none text-gray-800 placeholder-gray-400"
                rows={6}
                required
              />
            </div>
          )}

          {/* CV Upload */}
          {job.post_type === "COMPANY" && (
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-3">
                <FileText className="w-5 h-5 text-indigo-600" />
                CV / Resume <span className="text-red-500">*</span>
              </label>

              {userProfile.current_cv ? (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <p className="text-green-800 flex items-center gap-2 font-medium">
                      <CheckCircle className="w-5 h-5" />
                      Using: {userProfile.current_cv.split('/').pop()}
                    </p>
                    <a href={userProfile.current_cv} target="_blank" rel="noopener noreferrer"
                      className="text-indigo-600 hover:underline text-sm mt-2 inline-flex items-center gap-1">
                      <ExternalLink className="w-4 h-4" /> View CV
                    </a>
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setCv(e.target.files?.[0] || null)}
                    className="block w-full text-sm text-gray-600 file:mr-4 file:py-3 file:px-5 file:rounded-xl file:border-0 file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                  />
                </div>
              ) : (
                <>
                  {cvError && <p className="text-red-600 text-sm flex items-center gap-1 mb-2"><AlertCircle className="w-4 h-4" /> {cvError}</p>}
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setCv(e.target.files?.[0] || null)}
                    required
                    className="block w-full text-sm text-gray-600 file:mr-4 file:py-3 file:px-5 file:rounded-xl file:border-0 file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                  />
                </>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => {
                setShowApplyModal(false);
                setCoverLetter("");
                setCv(null);
                setCoverLetterError("");
                setCvError("");
              }}
              className="order-2 sm:order-1 px-6 py-3.5 bg-gray-100 text-gray-800 font-semibold rounded-xl hover:bg-gray-200 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isApplying}
              className="order-1 sm:order-2 flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-60 disabled:transform-none transition-all duration-200"
            >
              {isApplying ? (
                <>Applying <Loader2 className="w-5 h-5 animate-spin ml-2" /></>
              ) : (
                <>Submit Application <Send className="w-5 h-5 ml-2" /></>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
)}

{/* Report Job Modal */}
{showReportJobModel && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
    <div 
      className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300"
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-modal-title"
    >
      <div className="p-8">
        <h2 id="report-modal-title" className="text-xl md:text-3xl font-bold border-b py-4 text-center text-gray-900 mb-6">
          Report <span className="text-indigo-700">{job.title}</span> 
        </h2>

        <form onSubmit={handleReportJob} className="space-y-6">
          <div>
            <label className="flex items-center gap-2 font-semibold text-gray-800 mb-3">
              Reason <span className="text-red-500">*</span>
            </label>
            {reasonError && <p className="text-red-600 text-sm flex items-center gap-1 mb-2"><AlertCircle className="w-4 h-4" /> {reasonError}</p>}
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-4 rounded-xl border border-gray-300 focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all"
              required
            >
              <option value="">Select a reason</option>
              <option value="FAKE">Fake Job</option>
              <option value="SPAM">Spam / Scam</option>
              <option value="INAPPROPRIATE">Inappropriate Content</option>
              <option value="EXPIRED">Job Expired</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div>
            <label className="flex items-center gap-2 font-semibold text-gray-800 mb-3">
             
              Details <span className="text-red-500">*</span>
            </label>
            {descriptionError && <p className="text-red-600 text-sm flex items-center gap-1 mb-2"><AlertCircle className="w-4 h-4" /> {descriptionError}</p>}
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Help us understand the issue..."
              className="w-full p-4 rounded-xl border border-gray-300 focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all resize-none"
              rows={5}
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => {
                setShowReportJobModel(false);
                setReason("");
                setDescription("");
                setReasonError("");
                setDescriptionError("");
              }}
              className="order-2 sm:order-1 px-6 py-3.5 bg-gray-100 text-gray-800 font-semibold rounded-xl hover:bg-gray-200 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isReport}
              className="order-1 sm:order-2 flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-60 disabled:transform-none transition-all duration-200"
            >
              {isReport ? (
                <>Reporting <Loader2 className="w-5 h-5 animate-spin ml-2" /></>
              ) : (
                <>Submit Report <Flag className="w-5 h-5 ml-2" /></>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
)}



          
{/* MODELS  */}


  </div>
)
 }
  