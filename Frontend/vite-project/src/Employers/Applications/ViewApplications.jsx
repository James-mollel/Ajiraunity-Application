




import { useEffect, useState } from "react";
import api from "../../AxiosApi/Api";
import FullScreenLoader from "../../Components/Loader";
import toast from "react-hot-toast";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
    Mail, Phone, MapPin, Briefcase, GraduationCap, 
    Globe, Link as LinkIcon, Download, User,
    ChevronLeft, FileText, Award, Languages,
    Wrench, Calendar, MousePointer2, Activity, Tag
} from "lucide-react";

export default function ViewApplicationDetails() {
    const { applicationId } = useParams();
    const navigate = useNavigate();
    const backendURL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000"; 

    const [application, setApplication] = useState(null);
    const [load, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    const fetchApplicationDetail = async () => {
        try {
            const resp = await api.get(`jobs/details/employer/view/${applicationId}/`);
            setApplication(resp.data);
        } catch (err) {
            toast.error(err.response?.data?.detail || "Failed to load application.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplicationDetail();
    }, [applicationId]);

    const updateStatus = async (newStatus) => {
        setUpdating(true);
        try {
            await api.patch(`jobs/details/application/status/${applicationId}/update/`, { status: newStatus });
            setApplication(prev => ({ ...prev, status: newStatus }));
            toast.success(`Application marked as ${newStatus.replace('_', ' ')}`);
        } catch (err) {
            toast.error(err.response?.data?.detail || "Failed to update status");
        } finally {
            setUpdating(false);
        }
    };

    if (load) return <FullScreenLoader />;

    if (!application){
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-gray-500">Application not found.</p>
      </div>
    );
    }

    const info = application?.applicant_info || {};
    const personal = info?.personal_info || {};

    const statusColors = {
        PENDING: "bg-amber-100 text-amber-700 border-amber-200",
        UNDER_REVIEW: "bg-blue-100 text-blue-700 border-blue-200",
        SHORTLISTED: "bg-indigo-100 text-indigo-700 border-indigo-200",
        INTERVIEW: "bg-purple-100 text-purple-700 border-purple-200",
        HIRED: "bg-emerald-100 text-emerald-700 border-emerald-200",
        REJECTED: "bg-rose-100 text-rose-700 border-rose-200",
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-12">
            {/* Header / Navigation */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <button 
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors font-medium"
                    >
                        <ChevronLeft size={20} />
                        Back
                    </button>
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Current Status:</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColors[application.status]}`}>
                            {application.status.replace('_', ' ')}
                        </span>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 mt-8">
                {/* Status Management Action Bar */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Manage Application</h3>
                            <p className="text-sm text-gray-500">Update the candidate's progress through the hiring pipeline.</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {[
                                { label: "Review", value: "UNDER_REVIEW", color: "hover:bg-blue-600 bg-blue-500" },
                                { label: "Shortlist", value: "SHORTLISTED", color: "hover:bg-indigo-600 bg-indigo-500" },
                                { label: "Interview", value: "INTERVIEW", color: "hover:bg-purple-600 bg-purple-500" },
                                { label: "Hire", value: "HIRED", color: "hover:bg-emerald-600 bg-emerald-500" },
                                { label: "Reject", value: "REJECTED", color: "hover:bg-rose-600 bg-rose-500" },
                            ].map((btn) => (
                                <button
                                    key={btn.value}
                                    disabled={updating || application.status === btn.value}
                                    onClick={() => updateStatus(btn.value)}
                                    className={`px-4 py-2 rounded-md text-white text-xs font-bold transition-all shadow-sm disabled:opacity-20 ${btn.color}`}
                                >
                                    {btn.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* LEFT COLUMN (4/12) */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Profile Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="h-24 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                            <div className="px-6 pb-6">
                                <div className="relative -mt-12 mb-4">
                                    {personal.avatar ? (
                                        <img 
                                            src={personal.avatar} 
                                            className="w-24 h-24 rounded-2xl mx-auto object-cover border-4 border-white shadow-md"
                                            alt="Candidate"
                                        />
                                    ) : (
                                        <div className="w-24 h-24 rounded-2xl mx-auto bg-gray-100 flex items-center justify-center border-4 border-white shadow-md">
                                            <User size={40} className="text-gray-400" />
                                        </div>
                                    )}
                                </div>
                                
                                <div className="text-center">
                                    <h1 className="text-xl font-bold text-gray-900 leading-tight">
                                        {personal.first_name || personal.last_name ? ( 
                                            <>
                                                {personal.first_name || '-'} {personal.last_name || '-'}
                                            </>
                                          ):(
                                            <span className="text-gray-500 text-sm"> Not specified </span>
                                          ) }
                                    </h1>

                                    <p className="text-indigo-600 bg-indigo-50 rounded-xl py-2 font-medium text-sm mt-1">{info.job_title || info.title || 'Not specified'}</p>
                                </div>

                                <div className="mt-6 space-y-3 pt-6 border-t border-gray-100">
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                                            <Mail size={16} />
                                        </div>
                                        <span className="text-sm truncate">{personal.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                                            <Phone size={16} />
                                        </div>
                                        <span className="text-sm">{personal.phone_number || "Not specified"}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                                            <MapPin size={16} />
                                        </div>
                                        <span className="text-sm">{personal.region || 'Not specified'}, {personal.district || 'Not specified'}, {personal.ward || 'Not specified'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Professional Details Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h4 className="font-bold text-gray-900 mb-4 text-lg tracking-wider">Candidate Overview</h4>
                            <div className="space-y-4">

                        {application.job_post_type === "COMPANY" && ( 
                             <div className="space-y-4">
                                <div className="flex flex-col border-t border-gray-50 pt-4">
                                    <span className="text-gray-500">Experience</span>
                                    <span className="font-semibold text-gray-900 bg-gray-50 px-2 py-1 rounded text-sm">
                                        {info.experience_yrs_dispaly || "Not specified"}
                                    </span>
                                </div>
                                <div className="flex flex-col border-t border-gray-50 pt-4">
                                    <span className="text-gray-500">Education Level</span>
                                    <span className="font-semibold text-gray-900 bg-gray-50 px-2 py-1 rounded text-sm">
                                        {info.education_level_dispaly || "Not specified"}
                                    </span>
                                </div>
                                <div className="flex flex-col border-t border-gray-50 pt-4">
                                    <span className="text-gray-500">Employment Status</span>
                                    <span className="font-semibold text-gray-900 bg-gray-50 px-2 py-1 rounded text-sm">
                                        {info.employment_status_dispaly || "Not specified"}
                                    </span>
                                </div>
                             </div>
                            )}
                                <div className="flex flex-col border-t border-gray-50 pt-4">
                                    <div>
                                       <span className="text-gray-500">Desired Salary</span>
                                    </div>

                                    {application.job_post_type === "COMPANY" ? (
                                            <div>
                                                {info.prof_salary ? ( 
                                                <div className="flex space-x-2 items-center">
                                                    <h2 className="font-bold text-gray-900">{info.prof_currency || '-'} {Number(info.prof_salary).toLocaleString()}</h2>
                                                    <h2 className="text-emerald-700 font-bold">{info.payment_period_dispaly || '-'}</h2>
                                                </div>
                                                        ):(
                                                    <h1 className="text-xs font-bold py-2 bg-gray-50 px-4">
                                                                Not specified
                                                    </h1> 
                                                    )}
                                            </div>

                                           ): (
                                            <div> 
                                                {info.salary  ? ( 
                                                <div className="flex space-x-2 items-center"> 
                                                    <h2 className="font-bold text-gray-900">{info.currency || '-'} {Number(info.salary).toLocaleString()}</h2>
                                                    <h2 className="text-emerald-700 font-bold">{info.payment_period_dispaly || '-'}</h2>
                                                </div>
                                                    ):(
                                                        <h1 className="text-sm bg-gray-50 py-2 px-4">
                                                            Not specified
                                                        </h1>    
                                                    )}
                                            </div>  
                                    )}   
                                </div>

                                {application.job_post_type === "INDIVIDUAL" && (
                               <div className="space-y-4">
                                    <div className="flex flex-col border-t border-gray-50">
                                        <span className="text-gray-500">Availability</span>
                                        <span className="font-semibold text-gray-900">
                                            {info.availability_display || "Not specified"}
                                        </span>
                                    </div>

                                    <div className="flex flex-col border-t border-gray-50">
                                        <span className="text-gray-500">Experience level</span>
                                        <span className="font-semibold text-gray-900">
                                            {info.experience_level || "Not specified"}
                                        </span>
                                    </div>
                                </div>
                                )}

                            </div>

                            {application.cv && (
                                <a href={backendURL + application.cv} download className="flex items-center justify-center gap-2 w-full mt-6 bg-gray-900 text-white py-3 rounded-xl text-sm font-bold hover:bg-indigo-600 transition-all shadow-lg shadow-gray-200">
                                    <Download size={18} /> Download CV / Resume
                                </a>
                            )}
                        </div>

                        {/* Social Links */}
                        {application.job_post_type === "COMPANY" && (info.linkedIn || info.portfolio || info.gitHub) && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                <h4 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">External Profiles</h4>
                                <div className="grid grid-cols-1 gap-2">
                                    {info.linkedIn && (
                                        <a href={info.linkedIn} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-indigo-50 text-gray-600 hover:text-indigo-600 transition-colors text-sm border border-transparent hover:border-indigo-100">
                                            <LinkIcon size={16} /> LinkedIn Profile
                                        </a>
                                    )}
                                    {info.gitHub && (
                                        <a href={info.gitHub} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-indigo-50 text-gray-600 hover:text-indigo-600 transition-colors text-sm border border-transparent hover:border-indigo-100">
                                           <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                               <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                         </svg>
                                        </a>
                                    )}
                                    {info.portfolio && (
                                        <a href={info.portfolio} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-indigo-50 text-gray-600 hover:text-indigo-600 transition-colors text-sm border border-transparent hover:border-indigo-100">
                                            <Globe size={16} />  Portfolio
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN (8/12) */}
                    <div className="lg:col-span-8 space-y-6">

                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                            {/* Header with a subtle background tint */}
                            <div className="bg-gray-50/50 px-8 py-4 border-b border-gray-100">
                                <h3 className="text-lg font-bold text-gray-700 flex items-center gap-2">
                                <Activity size={16} className="text-indigo-500" />
                                Application Tracking
                                </h3>
                            </div>

                            <div className="p-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                
                                {/* Date Applied */}
                                <div className="flex items-start gap-4">
                                    <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                                    <Calendar size={20} />
                                    </div>
                                    <div>
                                    <p className="text-xs font-semibold text-gray-400">Applied On</p>
                                    <p className="text-sm font-bold text-gray-900 mt-0.5">
                                        {new Date(application.applied_at).toLocaleDateString(undefined, { 
                                            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' 
                                        })}
                                    </p>
                                    </div>
                                </div>

                                {/* Application Method */}
                                <div className="flex items-start gap-4">
                                    <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
                                    <MousePointer2 size={20} />
                                    </div>
                                    <div>
                                    <p className="text-xs font-semibold text-gray-400">Method</p>
                                    <p className="text-sm font-bold text-gray-900 mt-0.5">{application.application_method_display}</p>
                                    </div>
                                </div>

                                {/* Position Detail */}
                                <div className="flex items-start gap-4">
                                    <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                                    <Briefcase size={20} />
                                    </div>
                                    <div>
                                    <p className="text-xs font-semibold text-gray-400">Applied For</p>
                                    <p className="text-sm font-bold text-gray-900 mt-0.5">
                                        {application.job_title} 
                                        <span className="ml-2 text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded uppercase">
                                            {application.job_code}
                                        </span>
                                    </p>
                                    </div>
                                </div>

                                {/* Status Badge Section */}
                                <div className="flex items-start gap-4">
                                    <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
                                    <Tag size={20} />
                                    </div>
                                    <div>
                                    <p className="text-xs font-semibold text-gray-400">Current Status</p>
                                    <div className="mt-1">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-black border tracking-wide uppercase ${statusColors[application.status]}`}>
                                        <span className="w-1.5 h-1.5 rounded-full bg-current mr-2 animate-pulse"></span>
                                        {application.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                    </div>
                                </div>

                                </div>
                            </div>
                            </div>


                          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                 <FileText size={20} className="text-indigo-600" /> Cover Letter / Summary
                                
                            </h3>
                            {application.job_post_type === "COMPANY" ? (
                             <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                                <p className="text-gray-600 leading-relaxed whitespace-pre-line text-sm md:text-base">
                                    {application.cover_letter || info.prof_description || "No summary provided by the candidate."}
                                </p>
                            </div>
                            ): (
                            <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                                <p className="text-gray-600 leading-relaxed whitespace-pre-line text-sm md:text-base">
                                    {application.cover_letter || info.description || "No summary provided by the candidate."}
                                </p>
                            </div>
                            )}
                            
                        </div>

                        {/* Experience Section */}
             {application.job_post_type === "COMPANY" && 

                <div className="space-y-6">
                     <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                               <h3 className="text-lg font-bold text-gray-900 mb-8 flex items-center gap-2">
                                    <Award size={20} className="text-indigo-600" /> Work Experience
                              </h3>

                        {info.experiences?.length > 0 ? (   
                                <div className="space-y-10 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-indigo-50">
                                    {info.experiences.map((exp, index) => (
                                        <div key={index} className="relative pl-10">
                                            <div className="absolute left-0 top-1.5 w-6 h-6 bg-white border-2 border-indigo-500 rounded-full z-10"></div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 text-lg leading-none">{exp.role}</h4>
                                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 mb-3">
                                                    <span className="text-indigo-600 font-semibold text-sm">{exp.company}</span>
                                                    <span className="text-gray-300">•</span>
                                                    <span className="text-gray-500 text-xs flex items-center gap-1">
                                                        <Calendar size={12} /> {exp.start_date} — {exp.current_working ? "Present" : exp.end_date}
                                                    </span>
                                                </div>
                                                <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                                                    {exp.responsibilities}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                ):(
                                    <div>
                                      <h2 className="text-center text-gray-500 bg-gray-50 py-6 px-6 rounded-lg">No work Experience provided by the candidate.</h2>
                                    </div>
                                 )}
                            </div>

                        {/* Education & Skills Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Skills */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                      <Wrench size={18} className="text-indigo-600" /> Skills 
                                </h3>

                                {info.skills?.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {info.skills?.map((s, i) => (
                                        <span key={i} className="px-3 py-1.5 bg-white text-gray-700 rounded-lg text-xs font-bold border border-gray-200 shadow-sm">
                                            {s.skill}
                                        </span>
                                    ))}
                                </div>
                                 ):(
                                    <div>
                                        <h2 className="text-center text-gray-600 p-6 rounded-xl bg-gray-50">
                                            No Skills provided by the candidate.
                                        </h2>
                                    </div>
                                 )}
                            </div>

                            {/* Languages */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Languages size={18} className="text-indigo-600" /> Languages
                                </h3>
                             {info.languages?.length > 0 ? ( 
                                <div className="space-y-2">
                                    {info.languages?.map((l, i) => (
                                        <div key={i} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                                            <span className="text-sm font-bold text-gray-700">{l.language}</span>
                                            <span className="text-[10px] font-black uppercase text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">{l.level}</span>
                                        </div>
                                    ))}
                                </div>
                                 ):(
                                     <div>
                                        <h2 className="text-center text-gray-600 p-6 rounded-xl bg-gray-50">
                                            No language provided by the candidate.
                                        </h2>
                                    </div>

                                 )}
                            </div>
                        </div>

                            {/* Education */}
                        
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <GraduationCap size={20} className="text-indigo-600" /> Education
                                </h3>
                                {info.educations?.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {info.educations.map((edu, index) => (
                                        <div key={index} className="p-5 border border-gray-100 rounded-2xl bg-white hover:border-indigo-100 transition-colors">
                                            <h4 className="font-bold text-gray-900">{edu.degree || edu.field_of_study}</h4>
                                            <p className="text-indigo-600 text-sm font-medium mt-1">School, {edu.school}</p>
                                            <h4 className="text-gray-600 mt-1">{edu.education_level_dispaly}</h4>
                                            
                                            <div className="mt-4 flex items-center justify-between text-gray-400">
                                                <span className="text-[10px] font-bold uppercase tracking-widest">{edu.start_year} - {edu.end_year || 'Present'}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                ):(
                                     <div>
                                        <h2 className="text-center text-gray-600 p-6 rounded-xl bg-gray-50">
                                            No Education provided by the candidate.
                                        </h2>
                                    </div>
                                )}


                            </div>

                        </div>
                        
                }
                        
                    </div>
                </div>
            </div>
        </div>
    );
}





