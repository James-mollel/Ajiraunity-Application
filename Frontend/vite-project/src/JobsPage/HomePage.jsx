import { useState, useEffect } from "react";
import api from "../AxiosApi/Api";
import FullScreenLoader from "../Components/Loader";
import { toast } from "react-hot-toast";
import { Building2, MapPin, Briefcase, DollarSign, Search, ArrowRight , BriefcaseIcon,Award} from "lucide-react";
import JobCard from "./JobComponent";
import { Link } from "react-router";


// Helper function to format salary nicely



const suggestions = [
  "Search jobs by regions eg. Dar es Salaam, Arusha, Mwanza...",
  "Search jobs by districs eg. Arumeru, Bukoba, Chamwino, Ilala....",
  "Search by Wards eg. Baraa, Ilboru, Bonyokwa,  Gongo La Mboto ..",
  "Find Software Engineers, Accountants, Managers...",
  "Looking for fundi, dada wa kazi, drivers?",
];

export default function HomePage() {
  const [currentSuggestion, setCurrentSuggestion] = useState(0);
  const [fade, setFade] = useState(true);
  const [loading, setLoading] = useState(true);

    const [formalJobs, setFormalJobs] = useState([]);
    const [individualJobs, setIndividualJobs] = useState([]);

    const fetchJobs = async (type, setter) => {
        try {
            const resp = await api.get(`/jobs/users/public/jobs/lists/?post_type=${type}&page_size=3`);
            setter(resp.data.results || []); 
        } catch (err) {
            console.error(`Failed to fetch ${type} jobs:`, err);
            // Show only one general toast error to avoid spamming
            if (loading) toast.error("Failed to load some job sections. Please check connection.");
        }
    };

    const fetchPublicJobs = async () => {
        setLoading(true);
        // Fetch both types in parallel for faster loading
        await Promise.all([
            fetchJobs("COMPANY", setFormalJobs),
            fetchJobs("INDIVIDUAL", setIndividualJobs)
        ]);
        setLoading(false);
    };

    // Initial data fetch
    useEffect(() => {
        fetchPublicJobs();
    }, []);

  

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentSuggestion((prev) => (prev + 1) % suggestions.length);
        setFade(true);
      }, 500);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  if (loading) return <FullScreenLoader />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* HERO SECTION - Modern & Stunning */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-blue-950 to-indigo-950 text-white py-24 md:py-32">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0 bg-grid-white/10 bg-grid"></div>

        <div className="relative max-w-5xl mx-auto px-6 text-center space-y-10">
          <div className="space-y-5">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight animate-fade-in">
              Opportunities for <span className="text-teal-400">Everyone </span>
              <br className="hidden sm:block" />
              From Street to Suite
            </h1>
              <p className="text-indigo-100 text-lg md:text-xl max-w-2xl mx-auto">
                       Find 
                     <span className="text-cyan-400 font-semibold"> casual daily tasks </span> 
                          and 
                   <span className="text-indigo-300 font-semibold"> professional careers </span> 
                        near you — all in one place.
                     </p>
            
          </div>

                    {/* ULTRA RESPONSIVE & MODERN SEARCH BAR - Works perfectly on ALL devices */}
          <Link to="/all-jobs" className="w-full max-w-4xl mx-auto px-4 sm:px-0">
            <div className="relative group">
              {/* Subtle animated glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition duration-700"></div>

              {/* Main Search Container */}
              <div className="relative bg-white/90 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
                
                <div className="flex flex-col sm:flex-row items-stretch w-full">
                  
                  {/* Input + Icon + Suggestion Text */}
                  <div className="relative flex-1 flex items-center">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-indigo-600 z-10" />
                    
                    {/* Animated Suggestion Text */}
                    <span
                      className={`absolute left-14 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none
                        text-sm sm:text-base transition-all duration-700 origin-left
                        ${fade ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
                    >
                      {suggestions[currentSuggestion]}
                    </span>

                    <input
                      type="text"
                      className="w-full px-14 py-5 sm:py-6 text-gray-800 text-base sm:text-sm
                                bg-transparent focus:outline-none placeholder-gray-400
                                transition-all duration-300"
                      onFocus={(e) => e.target.placeholder = ""}
                      onBlur={(e) => e.target.placeholder = "Search jobs, titles, locations..."}
                    />
                  </div>

                  {/* Search Button - Full width on mobile, inline on larger screens */}
                  <div className="sm:w-auto w-full sm:border-l border-gray-200">
                    <button
                      className="w-full sm:w-auto px-10 sm:px-12 py-5 sm:py-6 
                                bg-gradient-to-r from-indigo-600 to-purple-600 
                                hover:from-indigo-700 hover:to-purple-700 
                                text-white font-bold text-base sm:text-lg
                                rounded-xl sm:rounded-none sm:rounded-r-2xl
                                transition-all duration-300 flex items-center justify-center gap-3
                                shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                    >
                      <span className="hidden sm:inline">Search Jobs</span>
                      <span className="sm:hidden">Search</span>
                      <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

          

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <a
                href="/jobs/company"
                className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-full hover:bg-indigo-700 transition-all shadow-lg flex items-center gap-2"
              >
                <Building2 className="w-5 h-5" />
                Professional Jobs
              </a>
              <a
                href="/jobs/individual"
                className="px-8 py-4 bg-pink-500 text-white font-bold rounded-full hover:bg-pink-700 transition-all shadow-lg flex items-center gap-2"
              >
                <Briefcase className="w-5 h-5" />
                Casual Jobs
              </a>
            </div>
          </Link>


        </div>

  
      </section>

     <section className="max-w-7xl mx-auto px-6 py-20 space-y-24">
        {/* Professional Jobs */}
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
                Featured <span className="text-indigo-600"> Professional Jobs</span>
              </h2>
                <p className="text-gray-500 mt-2 text-sm">Explore high-impact career opportunities.</p>
            </div>
            <a href="/all-jobs" className="text-indigo-600 font-semibold hover:text-indigo-800 flex items-center gap-1">
              View All <ArrowRight className="w-5 h-5" />
            </a>
          </div>

          {formalJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {formalJobs.map((job) => (
                <JobCard key={job.slug} job={job} isIndividual={false} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500">No professional jobs available at the moment.</div>
          )}
        </div>

        {/* Individual / Local Jobs */}
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
                Featured Local & <span className="text-pink-500">Casual Jobs</span>
              </h2>
                <p className="text-gray-500 mt-2 text-sm">Find flexible work and daily tasks near you.</p>
            </div>
            <a href="/all-jobs" className="text-pink-600 font-semibold hover:text-pink-800 flex items-center gap-1">
              View All <ArrowRight className="w-5 h-5" />
            </a>
          </div>

          {individualJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {individualJobs.map((job) => (
                <JobCard key={job.slug} job={job} isIndividual={true} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500">No causal & local jobs available right now.</div>
          )}
        </div>
      </section>

    </div>
  );
}