import api from "../../AxiosApi/Api";
import { Link } from "react-router-dom";
import FullScreenLoader from "../../Components/Loader";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Filter, Briefcase, MapPin, Mail, ExternalLink, User } from "lucide-react"; // Optional: icons make it premium

export default function AllApplicationsPage() {
    const [load, setLoading] = useState(true);
    const [applications, setApplications] = useState([]);
    const [count, setCount] = useState(0);
    const [page, setPage] = useState(1);
    const [status, setStatus] = useState("");

    const [statusCount, setStatusCount] = useState({});

    const PAGE_SIZE = 10;

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const resp = await api.get(`jobs/details/employer/list/jobs-applicants/?page=${page}&status=${status}`);
            setApplications(resp.data.results);
            setCount(resp.data.count);

            setStatusCount(resp.data.status_counts || {})
        } catch (err) {
            toast.error(err.response?.data?.detail || "Failed to fetch applications.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, [page, status]);

    // Helper for status badge colors
    const getStatusStyle = (status) => {
        switch (status) {
            case 'PENDING': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'UNDER_REVIEW': return 'bg-orange-100 text-orange-700 border-orange-200';
            
            case 'HIRED': return 'bg-green-100 text-green-700 border-green-200';
            case 'REJECTED': return 'bg-red-100 text-red-700 border-red-200';

            case 'SHORTLISTED': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'INTERVIEW': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    if (load && page === 1) return <FullScreenLoader />;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen">
            {/* Header Section */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Job Applications</h1>
                <p className="text-gray-600">Manage and review candidates who applied to your listings.</p>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-wrap items-center gap-2">
                <div className="flex items-center text-gray-500 mr-4">
                    <Filter size={18} className="mr-2" />
                    <span className="font-medium text-sm">Filter Status:</span>
                </div>

                {["", "PENDING", "UNDER_REVIEW", "SHORTLISTED", "INTERVIEW", "HIRED", "REJECTED"].map((s) => {
                    // Get the count for this specific status
                    const countForStatus = s === "" ? statusCount.ALL : statusCount[s];
                    
                    return (
                        <button
                            key={s}
                            onClick={() => { setStatus(s); setPage(1); }}
                            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all border flex items-center gap-2 ${
                                status === s 
                                ? "bg-indigo-600 text-white border-indigo-600 shadow-md" 
                                : "bg-white text-gray-600 border-gray-300 hover:border-indigo-400"
                            }`}
                        >
                            <span>{s === "" ? "ALL" : s.replace("_", " ")}</span>
                            {/* The Count Badge */}
                            <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                                status === s ? "bg-indigo-500 text-white" : "bg-gray-100 text-gray-500"
                            }`}>
                                {countForStatus || 0}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Applications List */}
            {applications.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                    {applications.map((app) => {
                        const info = app.applicant_info;
                        const personal = info?.personal_info;

                        return (
                            <div key={app.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    {/* Avatar */}
                                    <img 
                                        src={personal?.avatar || <User size={28} className="text-indigo-500"/>} 
                                        alt="candidate" 
                                        className="w-14 h-14 rounded-lg object-cover border border-gray-100"
                                    />
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-lg font-bold text-gray-900">
                                                {personal?.first_name} {personal?.last_name}
                                            </h3>
                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusStyle(app.status)}`}>
                                                {app.status}
                                            </span>
                                        </div>
                                        
                                        <div className="flex flex-wrap gap-y-1 gap-x-4 mt-1 text-sm text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <Briefcase size={14} /> {info?.job_title || info?.title || "Worker"}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <MapPin size={14} /> {personal?.region}, {personal?.district}, {personal?.ward}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Mail size={14} /> {personal?.email}
                                            </span>
                                        </div>
                                        <div className="mt-2 text-xs text-gray-400 uppercase tracking-wider font-semibold">
                                            Applied for: <span className="text-indigo-600">{app.job_title} ({app.job_code})</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 ml-auto md:ml-0">
                                    <span className="text-xs text-gray-400 italic">
                                        Applied {new Date(app.applied_at).toLocaleDateString()}
                                    </span>
                                    <Link 
                                        to={`/dashboard-user-employer/view-application-details-employer/${app.id}`}
                                        className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-600 hover:text-white transition-colors"
                                    >
                                        Review <ExternalLink size={14} />
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                    <p className="text-gray-500 font-medium text-lg">No candidates found matching this criteria.</p>
                </div>
            )}

            {/* Professional Pagination */}
            <div className="mt-10 flex items-center justify-between border-t border-gray-200 pt-6">
                <button
                    disabled={page === 1}
                    onClick={() => {setPage(p => p - 1); window.scrollTo(0,0);}}
                    className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 transition-all"
                >
                    <ChevronLeft size={16} /> Previous
                </button>

                <div className="hidden sm:block">
                    <p className="text-sm text-gray-700">
                        Showing page <span className="font-semibold">{page}</span> of <span className="font-semibold">{Math.ceil(count / PAGE_SIZE)}</span>
                    </p>
                </div>

                <button
                    disabled={page * PAGE_SIZE >= count}
                    onClick={() => {setPage(p => p + 1); window.scrollTo(0,0);}}
                    className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 transition-all"
                >
                    Next <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
}