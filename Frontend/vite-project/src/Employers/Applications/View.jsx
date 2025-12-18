


import { useEffect, useState } from "react";
import api from "../../AxiosApi/Api";
import FullScreenLoader from "../../Components/Loader";
import toast from "react-hot-toast";
import { useParams, Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Globe,
  Link as LinkIcon,
  Download,
  Calendar,
  User,
  CalendarDays,
  Building2,
  Clock,
  DollarSign,
  CheckCircle,
} from "lucide-react";

  const backendURL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000"; 

export default function ViewApplicationDetails() {
  const { applicationId } = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
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
      const resp = await api.patch(
        `jobs/details/application/status/${applicationId}/update/`,
        { status: newStatus }
      );
      setApplication((prev) => ({ ...prev, status: newStatus }));
      toast.success(`Status updated to ${newStatus.replace("_", " ")}`);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <FullScreenLoader />;
  if (!application)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-gray-500">Application not found.</p>
      </div>
    );

  const info = application?.applicant_info || {};
  const personal = info?.personal_info || {};

  const statusConfig = {
    PENDING: { label: "Pending", color: "bg-amber-500" },
    UNDER_REVIEW: { label: "Under Review", color: "bg-purple-600" },
    SHORTLISTED: { label: "Shortlisted", color: "bg-blue-600" },
    INTERVIEW: { label: "Interview Scheduled", color: "bg-indigo-600" },
    HIRED: { label: "Hired", color: "bg-green-600" },
    REJECTED: { label: "Rejected", color: "bg-red-600" },
  };

  const currentStatus = statusConfig[application.status] || statusConfig.PENDING;

  const statusFlow = [
    { value: "PENDING", label: "Pending" },
    { value: "UNDER_REVIEW", label: "Review" },
    { value: "SHORTLISTED", label: "Shortlist" },
    { value: "INTERVIEW", label: "Interview" },
    { value: "HIRED", label: "Hire" },
    { value: "REJECTED", label: "Reject" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header: Back Link & Status */}
        <div className="mb-8">
          <Link
            to={-1}
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
          >
            ← Back to Applicants
          </Link>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Application Status
              </p>
              <div className="flex items-center gap-3">
                <span className={`px-4 py-2 rounded-full text-white font-bold text-sm ${currentStatus.color}`}>
                  {currentStatus.label}
                </span>
                <span className="text-2xl font-bold text-gray-800">
                  {personal.first_name} {personal.last_name}
                </span>
              </div>
              <p className="text-gray-600 mt-1">{info.job_title || info.title}</p>
            </div>

            <div className="flex flex-wrap gap-3">
              {statusFlow.map((status) => (
                <button
                  key={status.value}
                  onClick={() => updateStatus(status.value)}
                  disabled={updating || application.status === status.value}
                  className={`px-5 py-2.5 rounded-xl text-white font-semibold text-sm transition-all transform hover:scale-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 ${
                    status.value === "REJECTED"
                      ? "bg-red-600 hover:bg-red-700"
                      : status.value === "HIRED"
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                >
                  {updating && application.status !== status.value ? "..." : status.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <aside className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-32"></div>
              <div className="relative px-6 pb-8 -mt-16">
                <div className="flex flex-col items-center">
                  {personal.avatar ? (
                    <img
                      src={personal.avatar}
                      alt={`${personal.first_name} ${personal.last_name}`}
                      className="w-32 h-32 rounded-full object-cover border-6 border-white shadow-xl"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl border-6 border-white">
                      <User size={48} className="text-white" />
                    </div>
                  )}
                  <h2 className="mt-4 text-2xl font-bold text-gray-900">
                    {personal.first_name} {personal.last_name}
                  </h2>
                  <p className="text-indigo-600 font-medium">{info.job_title || info.title}</p>
                </div>

                <div className="mt-8 space-y-4 text-sm">
                  <div className="flex items-center gap-3 text-gray-700">
                    <Mail className="w-5 h-5 text-indigo-500" />
                    <span>{personal.email}</span>
                  </div>
                  {personal.phone_number && (
                    <div className="flex items-center gap-3 text-gray-700">
                      <Phone className="w-5 h-5 text-indigo-500" />
                      <span>{personal.phone_number}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-gray-700">
                    <MapPin className="w-5 h-5 text-indigo-500" />
                    <span>{personal.ward}, {personal.district}, {personal.region}</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-500 uppercase">Expected Salary</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {info.currency} {Number(info.salary).toLocaleString()}
                    <span className="text-sm font-normal text-gray-500"> /{info.payment_period_dispaly}</span>
                  </p>
                  {application.job_post_type === "INDIVIDUAL" && (
                    <p className="text-sm text-indigo-600 font-medium mt-2">
                      Available: {info.availability_display}
                    </p>
                  )}
                </div>

                {/* Social Links */}
                {application.job_post_type === "COMPANY" && (info.linkedIn || info.portfolio || info.gitHub) && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-sm font-semibold text-gray-600 mb-3">Connect</p>
                    <div className="flex justify-center gap-4">
                      {info.linkedIn && (
                        <a
                          href={info.linkedIn}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 bg-gray-100 rounded-xl hover:bg-indigo-100 text-gray-600 hover:text-indigo-600 transition-all"
                        >
                          <LinkIcon size={20} />
                        </a>
                      )}
                      {info.portfolio && (
                        <a
                          href={info.portfolio}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 bg-gray-100 rounded-xl hover:bg-indigo-100 text-gray-600 hover:text-indigo-600 transition-all"
                        >
                          <Globe size={20} />
                        </a>
                      )}
                      {info.gitHub && (
                        <a
                          href={info.gitHub}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 bg-gray-100 rounded-xl hover:bg-indigo-100 text-gray-600 hover:text-indigo-600 transition-all"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Info Card */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-indigo-600" /> Application Details
              </h3>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Applied On</span>
                  <span className="font-medium">{new Date(application.applied_at).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Method</span>
                  <span className="font-medium">{application.application_method_display}</span>
                </div>
                
                {application.job_post_type === "COMPANY" && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Experience</span>
                      <span className="font-medium">{info.experience_yrs_dispaly || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Employment Status</span>
                      <span className="font-medium">{info.employment_status_dispaly || "-"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Education Level</span>
                      <span className="font-medium">{info.education_level_dispaly || "-"}</span>
                    </div>
                  </>
                )}
                {application.cv && (
                  <a
                    href={application.cv}
                    download
                    className="mt-6 w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all"
                  >
                    <Download size={18} /> Download CV
                  </a>
                )}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-2 space-y-8">
            {/* Cover Letter */}
            <section className="bg-white rounded-2xl shadow-md border border-gray-200 p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <User className="w-6 h-6 text-indigo-600" />
                Cover Letter / Motivation
              </h3>
              <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed">
                <p className="whitespace-pre-line">
                  {application.cover_letter || info.description || "No cover letter or description provided."}
                </p>
              </div>
            </section>

            {/* Professional Sections (Only for Company Jobs) */}
            {application.job_post_type === "COMPANY" && (
              <>
                {/* Work Experience */}
                {info.experiences?.length > 0 && (
                  <section className="bg-white rounded-2xl shadow-md border border-gray-200 p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <Briefcase className="w-6 h-6 text-indigo-600" />
                      Work Experience
                    </h3>
                    <div className="space-y-8">
                      {info.experiences.map((exp, i) => (
                        <div key={i} className="flex gap-5">
                          <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-indigo-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900">{exp.role}</h4>
                            <p className="text-indigo-600 font-medium">
                              {exp.company} • {exp.location}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              {exp.start_date} — {exp.current_working ? "Present" : exp.end_date}
                            </p>
                            <p className="text-gray-700 mt-2">{exp.responsibilities}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Education */}
                {info.educations?.length > 0 && (
                  <section className="bg-white rounded-2xl shadow-md border border-gray-200 p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <GraduationCap className="w-6 h-6 text-indigo-600" />
                      Education
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {info.educations.map((edu, i) => (
                        <div key={i} className="bg-gradient-to-r from-indigo-50 to-purple-50 p-5 rounded-xl border border-indigo-100">
                          <h4 className="font-bold text-gray-900">{edu.degree || edu.education_level}</h4>
                          <p className="text-indigo-700 font-medium">{edu.school}</p>
                          {edu.field_of_study && <p className="text-gray-600 text-sm mt-1">{edu.field_of_study}</p>}
                          <p className="text-xs text-gray-500 mt-3 font-semibold">
                            {edu.start_year} – {edu.end_year || "Present"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Skills */}
                {info.skills?.length > 0 && (
                  <section className="bg-white rounded-2xl shadow-md border border-gray-200 p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-5">Skills</h3>
                    <div className="flex flex-wrap gap-3">
                      {info.skills.map((skill, i) => (
                        <span
                          key={i}
                          className="px-5 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm font-semibold border border-indigo-200"
                        >
                          {skill.skill}
                        </span>
                      ))}
                    </div>
                  </section>
                )}

                {/* Languages */}
                {info.languages?.length > 0 && (
                  <section className="bg-white rounded-2xl shadow-md border border-gray-200 p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-5">Languages</h3>
                    <div className="flex flex-wrap gap-3">
                      {info.languages.map((lang, i) => (
                        <span
                          key={i}
                          className="px-5 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold border border-purple-200"
                        >
                          {lang.language} — {lang.level}
                        </span>
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}