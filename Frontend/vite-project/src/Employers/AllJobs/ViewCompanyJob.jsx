import { useParams } from "react-router";
import api from "../../AxiosApi/Api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import FullScreenLoader from "../../Components/Loader";
import toast from "react-hot-toast";
import { 
    Eye, MessagesSquareIcon, Edit, Trash2, Calendar, Clock, MapPin, Briefcase, 
    DollarSign, BookOpen, Users, Hash, MessageCircleMore, Mail, Globe,AppWindow, ChartNoAxesColumnDecreasing
} from "lucide-react";

export default function ViewCompanyJobDetails() {
    const { JobPk } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);

    const [deleting, setDeleting] = useState(false);

    const navigate = useNavigate();

    const fetchExpectedJob = async () => {
        try {
            const resp = await api.get(`jobs/users/jobs/user-retrieve-update/${JobPk}/job/`);
            setJob(resp.data);
        } catch (err) {
            toast.error("Failed to fetch job details. Try again later.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchExpectedJob();
    }, [JobPk]);


      //DELETE A JOB 
    const handleDeleteJob = async()=>{
        if (!confirm(`Are you sure you want to delete "${job.title}" `)) return;
        setDeleting(true);
        try{
            const resp = await api.delete(`jobs/users/jobs/user-retrieve-update/${JobPk}/job/`)
            toast.success("Job Deleted successfully")
            setTimeout(() => {
                    navigate("/dashboard-user-employer/all-employers-jobs-posted/")
                }, 1000);

        }catch(err){
            if (err.response){
                toast.error("Failed to delete a  job. Please try again later")
            }else{
                toast.error("Network error")
            }
        }finally{
            setDeleting(false)
        }

    }
    //DELETE A JOB 

    if (loading) {
        return <FullScreenLoader />;
    }

    if (!job) {
        return <p className="text-center py-28 text-xl text-gray-600">Job Not Found!</p>
    }

    // Destructuring for cleaner JSX
    const {
        title, post_type, code, category, company, job_type_display, education_leveldisplay, 
        experience_level_display, gender_display, positions_needed, deadline, job_summary, 
        duties, skills_required, currency, salary_max, salary_min, salary_visible, 
        payment_period_display, region, district, ward, apply_email, apply_website, 
        apply_in_app, apply_whatsapp, views, applied, status, created_at
    } = job;

    const salaryRange = (salary_min || salary_max) 
        ? `${currency} ${salary_min || 'N/A'} - ${currency} ${salary_max || 'N/A'}`
        : 'Not specified';
        
    const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };

    // Card component helper for cleaner JSX
    // Added subtle hover effect and reduced padding slightly for cleaner look
    const DetailCard = ({ icon: Icon, title, value }) => (
        <div className="flex items-start p-4 bg-white rounded-xl border border-gray-100 hover:shadow-sm transition duration-150">
            <Icon className="w-5 h-5 text-indigo-600 mr-3 mt-1 flex-shrink-0" />
            <div>
                <p className="text-xs font-semibold uppercase text-gray-500 tracking-wider">{title}</p>
                <p className="text-base font-medium text-gray-800 break-words mt-0.5">
                    {typeof value === "object" ? JSON.stringify(value) : value || "N/A"}
                </p>
            </div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
            
            {/* 1. Header and Actions: Using shadow-xl and optimizing button layout */}
            <header className="bg-white rounded-xl shadow-xl p-6 border border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Title & Status */}
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 leading-tight tracking-tight sm:text-4xl">{title}</h1>
                        <div className="flex flex-wrap items-center gap-3 mt-3">
                            <span 
                                className={`px-4 py-1.5 rounded-full text-sm font-bold tracking-wide 
                                ${status === "ACTIVE" ? "bg-green-100 text-green-700" : 
                                  status === "CLOSED" ? "bg-red-100 text-red-700" : 
                                  "bg-yellow-100 text-yellow-700"}`}
                            >
                                {status}
                            </span>
                            <span className="text-sm text-gray-500 flex items-center gap-1">
                                <Clock className="w-4 h-4 text-gray-400"/> Posted: {new Date(created_at).toLocaleDateString("en-US", dateOptions)}
                            </span>
                        </div>
                    </div>

                    {/* Action Buttons: Stacked on xs, side-by-side on sm+ */}
                    <div className="flex gap-3 w-full sm:w-auto flex-shrink-0">
                        <button 
                            onClick={()=>navigate(`/dashboard-user-employer/edit-professional-job-page/${JobPk}`)}
                            className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium border border-indigo-300 text-indigo-700 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition shadow-md w-1/2 sm:w-auto">
                            <Edit className="w-4 h-4" />
                            Edit Job
                        </button>
                        <button  
                            disabled={deleting}
                            onClick={()=> handleDeleteJob()} 
                            className={`flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium 
                                     border border-red-300 text-red-700 bg-red-50 rounded-xl 
                                    hover:bg-red-100 transition shadow-md w-1/2 sm:w-auto
                                     ${deleting && "opacity-50 cursor-not-allowed"}
                                    `}>
                            <Trash2 className="w-4 h-4" />
                            {deleting ? "deleting...":"Delete Job"}
                        </button>
                    </div>
                </div>
            </header>
            
            
            {/* 2. Main Grid Layout: Responsive adjustments for md and lg screens */}
            <div className="grid grid-cols-1 **md:grid-cols-2 lg:grid-cols-3** gap-8">
                
                {/* Left Column: Core Description & Requirements (Full width on md, 2/3 on lg) */}
                <div className="**md:col-span-2 lg:col-span-2** space-y-8">
                    
                    {/* Job Summary, Duties, Skills: Added lg:text-lg for better desktop readability */}
                    {[
                        { title: "Job Summary", content: job_summary, icon: Briefcase },
                        { title: "Key Duties and Responsibilities", content: duties, icon: Users },
                        { title: "Required Skills", content: skills_required, icon: BookOpen }
                    ].map((section, index) => (
                        <section key={index} className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-100 space-y-4">
                            <h2 className="text-xl font-bold text-gray-800 border-b-2 border-indigo-100 pb-3">{section.title}</h2>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-base **lg:text-lg**">
                                {section.content || `No ${section.title.toLowerCase()} listed yet.`}
                            </p>
                        </section>
                    ))}
                    
                    {/* Application Channels: Grid refined for wider screens */}
                    <section className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-100 space-y-4">
                        <h2 className="text-xl font-bold text-gray-800 border-b-2 border-indigo-100 pb-3">Application Channels</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 **lg:grid-cols-4** gap-4">
                            <DetailCard icon={AppWindow} title="Apply In-App" value={apply_in_app ? "Yes (Recommended)" : "No"} />
                            <DetailCard icon={MessageCircleMore} title="WhatsApp" value={apply_whatsapp || "Not allowed"} />
                            <DetailCard icon={Mail} title="Email" value={apply_email || "Not allowed"} />
                            <DetailCard icon={Globe} title="Website Link" value={apply_website || "Not allowed"} />
                        </div>
                    </section>
                    
                </div>

                {/* Right Column: Metadata Cards (Full width on md, 1/3 on lg) */}
                <div className="**md:col-span-2 lg:col-span-1** space-y-8">
                    
                    {/* Metrics Card: Added hover effect */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 **hover:shadow-xl transition duration-300**">
                        <h3 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-100 pb-3">Job Performance</h3>
                        <div className="flex justify-around items-center text-center">
                            <div className="flex flex-col items-center">
                                <Eye className="w-7 h-7 text-indigo-600" />
                                <span className="text-3xl font-extrabold text-gray-900 mt-1">{views}</span>
                                <span className="text-sm text-gray-500">Views</span>
                            </div>
                            <div className="h-14 w-px bg-gray-200"></div>
                            <div className="flex flex-col items-center">
                                <MessagesSquareIcon className="w-7 h-7 text-indigo-600" />
                                <span className="text-3xl font-extrabold text-gray-900 mt-1">{applied}</span>
                                <span className="text-sm text-gray-500">Applications</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Info Card */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 space-y-4">
                        <h3 className="text-xl font-bold text-gray-800 border-b-2 border-indigo-100 pb-3">Quick Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <DetailCard icon={Briefcase} title="Post Type" value={post_type} />
                            <DetailCard icon={Hash} title="Job Code" value={code} />
                            <DetailCard icon={Calendar} title="Deadline" value={new Date(deadline).toLocaleDateString("en-US", dateOptions)} />
                            <DetailCard icon={Users} title="Company" value={company?.name || "Individual"} />
                            <DetailCard icon={Calendar} title="Category" value={category?.display_name} />
                        </div>
                    </div>

                    {/* Salary & Requirements Card */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 space-y-4">
                        <h3 className="text-xl font-bold text-gray-800 border-b-2 border-indigo-100 pb-3">Details & Requirements</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <DetailCard icon={DollarSign} title="Salary Range" value={salaryRange} />
                            <DetailCard icon={DollarSign} title="Visibility" value={salary_visible ? "Public Visible" : "Private"} />
                            <DetailCard icon={Clock} title="Payment Period" value={payment_period_display} />
                            <DetailCard icon={Briefcase} title="Job Type" value={job_type_display} />
                            <DetailCard icon={BookOpen} title="Education" value={education_leveldisplay} />
                            <DetailCard icon={ChartNoAxesColumnDecreasing} title="Experience" value={experience_level_display} />
                            <DetailCard icon={Users} title="Positions Needed" value={positions_needed} />
                            <DetailCard icon={Users} title="Gender Preference" value={gender_display} />
                        </div>
                    </div>

                    {/* Location Card */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 space-y-4">
                        <h3 className="text-xl font-bold text-gray-800 border-b-2 border-indigo-100 pb-3">Location</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <DetailCard icon={MapPin} title="Region" value={region.name} />
                            <DetailCard icon={MapPin} title="District" value={district.name} />
                            <DetailCard icon={MapPin} title="Ward" value={ward.name} />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}