import { useState, useEffect } from "react";
import api from "../AxiosApi/Api";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import FullScreenLoader from "../Components/Loader";
import CreateCompanyModel from "./Companies/CreateCompany";
import { Plus, Building2, Briefcase, MapPin, Calendar, ArrowLeft } from "lucide-react";

export default function ConfirmCompanyToPostJob() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateCompany, setShowCreateCompany] = useState(false);
  // Key to force useEffect to re-run after a company is created
  const [refreshKey, setRefreshKey] = useState(0); 

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const resp = await api.get("jobs/users/company/user-list-creates/");
      setCompanies(resp.data);
    } catch (err) {
      if (err.response) {
        toast.error("Failed to fetch company details");
      } else {
        toast.error("Network error. Try again later");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [refreshKey]); // Re-fetch when refreshKey changes

  // Function to run after a company is successfully created
  const handleCompanyCreated = () => {
    setShowCreateCompany(false);
    setRefreshKey(prev => prev + 1); // Trigger refresh
  }

  if (loading) return <FullScreenLoader />;

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10 space-y-12 bg-white rounded-lg shadow-xl">
      {/* Header and Call to Action */}
      <div className="border-b pb-6">
        <div className="flex items-center space-x-8 mb-4 mt-8 md:mt-0">
          <ArrowLeft size={28} onClick={()=>navigate(-1)} className="cursor-pointer"/>
            <div className="flex items-center gap-3">
                    <Building2 className="w-6 h-6 md:w-10 md:h-10  text-indigo-600" />
                  <h1 className="text-xl md:text-2xl font-extrabold text-gray-900">
                      Company Verification
                 </h1>

            </div>
          
        </div>
        <p className="text-gray-600 text-sm italic">
       We require a registered Company Profile.
           This helps candidates trust your vacancy.
        </p>
      </div>

      {/* Main Content Area */}
      <div className="space-y-8">
        
        {/* Post Job Button (Primary Action) */}
        <button
            onClick={() =>
                navigate("/dashboard-user-employer/post-professional-career-jobs/")
            }
            disabled={companies.length === 0} // Disable if no companies
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
        >
            <Briefcase className="w-5 h-5" />
            Post Professional Job
        </button>

        {/* EMPTY STATE */}
        {companies.length === 0 && (
          <div className="rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50 p-8 space-y-6 text-center shadow-inner">
            <h2 className="text-2xl font-bold text-indigo-800">
              No Company Profile Found
            </h2>
            <p className="text-indigo-600 max-w-2xl mx-auto">
              Professional job seekers rely on a complete **Company Profile** to ensure the legitimacy and credibility of the job posting. Click below to quickly create your company profile and start posting jobs!
            </p>
            <button
              onClick={() => setShowCreateCompany(true)}
              className="flex items-center mx-auto gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Create First Company Profile
            </button>
          </div>
        )}
        
        {/* COMPANIES LIST */}
        {companies.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">
              Latest Companies ({companies.length})
            </h2>
            
            {/* Grid of Company Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {companies.slice(0, 3).map((comp) => (
                <div
                  key={comp.id}
                  className="p-5 rounded-xl border bg-white shadow-md hover:shadow-lg transition duration-200 space-y-3"
                >
                  <h3 className="font-extrabold text-gray-900 text-xl truncate" title={comp.name}>
                    {comp.name}
                  </h3>
                  
                  <div className="flex items-center text-gray-600 text-sm">
                    <MapPin className="w-4 h-4 mr-2 flex-shrink-0 text-indigo-500" />
                    <span className="truncate">{comp.address || "Address Not Available"}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-2 flex-shrink-0 text-indigo-500" />
                    <span>Founded: {comp.year_founded}</span>
                  </div>
                </div>
              ))}
              
              {/* Add Company Card */}
              {/* <button 
                onClick={() => setShowCreateCompany(true)} 
                className="flex flex-col items-center justify-center p-5 rounded-xl border-2 border-dashed border-gray-300 text-gray-600 hover:text-indigo-600 hover:border-indigo-400 transition duration-200 hover:bg-gray-50 h-full min-h-[150px]">
                <Plus className="w-8 h-8 mb-2" />
                <span className="font-semibold">Add New Company</span>
              </button> */}
            </div>
            
            <Link
              to="/dashboard-user-employer/list-all-companies-employer/"
              className="inline-flex items-center text-indigo-600 font-bold hover:text-indigo-800 transition"
            >
              View All {companies.length} Companies →
            </Link>
          </div>
        )}
      </div>

      {/* MODAL (Rendered outside the main flow) */}
      {showCreateCompany && (
        <CreateCompanyModel 
            onClose={() => setShowCreateCompany(false)}
            onCompanyCreated={handleCompanyCreated} // Pass the refresh callback
        />
      )}
    </div>
  );
}
