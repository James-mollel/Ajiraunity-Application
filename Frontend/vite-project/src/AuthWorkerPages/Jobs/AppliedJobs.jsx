

import { useContext, useEffect, useState } from "react";
import api from "../../AxiosApi/Api";
import FullScreenLoader from "../../Components/Loader";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { JobsCounterContext } from "../Context/JobsCounter";

import {
  Briefcase,
  MapPin,
  Calendar,
  ArrowRight,
  ClipboardCheck,
  Building2,
  User,
  Clock,
  Search,
  Star,
  Users,
  Award,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export default function AllAppliedJobsByJobSeeker() {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const {countAppliedJobs} = useContext(JobsCounterContext)

  // Status configuration with icons and colors
  const statusConfig = {
    PENDING: { label: "Applied", icon: Clock, color: "amber", bg: "bg-amber-50", text: "text-amber-700", ring: "ring-amber-200" },
    UNDER_REVIEW: { label: "In Review", icon: Search, color: "blue", bg: "bg-blue-50", text: "text-blue-700", ring: "ring-blue-200" },
    SHORTLISTED: { label: "Shortlisted", icon: Star, color: "purple", bg: "bg-purple-50", text: "text-purple-700", ring: "ring-purple-200" },
    INTERVIEW: { label: "Interview", icon: Users, color: "indigo", bg: "bg-indigo-50", text: "text-indigo-700", ring: "ring-indigo-200" },
    HIRED: { label: "Hired!", icon: Award, color: "green", bg: "bg-green-50", text: "text-green-700", ring: "ring-green-200" },
    REJECTED: { label: "Not Selected", icon: XCircle, color: "red", bg: "bg-red-50", text: "text-red-700", ring: "ring-red-200" },
  };

  const getStatusInfo = (status) => statusConfig[status] || statusConfig.PENDING;

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const { data } = await api.get("jobs/details/user/list-jobs/applications/");
        setAppliedJobs(data);

    
      } catch (err) {
        toast.error("Failed to load your applications");
      } finally {
        setLoading(false);
      }
    };
    fetchAppliedJobs();
  }, []);




  if (loading) return <FullScreenLoader />;




  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                My Applications
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-2xl font-bold text-lg shadow-lg shadow-blue-200">
                {countAppliedJobs} Active
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {countAppliedJobs === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-24 bg-white/70 backdrop-blur-sm rounded-3xl border border-gray-100 shadow-xl">
            <div className="p-8 bg-gray-100 rounded-full mb-8">
              <ClipboardCheck className="w-20 h-20 text-gray-300" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">No applications yet</h2>
            <p className="text-gray-500 text-center max-w-md mb-8">
              When you apply to jobs, they’ll appear here so you can track your progress.
            </p>
            <Link
              to="/all-jobs"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-3"
            >
              Browse Jobs
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        ) : (
          /* Job Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {appliedJobs.map((job) => {
              const status = getStatusInfo(job.status);
              const StatusIcon = status.icon;

              // Progress calculation (simple: based on status order)
              const progressSteps = ["PENDING", "UNDER_REVIEW", "SHORTLISTED", "INTERVIEW", "HIRED"];
              const currentIndex = progressSteps.indexOf(job.status);
              const progress = currentIndex === -1 ? 0 : ((currentIndex + 1) / progressSteps.length) * 100;

              return (
                <Link
                  key={job.id}
                  to={`/dashboard-user-job-seeker/view-applied-job/${job.id}`}
                  className="group block"
                >
                  <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                    {/* Status Badge + Progress Bar */}
                    <div className={`h-2 bg-gradient-to-r from-${status.color}-400 to-${status.color}-600`} style={{ width: `${progress}%` }} />

                    <div className="p-6">
                      {/* Top Row: Status + Code */}
                      <div className="flex justify-between items-start mb-5">
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${status.bg} ${status.text} font-bold text-xs uppercase tracking-wider shadow-sm ring-4 ${status.ring}`}>
                          <StatusIcon className="w-4 h-4" />
                          {status.label}
                        </div>
                        <span className="text-xs font-mono text-gray-400">#{job.job_code}</span>
                      </div>

                      {/* Job Title */}
                      <h3 className="text-xl font-extrabold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {job.job_title}
                      </h3>

                      {/* Company / Type */}
                      <div className="flex items-center gap-2 text-gray-600 mb-4">
                        {job.job_post_type === "COMPANY" ? (
                          <Building2 className="w-5 h-5 text-blue-500" />
                        ) : (
                          <User className="w-5 h-5 text-orange-500" />
                        )}
                        <span className="font-semibold">
                          {job.job_post_type === "COMPANY" ? job.job_company_name || "Company" : "Individual Employer"}
                        </span>
                      </div>

                      {/* Details */}
                      <div className="space-y-3 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="truncate">{job.job_region}, {job.job_district}, {job.job_ward}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>Applied {new Date(job.applied_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="mt-6 pt-5 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">View Details</span>
                          <ArrowRight className="w-5 h-5 text-blue-600 group-hover:translate-x-2 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}