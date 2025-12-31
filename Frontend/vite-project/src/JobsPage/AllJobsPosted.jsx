import api from "../AxiosApi/Api";
import FullScreenLoader from "../Components/Loader";
import {toast} from "react-hot-toast";
// import { LoaderIcon, MapPin, Building2, DollarSign, Award, Heart, Briefcase, ChevronDown, BadgeInfo } from "lucide-react";
import { useEffect, useState } from "react";
import SuggestionsJobsSearch from "./SuggestionsJobs";
import {Link} from 'react-router-dom'

import {
  LoaderIcon, Search, MapPin, Building2, DollarSign, Award,
  Heart, Briefcase, BriefcaseBusiness, X, ChevronLeft, ChevronRight,
  BadgeInfo, Tags, Sparkles
} from "lucide-react";

// === Modern Job Card ===
const JobCard = ({ job }) => {
  const isIndividual = job.post_type === "INDIVIDUAL";
  const [saved, setSaved] = useState(job.is_job_saved || false);
  const [saveLoading, setSaveLoading] = useState(false);

  const handleSave = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    setSaveLoading(true);
    try {
      const { data } = await api.post("jobs/details/user/save-unsave/job/", { job_slug: job.slug });
      toast.success(data.message);
      setSaved(data.saved);

    } catch (err) {
      if (err.response){
                    const data = err.response.data;
                    
                    if (data.detail){
                        toast.error(data.detail);

                    } else if(typeof data === 'object'){
                        Object.entries(data).forEach(([key, value])=>{
                            const message = Array.isArray(value)? value.join(", ") : value;
                            toast.error(message)
                        });
                    }else{
                        toast.error("Unexpected error occur, Please try again later");
                    }
                }else{
                    toast.error("Network Error!.")
                }
    } finally {   
      setSaveLoading(false);
    }
  };

 const formatSalary = (min, max, currency, period) => {
    if (min || max) {
        const minStr = min ? Number(min).toLocaleString() : 'N/A';
        const maxStr = max ? Number(max).toLocaleString() : 'N/A';
        const periodStr = period ? `/${period.toLowerCase().replace('per ', '')}` : '';
        return `${currency} ${minStr} - ${maxStr} ${periodStr}`;
    }
    return "Negotiable";
  };

  return (
    <Link to={`/jobs-details/${job.slug}`} className="group bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-400 hover:-translate-y-2">
      {/* <div className={`h-2 ${isIndividual ? "bg-gradient-to-r from-pink-500 to-rose-500" : "bg-gradient-to-r from-indigo-500 to-purple-600"}`} /> */}

      <div className="p-6 space-y-5">
        <div className="flex justify-between items-start">
               <h3 className="text-xl font-bold hover:underline underline-offset-4 text-gray-900 group-hover:text-indigo-600 transition line-clamp-2">
                   {job.title}
               </h3>
          
         
          <span className={`px-3 py-1.5 text-xs font-bold rounded-full ${isIndividual ? "bg-pink-100 text-pink-700" : "bg-indigo-100 text-indigo-700"}`}>
            {isIndividual ? "Casual" : "Professional"}
          </span>
        </div>

       
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
          <MapPin className="w-4 h-4 text-indigo-500" />
          <span className="line-clamp-1">
            {job.region_name}
            {job.district_name && ` • ${job.district_name}`}
            {job.ward_name && ` • ${job.ward_name}`}
          </span>
        </div>

        {!isIndividual && job.company_name && (
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
              {job.company_logo ? (
                <img src={job.company_logo} alt="" className="w-full h-full object-cover" />
              ) : (
                <Building2 className="w-6 h-6 text-gray-500" />
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">{job.company_name}</p>
              <p className="text-xs text-gray-500">Company</p>
            </div>
          </div>
        )}

        <div className="mt-4 space-y-5">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
             <span className="text-sm py-1 px-2 bg-green-50 rounded-2xl text-green-600">{formatSalary(job.salary_min, job.salary_max, job.currency, job.payment_period_display)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-600" />
            <span className="text-sm text-gray-700 truncate">{job.experience_level_display || "Any Level"}</span>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Posted {new Date(job.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
         {job.deadline && (
          <>
            {" • "}Deadline: <span className="text-red-600 font-medium">
              {new Date(job.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </span>
          </>
        )}
          </p>

          <button
            onClick={handleSave}
            disabled={saveLoading}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            {saveLoading ? (
              <LoaderIcon className="w-6 h-6 animate-spin text-indigo-600" />
            ) : (
              <Heart className={`w-6 h-6 transition-all ${saved ? "fill-red-500 text-red-500 scale-110" : "text-gray-400 hover:text-red-500"}`} />
            )}
          </button>
        </div>
      </div>
    </Link>
  );
};

// === Main Page Component ===
export default function ListAllJobsPublic() {
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [meta, setMeta] = useState({});
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState("");
  const [postType, setPostType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchJobs = async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await api.get("jobs/users/public/jobs/lists/", {
        params: { query: query || null, type: searchType || null, post_type: postType || null, page }
      });
      setJobs(data.results || []);
      setMeta({ count: data.count, next: data.next, previous: data.previous });
      setCurrentPage(page);
    } catch (err) {
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(currentPage);
  }, [query, searchType, postType, currentPage]);

  const handleSuggestion = (item) => {
    setQuery(item.text);
    setSearchType(item.type);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setQuery(""); setSearchType(""); setPostType(""); setCurrentPage(1);
  };

  if (loading && jobs.length === 0) return <FullScreenLoader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Hero Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-4">
            Find Your Next Job
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
             Tafuta kazi kwa jina la kazi, eneo (mtaa au kata), kategoria, na zaidi kote Tanzania.
          </p>
        </header>

        {/* Search Bar */}
        <div className="max-w-4xl mx-auto mb-10">
          <SuggestionsJobsSearch onSelectSuggestion={handleSuggestion} initialQuery={query} />
        </div>

        {/* Filters & Results */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
          <div>
            <p className="text-2xl font-bold text-gray-800">
              {meta.count || 0} <span className="text-indigo-600">Jobs Available</span>
            </p>
            {query && <p className="text-sm text-gray-600 mt-1">Searching for: <strong className="text-indigo-700">"{query}"</strong></p>}
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            <button onClick={() => { setPostType(""); setCurrentPage(1); }}
              className={`px-6 py-3 rounded-xl font-semibold transition ${!postType ? "bg-indigo-600 text-white shadow-lg" : "bg-white text-gray-700 shadow"}`}>
              All Jobs
            </button>
            <button onClick={() => { setPostType("INDIVIDUAL"); setCurrentPage(1); }}
              className={`px-6 py-3 rounded-xl font-semibold transition flex items-center gap-2 ${postType === "INDIVIDUAL" ? "bg-pink-600 text-white shadow-lg" : "bg-white text-gray-700 shadow"}`}>
              <Briefcase className="w-5 h-5" /> Casual Jobs
            </button>
            <button onClick={() => { setPostType("COMPANY"); setCurrentPage(1); }}
              className={`px-6 py-3 rounded-xl font-semibold transition flex items-center gap-2 ${postType === "COMPANY" ? "bg-indigo-600 text-white shadow-lg" : "bg-white text-gray-700 shadow"}`}>
              <BriefcaseBusiness className="w-5 h-5" /> Professional Jobs
            </button>

            {(query || postType) && (
              <button onClick={resetFilters} className="px-5 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition font-medium">
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Job Grid */}
        <div className="relative">
          {loading && jobs.length > 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10 rounded-2xl">
              <LoaderIcon className="w-12 h-12 animate-spin text-indigo-600" />
            </div>
          )}

          {jobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {jobs.map(job => (
                <JobCard key={job.slug} job={job} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white rounded-3xl shadow-lg">
              <div className="text-6xl mb-6">Search</div>
              <p className="text-xl text-gray-600">No jobs found matching your search.</p>
              <button onClick={resetFilters} className="mt-6 px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition">
                Show All Jobs
              </button>
            </div>
          )}
        </div>

        {/* Pagination */}
        {meta.count > 0 && (
          <div className="flex justify-center items-center gap-4 mt-16">
            <button
              onClick={() => fetchJobs(currentPage - 1)}
              disabled={!meta.previous || loading}
              className="flex items-center gap-2 px-2 py-1 lg:px-6 lg:py-3 bg-white border-2 border-indigo-600 text-indigo-600 rounded-xl hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
            >
              <ChevronLeft className="w-5 h-5" /> 
            </button>

            <span className="px-2 py-1 lg:px-6 lg:py-3 bg-indigo-600 text-white rounded-xl font-bold">
               {currentPage}
            </span>

            <button
              onClick={() => fetchJobs(currentPage + 1)}
              disabled={!meta.next || loading}
              className="flex items-center gap-2 px-2 py-1 lg:px-6 lg:py-3 bg-white border-2 border-indigo-600 text-indigo-600 rounded-xl hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}