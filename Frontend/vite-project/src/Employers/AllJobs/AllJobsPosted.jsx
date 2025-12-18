import { useCallback, useEffect, useState } from "react";
import api from "../../AxiosApi/Api";
import { toast } from "react-hot-toast";
import FullScreenLoader from "../../Components/Loader";
import { Loader2, Search, X, Eye,MessagesSquareIcon } from "lucide-react";
import { data, Link } from "react-router";

export default function AllJobsPostedByEmployer() {
  // main data
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // const [jobStatus, setJobStatus] = useState(null);

  // pagination
  const [page, setPage] = useState(1);
  const [prevUrl, setPrevUrl] = useState(null);
  const [nextUrl, setNextUrl] = useState(null);

  // filters & counts
  const [filters, setFilters] = useState({ post_type: "", status: "" });
  const [counts, setCounts] = useState({ all: 0, active: 0, pending: 0, closed: 0, company: 0, individual: 0 });

  // search modal state
  const [openSearchModal, setOpenSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // CLOSE JOB
  const [isCloseJobId, setIsCloseJobId] = useState(null);

  const handleCloseJob = async(id)=>{
    if(!confirm("Are you sure you want to close this job? You will no longer receive applications.")){
      return;
    }
 
    try{
      setIsCloseJobId(id);
      const resp = await api.post(`jobs/users/jobs/close-job-employer/${id}/close/`);
      setJobs((prevJobs)=> prevJobs.map((job)=>
             job.id === id ? {...job, status: "CLOSED"} : job
      ));

      fetchCounts();

      toast.success(resp.data.message)

    }catch(err){
      toast.error(err.response?.data?.detail || "Failed to close a job. Try again later" );
    }finally{
      setIsCloseJobId(null);
    }
  }

  // debounce for search input inside modal
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery), 350);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // fetch jobs (paginated + filter + search)
  const fetchJobs = useCallback(async () => {
    if (openSearchModal){
        return;
    }

    setLoading(true);
    try {
      const params = {
        page,
        page_size: 10,
        post_type: filters.post_type || undefined,
        status: filters.status || undefined,
        search: debouncedSearch && debouncedSearch.length > 2 ? debouncedSearch : undefined,
      };

      const resp = await api.get("jobs/users/jobs/all-jobs-list/", { params });

      setJobs(resp.data.results || []);
      setPrevUrl(resp.data.previous || null);
      setNextUrl(resp.data.next || null);
    } catch (err) {
      toast.error("Failed to fetch jobs. Try again later.");
    } finally {
      setLoading(false);
    }
  }, [page, filters, debouncedSearch, openSearchModal] );

  // fetch counts by making lightweight requests (page_size=1) for each filter
  const fetchCounts = useCallback(async () => {
    try {
      const getCount = async (params = {}) => {
        try {
          const r = await api.get("jobs/users/jobs/all-jobs-list/", { params: { ...params, page_size: 1 } });
          return r.data.count || 0;
        } catch (e) {
          return 0;
        }
      };

      const [allC, activeC, pendingC, closedC, companyC, individualC] = await Promise.all([
        getCount({}),
        getCount({ status: "ACTIVE" }),
        getCount({ status: "PENDING" }),
        getCount({ status: "CLOSED" }),
        getCount({ post_type: "COMPANY" }),
        getCount({ post_type: "INDIVIDUAL" }),
      ]);

      setCounts({ all: allC, active: activeC, pending: pendingC, closed: closedC, company: companyC, individual: individualC });
    } catch (err) {
      // don't block UI if counts fail
      if(err.response){
        toast.error("failed to fetch counts, Try again later")
      }else{
        toast.error("Network error");
      }
      
    }
  }, []);

  useEffect(() => {
    // initial load
    fetchJobs();
  }, [fetchJobs]);

  useEffect(()=>{
    fetchCounts();
  }, [fetchCounts]);

  // search suggestions (inside modal) — calls backend for suggestions
  useEffect(() => {
    const doSuggest = async () => {
      if (!debouncedSearch || debouncedSearch.length <= 2) {
        setSuggestions([]);
        return;
      }
      setSearchLoading(true);
      try {
        const r = await api.get("jobs/users/jobs/all-jobs-list/", { params: { search: debouncedSearch, page_size: 6 } });
        setSuggestions(r.data.results || []);
      } catch (e) {
        setSuggestions([]);
      } finally {
        setSearchLoading(false);
      }
    };

    doSuggest();
  }, [debouncedSearch]);

  const handleTabClick = (statusKey) => {
    setFilters((p) => ({ ...p, status: statusKey }));
    setPage(1);

    if (statusKey === ""){
        setSearchQuery("");
        setDebouncedSearch("");
    }
  };

  const handleTypeChange = (e) => {
    const value = e.target.value;
    setFilters((p) => ({ ...p, post_type: value}));
    setPage(1);
    
    if (value === ""){
        setSearchQuery("");
        setDebouncedSearch("");
    }


  };

  const handleSelectSuggestion = (item) => {
    // set search in modal and apply filter to list
    setSearchQuery(item.title || "");
    setOpenSearchModal(false);
    setDebouncedSearch(item.title || "");
    setPage(1);
  };

  if (loading) return <FullScreenLoader />;

  return (
    <div className="p-4 max-w-6xl mx-auto space-y-6">
      {/* Header card */}
      {/* Header card */}
<div className="bg-gray-50 rounded-2xl shadow-md p-6 border border-gray-100">
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

    {/* Tabs */}
    <nav className="flex gap-2 overflow-x-auto">
      {[
        { key: "", label: `All (${counts.all})` },
        { key: "PENDING", label: `Pending (${counts.pending})` },
        { key: "ACTIVE", label: `Active (${counts.active})` },
        { key: "CLOSED", label: `Closed (${counts.closed})` },
      ].map((t) => (
        <button
          key={t.key}
          onClick={() => handleTabClick(t.key)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap 
            ${filters.status === t.key 
              ? "bg-indigo-600 text-white shadow-md" 
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
        >
          {t.label}
        </button>
      ))}
    </nav>

    {/* select + search */}
    <div className="flex items-center gap-3">
      <div className="relative">
        <select
          value={filters.post_type}
          onChange={handleTypeChange}
          className="border px-3 py-2 rounded-lg shadow-sm text-sm bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">All Job Types ({counts.all})</option>
          <option value="COMPANY">Company ({counts.company})</option>
          <option value="INDIVIDUAL">Individual ({counts.individual})</option>
        </select>
      </div>

      <button
        onClick={() => setOpenSearchModal(true)}
        className="flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-lg hover:bg-indigo-100 transition shadow-sm"
      >
        <Search className="w-4 h-4" />
        <span className="text-sm">Search</span>
      </button>
    </div>
  </div>
</div>

      {/* List */}
      <div className="grid grid-cols-1 gap-4">
        {jobs.length === 0 ? (
          <div className="p-6 bg-white rounded-lg border text-center text-gray-500">No jobs found.</div>
        ) : (
          jobs.map((job) => (
        <article
             key={job.id}
            className="p-6 bg-white rounded-xl border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5" // More pronounced hover effect
         >
  <div className="flex flex-col sm:flex-row justify-between gap-6">

    {/* Left: Main Info */}
    <div className="flex-1 space-y-2">
      <h3 className="text-xl font-bold text-gray-900 leading-tight">{job.title}</h3>

      <p className="text-sm text-indigo-600 font-medium">
        {job.company?.name || "Individual Posting"}
        <span className="text-gray-400 mx-2">•</span>
        <span className="text-gray-500">#{job.code}</span>
      </p>

      <p className="text-sm text-gray-600 mt-3 line-clamp-2"> {/* Using line-clamp utility */}
        {job.job_summary || "No summary provided."}
      </p>
    </div>

    {/* Right: Stats & Deadline */}
    <div className="flex flex-row sm:flex-col justify-between sm:w-48 sm:text-right gap-4">
        {/* Stats */}
        <div className="flex sm:flex-col sm:space-y-2 space-x-4 sm:space-x-0 text-sm text-gray-600">
            <div className="flex items-center justify-end gap-1.5">
                <Eye className="w-4 h-4 text-indigo-500"/> 
                <span>Views: <strong className="text-gray-800">{job.views}</strong></span>
            </div>
            <div className="flex items-center justify-end gap-1.5">
                <MessagesSquareIcon className="w-4 h-4 text-indigo-500"/> 
                <span>Applied: <strong className="text-gray-800">{job.applied}</strong></span>
            </div>
        </div>
        
        {/* Deadline */}
        <div className="text-sm sm:mt-auto">
            <p className="text-xs text-gray-400">Deadline</p>
            <p className="font-semibold text-red-500">{job.deadline}</p>
        </div>
    </div>
  </div>

  {/* Footer: Status and Actions */}
  <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
    <span
      className={`px-3 py-1 rounded-full text-xs font-bold ring-1 
      ${
        job.status === "ACTIVE"
          ? "bg-green-50 text-green-700 ring-green-300"
          : job.status === "CLOSED"
          ? "bg-red-50 text-red-700 ring-red-300"
          : "bg-yellow-50 text-yellow-700 ring-yellow-300"
      }`}
    >
      {job.status}
    </span>{job.status === "ACTIVE" && (
                       <button
                            disabled={isCloseJobId === job.id}
                            onClick={() => handleCloseJob(job.id)}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 disabled:opacity-50 transition border border-red-200"
                           >
                           {isCloseJobId === job.id ? (
                            <>
                              <Loader2 className="w-3 h-3 animate-spin" />
                              <span>Closing...</span>
                          </>
                       ) : (
                        <>
                            <X className="w-3 h-3" />
                            <span>Close Job</span>
                        </>
                           )}
                        </button>
                       )} 
    
    <div className="flex items-center gap-3">
        <span className="text-xs text-gray-400">
            Posted: {new Date(job.created_at).toLocaleDateString()}
        </span>
        <div>
           {job.post_type === "COMPANY"? (
            <Link to={`/dashboard-user-employer/view-company-job-detail/${job.id}`}
               className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-md" >
               View Details
            </Link>
           ):(
            <Link to={`/dashboard-user-employer/view-normal-job-detail/${job.id}`}
              className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-md" >
                View Details
              </Link>
           ) }
        </div>
        
    </div>
  </div>
</article>

          ))
        )}
      </div>

      {/* pagination */}
      <div className="flex items-center justify-center gap-3">
        <button disabled={!prevUrl} onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-4 py-2 border rounded disabled:opacity-50">Prev</button>
        <button disabled className="px-4 py-2 border rounded bg-gray-50">Page {page}</button>
        <button disabled={!nextUrl} onClick={() => setPage((p) => p + 1)} className="px-4 py-2 border rounded disabled:opacity-50">Next</button>
      </div>

      {/* Search Modal */}
      {openSearchModal && (
  <div className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center p-4">
    <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl mt-20 animate-slide-up border">

      {/* Header */}
      <div className="p-4 border-b flex items-center gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search jobs by title, code or company…"
            className="w-full px-4 py-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
          {searchLoading && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-600 animate-spin" />
          )}
        </div>

        <button
          onClick={() => { setOpenSearchModal(false); setSearchQuery(""); setSuggestions([]); }}
          className="p-2 rounded-md hover:bg-gray-100"
        >
          <X className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Suggestions */}
      <div className="p-4 max-h-72 overflow-y-auto">
        {suggestions.length === 0 ? (
          <p className="text-sm text-gray-500">Type 3+ characters to see suggestions.</p>
        ) : (
          suggestions.map((s) => (
            <div
              key={s.id}
              className="p-3 hover:bg-indigo-50 rounded-lg cursor-pointer transition"
              onClick={() => handleSelectSuggestion(s)}
            >
              <p className="font-medium text-gray-900">{s.title}</p>
              <p className="text-sm text-gray-500">{s.company?.name || "Individual"} • #{s.code}</p>
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t flex justify-end">
        <button
          onClick={() => { setOpenSearchModal(false); setSearchQuery(""); setSuggestions([]); }}
          className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}

