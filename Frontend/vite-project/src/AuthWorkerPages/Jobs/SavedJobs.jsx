import { useContext, useEffect, useState } from "react";
import api from "../../AxiosApi/Api";
import FullScreenLoader from "../../Components/Loader";
import toast from "react-hot-toast";
import { Link } from "react-router";
import { MapPin, DollarSign, Heart, LoaderIcon, Calendar } from "lucide-react";
import { JobsCounterContext } from "../Context/JobsCounter";

export default function SavedJobsByJobSeeker() {
    const [savedJobs, setSavedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saveLoading, setSaveLoading] = useState(null);
    
    const {countSavedJobs} = useContext(JobsCounterContext)

    const fetchSavedJobs = async () => {
        try {
            const resp = await api.get("jobs/details/user/list/jobs-saved/");
            setSavedJobs(resp.data);

        } catch (err) {
            toast.error(err.response ? "Failed to fetch saved jobs" : "Network connection error");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchSavedJobs();
    },[]);

    const formatSalary = (min, max, currency, period) => {
        if (min || max) {
            const minStr = min ? Number(min).toLocaleString() : 'N/A';
            const maxStr = max ? Number(max).toLocaleString() : 'N/A';
            return `${currency} ${minStr} - ${maxStr} / ${period || 'period'}`;
        }
        return "Negotiable";
    };

    const handleUnsaveJob = async (e, job_slug, jobId) => {
        e.stopPropagation();
        e.preventDefault();
        setSaveLoading(jobId); // Set loading for this specific card
        try {
            const resp = await api.post("jobs/details/user/save-unsave/job/", { job_slug });
            toast.success(resp.data.message);
            
            setSavedJobs(prev => prev.filter(job => job.id !== jobId));
        } catch (err) {
            toast.error( err.response ? 'Failed to update saved status.':"Network connection error!");
        } finally {
            setSaveLoading(null);
        }
    };

    if (loading) return <FullScreenLoader />;

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            <div className="mb-10 text-center sm:text-left">
                <h1 className="text-3xl font-black text-gray-900">My saved Jobs</h1>
                <p className="text-gray-500 mt-2"> <span className="text-indigo-500 font-extrabold">{countSavedJobs}</span>  jobs saved for you.</p>
            </div>

            {savedJobs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {savedJobs.map((job) => {
                        const isIndividual = job.job_post_type !== "COMPANY";
                        const borderColor = isIndividual ? "hover:border-pink-400" : "hover:border-indigo-500";
                        
                        return (
                            <Link 
                                key={job.id}
                                to={`/jobs-details/${job.job_slug}`} 
                                className={`group relative bg-white rounded-3xl border-2 border-gray-100 p-6 flex flex-col justify-between
                                          shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${borderColor}`}
                            >
                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className={`px-3 py-1 text-xs font-black tracking-widest rounded-lg ${
                                            isIndividual ? "bg-pink-50 text-pink-600" : "bg-indigo-50 text-indigo-600"
                                        }`}>
                                            {job.job_post_type !== "COMPANY"? "Individual":"Company"}
                                        </span>
                                        <div className='flex-shrink-0'>
                                            {saveLoading === job.id ? (
                                                <LoaderIcon size={20} className="animate-spin text-gray-400" />
                                            ) : (
                                                <button 
                                                    onClick={(e) => handleUnsaveJob(e, job.job_slug, job.id)}
                                                    className="p-2 bg-red-50 rounded-full hover:bg-red-100 transition-colors"
                                                    title="Remove from saved"
                                                >
                                                    <Heart size={20} className="fill-red-500 text-red-500" />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition mb-3 line-clamp-2 ">
                                        {job.job_title}
                                    </h3>

                                    <div className="space-y-2 text-sm text-gray-500">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-gray-400" />
                                            <span className="truncate">{job.job_region} • {job.job_district} • {job.job_ward}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-green-600 font-bold bg-green-50 px-3 py-2 rounded-xl w-fit">
                                            <DollarSign className="w-4 h-4" />
                                            <span>{formatSalary(job.job_salary_min, job.job_salary_max, job.job_currency, job.job_payment_period)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 pt-4 border-t border-gray-50 flex justify-between items-center">
                                    <div className="flex items-center text-[11px] text-gray-400 font-medium">
                                        <Calendar className="w-3.5 h-3.5 mr-1.5" />
                                        Deadline: 
                                        <span className="ml-1 text-red-500">
                                            {new Date(job.job_deadline).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <span className="text-sm text-indigo-500 font-bold group-hover:underline">
                                        View Details →
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                    <p className="text-gray-400 font-medium">No saved jobs yet.</p>
                    <Link to="/all-jobs" className="mt-4 inline-block text-indigo-600 font-bold hover:underline">
                        Start exploring jobs
                    </Link>
                </div>
            )}
        </div>
    );
}
    
    
