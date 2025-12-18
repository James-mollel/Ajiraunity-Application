import {
  Pencil,
  Briefcase,
  DollarSign,
  Clock,
  CheckSquare,
  Users,
  Globe,
  ClipboardList,
} from "lucide-react";

export default function UserViewCareer({ data, onEdit }) {
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

  // Format salary display: "TZS 20,000"
  const formattedSalary =
    data.salary && data.currency
      ? `${data.currency} ${Number(data.salary).toLocaleString()}`
      : data.salary || "-";

  const careerFacts = [
    {
      icon: Briefcase,
      label: "Category",
      value: data.category?.display_name || "-",
    },
    {
      icon: DollarSign,
      label: "Expected Salary",
      value: formattedSalary,
    },
    {
      icon: Clock,
      label: "Payment Period",
      value: data.payment_period_display || data.payment_period || "-",
    },
    {
      icon: Users,
      label: "Experience Level",
      value: data.experience_level_display || data.experience_level || "-",
    },
    {
      icon: CheckSquare,
      label: "Availability",
      value: data.availability_display || data.availability || "-",
    },
  ];

  return (
    <div className="w-full flex justify-center py-10 px-4 bg-gradient-to-b from-gray-100 to-gray-200 min-h-screen">
      <div className="w-full max-w-2xl bg-white rounded-3xl p-6 md:p-10 shadow-xl border border-gray-100 transition-all duration-300 hover:shadow-2xl">

          {/* Header Section */}
        <div className="flex justify-between items-start border-b pb-8 mb-10">
          <div className="space-y-4">

            {/* Title Section */}
            <div className="space-y-1">

              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight drop-shadow-sm">
                {data.title || "Career Profile"}
              </h1>
            </div>

            {/* Profile Status */}
            <div className="flex items-center space-x-2">
              <span className="uppercase text-[11px] font-semibold tracking-wider text-gray-500">
                Profile Status
              </span>

              <PublicStatus isVisible={data.public_visible} />
            </div>
          </div>

          {/* Edit Button */}
          <button
            onClick={onEdit}
            className="flex items-center px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl shadow-md
              hover:bg-indigo-700 hover:shadow-lg transition-all duration-300 active:scale-95
              border border-indigo-500/20"
          >
            <Pencil className="w-5 h-5 mr-2 opacity-90" />
            Edit
          </button>
        </div>



        {/* Key Facts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          {careerFacts.map((fact, i) => (
            <div
              key={i}
              className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
            >
              <fact.icon className="w-6 h-6 text-indigo-500 mt-1 flex-shrink-0" />
              <div>
                <span className="text-sm text-gray-500">{fact.label}</span>
                <p className="text-lg font-semibold text-gray-800 leading-snug">
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

          <p className="text-gray-600 bg-gray-50 p-5 rounded-xl leading-relaxed border border-dashed border-gray-300 shadow-inner whitespace-pre-line">
            {data.description || "No detailed description provided."}
          </p>
        </div>
      </div>
    </div>
  );
}
