import { useEffect, useState } from "react";
import api from "../../AxiosApi/Api";
import { toast } from "react-hot-toast";
import FullScreenLoader from "../../Components/Loader";
import { Building2, Plus, Eye, Calendar, MapPin, CheckCircle2, Clock, Search } from "lucide-react";
import { Link } from "react-router-dom";
import CreateCompanyModel from "./CreateCompany";

 // Add a fallback logo

export default function ListAllCompanies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateCompany, setShowCreateCompany] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const resp = await api.get("jobs/users/company/user-list-creates/");
      setCompanies(resp.data || []);
    } catch (err) {
      toast.error("Failed to load companies. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [refreshKey]);

  const handleCompanyCreated = () => {
    setShowCreateCompany(false);
    setRefreshKey(prev => prev + 1);
    toast.success("Company created successfully!");
  };

  if (loading) return <FullScreenLoader />;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
        {/* Header Section */}
        <div className="px-4 sm:px-6 lg:px-8 py-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10">
              <div className="mt-7 lg:mt-0">
                <h1 className="text-xl lg:text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                  <Building2 className=" w-6 h-6 lg:w-10  lg:h-10 text-indigo-600" />
                  Your Companies
                </h1>
                <p className="mt-2 text-sm text-gray-600 italic">
                  Manage and showcase the companies you've created <strong>({companies.length}/5) </strong> 
                </p>
              </div>

            <button
                    onClick={() => setShowCreateCompany(true)}
                    disabled={companies.length >= 5}
                    // Focus on accessibility and overall styling
                    className={`
                        relative flex items-center justify-center gap-3 px-6 py-3.5 
                        rounded-xl font-bold text-base transition-all duration-300 transform 
                        shadow-lg focus:outline-none focus:ring-4 focus:ring-opacity-50
                        w-full sm:w-auto

                        ${companies.length >= 5
                        ? // DISABLED STATE: Clear gray, subdued
                        "bg-gray-300 text-gray-600 cursor-not-allowed shadow-none"
                        : // ENABLED STATE: Vibrant gradient, polished hover
                        "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-indigo-500/40 " +
                        "hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl hover:scale-[1.02] " +
                        "focus:ring-indigo-500" // Added focus ring for accessibility
                        }
                    `}
                    >
                    {companies.length >= 5 ? (
                        // Disabled content structure
                        <div className="flex items-center">
                        <span className="text-sm">Limit Reached (Max 5)</span>
                        </div>
                    ) : (
                        // Enabled content structure - Use a single block for better flow
                        <>
                        <Plus className="w-5 h-5 transition-transform duration-300" />
                        <span className="flex flex-col items-start leading-none">
                            Create New Company
                            <span className="font-normal text-xs opacity-80 mt-1">
                            {5 - companies.length} Slot(s) Remaining
                            </span>
                        </span>
                        </>
                    )}
                    </button>
            </div>

            {/* Empty State */}
            {companies.length === 0 ? (
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-16 text-center max-w-2xl mx-auto mt-20">
                <div className="w-24 h-24 mx-auto mb-6 bg-indigo-100 rounded-full flex items-center justify-center">
                  <Building2 className="w-12 h-12 text-indigo-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">No companies yet</h3>
                <p className="text-gray-600 mb-8">
                  Start building your employer brand by creating your first company profile.
                </p>
                <button
                  onClick={() => setShowCreateCompany(true)}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                  Create Your First Company
                </button>
              </div>
            ) : (
              /* Companies Grid */
              <div className="grid grid-cols-1 lg:grid-cols-3  gap-7">
                {companies.map((comp, index) => (
                  <article
                    key={comp.id}
                    className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Logo & Header */}
                    <div className="relative p-6 bg-gradient-to-br from-indigo-50 to-purple-50">
                      <div className="flex items-start justify-between">
                        <div className="w-20 h-20 bg-white rounded-2xl shadow-md p-3 flex items-center justify-center border border-gray-200">
                          {comp.logo_url ? (
                            <img
                              src={comp.logo_url}
                              alt={`${comp.name} logo`}
                              className="w-full h-full object-contain rounded-lg"
                            />
                          ) : (
                            <Building2 className="w-12 h-12 text-indigo-600" />
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          {comp.is_verified ? (
                            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                              <CheckCircle2 className="w-4 h-4" />
                              Verified
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">
                              <Clock className="w-4 h-4" />
                              Pending
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                      <div>
                        <h3 className="text-xl font-extrabold text-gray-900 line-clamp-1">
                          {comp.name}
                        </h3>
                        <p className="text-sm font-medium text-indigo-600 mt-1">
                          {comp.industry || "Technology"}
                        </p>
                      </div>

                      <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                        {comp.description || "No description added yet. Complete your company profile to attract top talent."}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        {comp.year_founded && (
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            {comp.year_founded}
                          </span>
                        )}
                        {comp.address && (
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4" />
                            {comp.address.split(",")[0]}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 pb-6 pt-2 flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        Created {new Date(comp.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </span>

                      <Link
                        to={`/dashboard-user-employer/view-company-detail/${comp.id}`}
                        className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal */}
        {showCreateCompany && (
          <CreateCompanyModel
            onClose={() => setShowCreateCompany(false)}
            onCompanyCreated={handleCompanyCreated}
          />
        )}
      </div>
    </>
  );
}