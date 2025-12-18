import FullScreenLoader from "../../Components/Loader";
import api from "../../AxiosApi/Api";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Briefcase, MapPin, Calendar, Building2,
  CheckCircle2, Clock, Search, Star, Users, Award, XCircle,
  FileText, Banknote, ArrowLeft, Download, Info, User
} from "lucide-react";

export default function ViewAppliedJob() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [appliedJob, setAppliedJob] = useState(null);

  const backendURL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000/";

  const statusSteps = [
    { id: "PENDING", label: "Applied", icon: Clock, color: "amber" },
    { id: "UNDER_REVIEW", label: "In Review", icon: Search, color: "blue" },
    { id: "SHORTLISTED", label: "Shortlisted", icon: Star, color: "purple" },
    { id: "INTERVIEW", label: "Interview", icon: Users, color: "indigo" },
    { id: "HIRED", label: "Hired", icon: Award, color: "green" },
  ];

  useEffect(() => {
    const fetchAppliedJob = async () => {
      try {
        const { data } = await api.get(`/jobs/details/user/view-applied-job/${jobId}/`);
        setAppliedJob(data);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load application");
      } finally {
        setLoading(false);
      }
    };
    fetchAppliedJob();
  }, [jobId]);

  if (loading) return <FullScreenLoader />;
  if (!appliedJob) return <div className="flex items-center justify-center min-h-screen text-gray-500">Application not found.</div>;

  const currentStepIndex = statusSteps.findIndex(s => s.id === appliedJob.status);
  const isRejected = appliedJob.status === "REJECTED";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Sticky Header */}
      <header className="bg-white/70 backdrop-blur-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex md:ml-0 ml-8 items-center gap-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
          >
            <div className="p-1.5 rounded-lg hover:bg-blue-50 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </div>
            Back
          </button>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            ID • <span className="text-blue-600 font-bold">{appliedJob.job_code}</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        {/* Status Section */}
        <section className="mb-10">
          {isRejected ? (
            <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-2xl p-6 flex items-center gap-4 shadow-sm">
              <div className="p-3 bg-red-500 rounded-xl shadow-lg shadow-red-200/50">
                <XCircle className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-red-900">Application Rejected</h2>
                <p className="text-red-700 mt-1">This position is no longer available. Keep exploring new opportunities!</p>
              </div>
            </div>
          ) : (
            <>
              {/* Desktop Horizontal Timeline */}
              <div className="hidden lg:block bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  {statusSteps.map((step, idx) => {
                    const Icon = step.icon;
                    const isActive = idx <= currentStepIndex;
                    const isCurrent = idx === currentStepIndex;

                    return (
                      <div key={step.id} className="flex-1 relative flex flex-col items-center">
                        {idx > 0 && (
                          <div className={`absolute top-6 left-0 w-full h-0.5 -translate-y-1/2 ${isActive ? "bg-blue-600" : "bg-gray-200"}`} />
                        )}
                        <div className={`relative z-10 w-12 h-12 flex items-center justify-center rounded-full transition-all duration-500 
                          ${isActive ? "bg-blue-600 text-white shadow-xl shadow-blue-200" : "bg-gray-100 text-gray-400 border-2 border-gray-200"}
                          ${isCurrent ? "ring-4 ring-blue-100 scale-110" : ""}`}
                        >
                          {isActive ? <CheckCircle2 className="w-7 h-7" /> : <Icon className="w-6 h-6" />}
                        </div>
                        <span className={`mt-4 text-xs font-extrabold uppercase tracking-wider ${isActive ? "text-blue-700" : "text-gray-400"}`}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Mobile Vertical Timeline */}
              <div className="lg:hidden bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-6">Application Status</h3>
                <div className="space-y-6">
                  {statusSteps.map((step, idx) => {
                    const Icon = step.icon;
                    const isActive = idx <= currentStepIndex;
                    const isCurrent = idx === currentStepIndex;

                    return (
                      <div key={step.id} className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all
                          ${isActive ? "bg-blue-600 text-white shadow-lg" : "bg-gray-100 text-gray-400"}`}
                        >
                          {isActive ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                        </div>
                        <div className="flex-1">
                          <p className={`font-semibold ${isActive ? "text-gray-900" : "text-gray-500"}`}>
                            {step.label}
                          </p>
                          {isCurrent && <span className="text-xs text-blue-600 font-medium">Current stage</span>}
                        </div>
                        {idx < statusSteps.length - 1 && (
                          <div className={`w-0.5 h-12 mx-auto ${isActive ? "bg-blue-600" : "bg-gray-200"}`} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Job Title Card */}
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-32"></div>
              <div className="relative -mt-16 px-8 pb-8">
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-blue-600 rounded-xl shadow-md">
                      <Briefcase className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Active Application</span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
                    {appliedJob.job_title}
                  </h1>
                  <div className="flex items-center gap-2 mt-4 text-gray-600">
                    <Building2 className="w-5 h-5" />
                    <span className="font-semibold">
                      {appliedJob.job_post_type === "COMPANY" ? appliedJob.job_company_name : "Individual Employer"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Application Materials */}
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 sm:p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <FileText className="w-6 h-6 text-indigo-600" />
                Your Application
              </h3>

              <div className="space-y-6">
                {/* Cover Letter */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                    Cover Letter
                  </label>
                  <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 text-gray-700 leading-relaxed min-h-[120px]">
                    {appliedJob.cover_letter || <span className="text-gray-400 italic">No cover letter provided.</span>}
                  </div>
                </div>

                {/* CV Download */}
                {appliedJob.cv && (
                  <a
                    href={appliedJob.cv}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <div className="flex items-center justify-between p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-dashed border-blue-200 rounded-2xl hover:border-blue-400 hover:from-blue-100 transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-100 rounded-xl">
                          <FileText className="w-8 h-8 text-red-600" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">Your Resume (CV)</p>
                          <p className="text-sm text-gray-600">Click to view or download</p>
                        </div>
                      </div>
                      <div className="p-3 bg-blue-600 text-white rounded-xl shadow-lg group-hover:bg-blue-700 transition-colors">
                        <Download className="w-5 h-5" />
                      </div>
                    </div>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Quick Info */}
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-5">Job Overview</h3>
              <dl className="space-y-4">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Type</dt>
                  <dd className="font-bold text-gray-900">{appliedJob.job_type || (appliedJob.job_post_type === "COMPANY" ? "Full-time" : "Casual")}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Applied Via</dt>
                  <dd className="font-bold text-gray-900">{appliedJob.application_method_display}</dd>
                </div>
                <div className="flex justify-between items-center">
                  <dt className="text-gray-600">Posted By</dt>
                  <dd className="flex items-center gap-2 font-bold">
                    {appliedJob.job_post_type === "COMPANY" ? <Building2 className="w-4 h-4 text-blue-600" /> : <User className="w-4 h-4 text-orange-600" />}
                    {appliedJob.job_post_type=== "COMPANY"? "Company":"Individual"}
                  </dd>
                </div>
                 <div className="flex justify-between items-center p-2 bg-gray-50 border rounded-xl">
                  <dt className="text-gray-600">Job Id</dt>
                  <dd className="flex items-center gap-2 font-bold">
                    {appliedJob.job_code}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Salary Card */}
            <div className="bg-gradient-to-br from-indigo-400 to-blue-500 rounded-3xl p-6 text-white shadow-xl">
              <div className="flex items-center gap-2 mb-4 opacity-90">
                <Banknote className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-widest">Salary Range</span>
              </div>
              <p className="text-3xl font-extrabold">
                {appliedJob.job_currency} {Number(appliedJob.job_salary_min).toLocaleString()} – {Number(appliedJob.job_salary_max).toLocaleString()}
              </p>
              <p className="mt-2 text-sm font-medium bg-white/20 px-3 py-1 rounded-lg inline-block">
                {appliedJob.job_payment_period}
              </p>
            </div>

            {/* Location Card */}
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center gap-2 text-red-600 mb-5">
                <MapPin className="w-5 h-5" />
                <h3 className="text-xs font-bold uppercase tracking-widest">Location</h3>
              </div>
              <div className="grid grid-cols-1 gap-3 text-sm">
                <div className="bg-gray-50 rounded-xl p-3 space-y-3 text-center">
                  <p className="text-xs text-gray-500 font-semibold">Region</p>
                  <p className="font-bold text-gray-900">{appliedJob.job_region}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 space-y-3 text-center">
                  <p className="text-xs text-gray-500 font-semibold">District</p>
                  <p className="font-bold text-gray-900">{appliedJob.job_district}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 space-y-3 text-center">
                  <p className="text-xs text-gray-500 font-semibold">Ward</p>
                  <p className="font-bold text-gray-900">{appliedJob.job_ward}</p>
                </div>
              </div>

              {appliedJob.job_company_name && (
                <div className="mt-5 pt-5 border-t border-gray-200">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Company</p>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center gap-2 text-gray-700">
                      <Info className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">{appliedJob.job_company_name}</span>
                    </p>
                    <p className="flex items-start gap-2 text-gray-600">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                      <span>{appliedJob.job_company_address || "Address not provided"}</span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}