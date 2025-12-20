import {
  Pencil,
  Briefcase,
  DollarSign,
  Clock,
  CheckSquare,
  Users,
  Globe,
  ClipboardList,
  Link as LinkIcon,
  FileText,
} from "lucide-react";

export default function ViewProfessionalCarrer({ data, onEdit }) {
  const PublicStatus = ({ isVisible }) => (
    <span
      className={`inline-flex items-center px-3 py-1.5 text-sm font-semibold rounded-full shadow-sm transition-all
        ${
          isVisible
            ? "bg-emerald-100 text-emerald-700"
            : "bg-rose-100 text-rose-700"
        }`}
    >
      <Globe className="w-4 h-4 mr-1.5 opacity-80" />
      {isVisible ? "Publicly Visible" : "Private"}
    </span>
  );

  const backendURL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";
  const fileUrl = data.current_cv ? data.current_cv : null

  


  // Salary formatting
  const formattedSalary =
    data.prof_salary && data.prof_currency
      ? `${data.prof_currency} ${Number(data.prof_salary).toLocaleString()}`
      : "-";

  const careerFacts = [
    {
      icon: Briefcase,
      label: "Category",
      value: data.category?.display_name || "Not provided",
    },
    {
      icon: DollarSign,
      label: "Expected Salary",
      value: formattedSalary,
    },
    {
      icon: Clock,
      label: "Payment Period",
      value: data.payment_period_display || "Not provided",
    },
    {
      icon: FileText,
      label: "Current CV",
      value: data.current_cv ? (
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 underline"
        >
          Download CV
        </a>
      ) : (
        "Not uploaded"
      ),
    },
    {
      icon: CheckSquare,
      label: "Employment Status",
      value: data.employment_status_display || "Not provided",
    },
    {
      icon: CheckSquare,
      label: "Experience Years",
      value: data.experience_yrs_display || "Not provided",
    },
    {
      icon: CheckSquare,
      label: "Education Level",
      value: data.education_level_display || "Not provided",
    },
    {
      icon: LinkIcon,
      label: "LinkedIn",
      value: data.linkedIn ? (
        <a
          href={data.linkedIn}
          target="_blank"
          className="text-indigo-600 text-sm underline"
        >
          {data.linkedIn}
        </a>
      ) : (
        "Not provided"
      ),
    },
    {
      icon: LinkIcon,
      label: "Portfolio",
      value: data.portfolio ? (
        <a
          href={data.portfolio}
          target="_blank"
          className="text-indigo-600 text-sm underline"
        >
          {data.portfolio}
        </a>
      ) : (
        "Not provided"
      ),
    },
    {
      icon: LinkIcon,
      label: "GitHub",
      value: data.gitHub ? (
        <a
          href={data.gitHub}
          target="_blank"
          className="text-indigo-600 text-sm underline"
        >
          {data.gitHub}
        </a>
      ) : (
        "Not provided"
      ),
    },
  ];

  return (
    <div className="w-full flex justify-center py-10 px-4 bg-gray-100 min-h-screen">
      <div className="w-full max-w-2xl bg-white rounded-3xl p-6 md:p-10 shadow-xl border border-gray-100">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b pb-8 mb-10">
          <div className="space-y-4">
            <div className="space-y-1">
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
                {data.job_title || "Career Profile"}
              </h1>
            </div>

            <div className="flex items-center space-x-2">
              <span className="uppercase text-[11px] font-semibold tracking-wider text-gray-500">
                Profile Status
              </span>
              <PublicStatus isVisible={data.public_visible} />
            </div>
          </div>

          <button
            onClick={onEdit}
            className="flex items-center px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl shadow-md
              hover:bg-indigo-700"
          >
            <Pencil className="w-5 h-5 mr-2" />
            Edit
          </button>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          {careerFacts.map((fact, index) => (
            <div
              key={index}
              className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-100"
            >
              <fact.icon className="w-6 h-6 text-indigo-500 mt-1" />
              <div>
                <span className="text-sm text-gray-500">{fact.label}</span>
                <p className="text-lg font-semibold text-gray-800">
                  {fact.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Description */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 flex items-center mb-3">
            <ClipboardList className="w-5 h-5 text-indigo-600 mr-2" />
            Job Description
          </h3>

          <p className="text-gray-600 bg-gray-50 p-5 rounded-xl border border-dashed border-gray-300 whitespace-pre-line">
            {data.prof_description || "This user has not written a job description yet."}
          </p>
        </div>
      </div>
    </div>
  );
}
