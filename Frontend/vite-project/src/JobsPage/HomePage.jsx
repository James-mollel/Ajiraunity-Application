import { useState, useEffect } from "react";
import api from "../AxiosApi/Api";
import FullScreenLoader from "../Components/Loader";
import { toast } from "react-hot-toast";
import {
         MapPin, DollarSign,
          Search, ArrowRight, Building2, 
        Briefcase, CheckCircle2, Users,
        BriefcaseIcon,Award,  Globe,  Zap,  MessageSquare, 
    Navigation, Store
       } from "lucide-react";

import JobCard from "./JobComponent";
import { Link } from "react-router";
import FAQ from "./FAQNs";


// Helper function to format salary nicely







  const features = [
    {
      title: "Uhuru wa Fursa Zote",
      description: "Kuanzia kazi za mtaani na nyumbani (fundi, dada wa kazi, muuza duka) hadi za kitaaluma (Accountant, Doctor, IT). Zote unaweza kutafuta na kutangaza ndani ya Ajira Unity",
      icon: <div className="flex gap-1"><Store className="w-6 h-6 text-emerald-400" /><Briefcase className="w-6 h-6 text-indigo-400" /></div>,
      grid: "md:col-span-2",
      bg: "from-emerald-500/10 to-indigo-500/10"
    },
    {
      title: "Rahisi kwa Kila Mtu",
      description: "Uwe kampuni au mtu binafsi, tangaza fursa za kazi kwa dakika chache na upate mfanyakazi sahihi kwa haraka.",
      icon: <Zap className="w-8 h-8 text-yellow-400" />,
      grid: "md:col-span-1",
      bg: "from-yellow-500/10 to-orange-500/10"
    },
    {
      title: "Chagua Njia ya Kupokea Maombi",
      description: "Pokea maombi ya kazi kwa njia unayopendelea: WhatsApp, Email, au moja kwa moja kupitia mfumo wetu wa AjiraUnity.",
      icon: <MessageSquare className="w-8 h-8 text-blue-400" />,
      grid: "md:col-span-1",
      bg: "from-blue-500/10 to-cyan-500/10"
    },
    {
      title: "Tangaza Kazi Kwenye Eneo Sahihi",
      description: "Lenga wahitaji hadi ngazi ya Kata (mfano: Dar es Salaam, Ilala, Buguruni). Tangaza fursa yako kwenye eneo husika ili kuwafikia watu sahihi kwa haraka.",
      icon: <MapPin className="w-8 h-8 text-red-400" />,
      grid: "md:col-span-1",
      bg: "from-red-500/10 to-pink-500/10"
    },
    {
      title: "Tafuta Kazi Karibu na Wewe",
      description: "Tafuta kazi kwa jina la kata au mtaa. Omba fursa zilizopo karibu nawe kwa urahisi na uharakishe safari yako ya kupata ajira wakati wowote.",
      icon: <Navigation className="w-8 h-8 text-purple-400" />,
      grid: "md:col-span-1",
      bg: "from-purple-500/10 to-indigo-500/10"
    }
  ];

 



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


      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-slate-50 text-slate-900 pt-20 pb-16">
  {/* Background Orbs for Depth - Softer and more pastel */}
  <div className="absolute top-0 -left-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>
  <div className="absolute bottom-0 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>
  
  {/* Subtle Grid Pattern - Changed to dark lines with very low opacity */}
  <div className="absolute inset-0 opacity-[0.05] [mask-image:radial-gradient(ellipse_at_center,black,transparent)] bg-[grid-slate-900/20] pointer-events-none">
    <div className="absolute inset-0 opacity-10"></div>
  </div>

  <div className="relative max-w-6xl mx-auto px-6 flex flex-col items-center text-center">
    
    {/* Top Badge */}
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 mb-8 shadow-sm animate-fade-in-up">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span>
      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Rahisi • Salama • Haraka</span>
    </div>

    {/* Main Heading */}
    <h1 className="text-5xl lg:text-7xl font-extrabold tracking-normal leading-[1.1] mb-6 text-slate-900">
         Ajira kwa  
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-blue-600 to-emerald-600">
               kila mtu 
            </span>
        ,   mahali popote
    </h1>

    <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-12 leading-relaxed">
        Kutoka <span className="text-slate-900 font-semibold">taaluma za kampuni</span> hadi 
        <span className="text-slate-900 font-semibold"> fursa za kila siku mtaani</span>. 
        Tunakuunganisha na kazi zote katika mfumo mmoja—rahisi, salama, na haraka kwa kila mtu.
     </p>

  

    {/* Professional Search Bar */}
    <div className="w-full max-w-4xl mx-auto mb-10">
      <div className="relative group">
        {/* Softer glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-blue-500/20 rounded-[22px] blur-md opacity-0 group-hover:opacity-100 transition duration-500"></div>
        
        <div className="relative bg-white border border-slate-200 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-2 sm:p-3 flex flex-col sm:flex-row items-center gap-2">
          <div className="relative flex-1 w-full flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder={`Try "${suggestions[currentSuggestion]}"`}
              className="w-full bg-transparent pl-12 pr-4 py-4 text-slate-900 placeholder-slate-400 focus:outline-none text-lg"
            />
          </div>
          
          <div className="h-8 w-[1px] bg-slate-200 hidden sm:block"></div>

          <Link to="/all-jobs" className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white hover:bg-indigo-700 font-bold rounded-xl transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 group/btn">
            Find Opportunities
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>

    {/* Category Quick Links */}

      <div className="flex flex-wrap justify-center items-center gap-4 md:gap-12 mb-16">
        
        {/* Professional Category */}
        <div className="group flex items-center gap-4 p-2 pr-4 rounded-2xl hover:bg-white hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 border border-transparent hover:border-indigo-100">
          <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm">
            <Building2 className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight">Professional Jobs</span>
            <span className="text-xs text-slate-500">Ajira za Kitaaluma</span>
          </div>
        </div>

        {/* Separator - Hidden on Mobile */}
        <div className="hidden md:block h-8 w-[1px] bg-gradient-to-b from-transparent via-slate-200 to-transparent"></div>

        {/* Casual Category */}
        <div to="/jobs/individual" className="group flex items-center gap-4 p-2 pr-4 rounded-2xl hover:bg-white hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 border border-transparent hover:border-emerald-100">
          <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shadow-sm">
            <Briefcase className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors tracking-tight">Casual / Street Jobs</span>
            <span className="text-xs text-slate-500">Ajira za Mtaani</span>
          </div>
        </div>
      </div>

    {/* Social Proof / Trust Bar */}
    <div className="pt-8 border-t border-slate-200 w-full flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
       <div className="flex items-center gap-2 text-slate-700">
          <Users className="w-5 h-5" />
          <span className="text-sm font-bold uppercase tracking-tight">Active Seekers</span>
       </div>
       <div className="flex items-center gap-2 text-slate-700">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-sm font-bold uppercase tracking-tight">Verified Jobs</span>
       </div>
       <div className="flex items-center gap-2">
          <div className="font-black text-xl italic tracking-tighter text-slate-400">TRUSTED JOBS</div>
       </div>
    </div>
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



    <section className="bg-slate-50 py-24 px-6 relative overflow-hidden">
      {/* Soft decorative background element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/[0.03] rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-16">
          <h3 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Kwanini uchague <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">AjiraUnity</span> leo?
          </h3>
          <p className="text-slate-600 mt-4 max-w-2xl mx-auto text-lg">
          Mfumo mmoja kwa kazi zote 😎— rahisi, salama, na haraka.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`group relative p-8 rounded-3xl border border-slate-200 bg-white hover:border-indigo-200 transition-all duration-500 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 ${feature.grid}`}
            >
              {/* Subtle Gradient Glow on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`}></div>
              
              <div className="relative z-10 cursor-pointer">
                <div className="mb-6 inline-block p-3 rounded-2xl bg-slate-50 border border-slate-100 group-hover:bg-white group-hover:scale-110 transition-all duration-500">
                  {feature.icon}
                </div>
                
                <h4 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">
                  {feature.title}
                </h4>
                
                <p className="text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors">
                  {feature.description}
                </p>

             
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Call to Action */}
        <div className="mt-20 text-center">
          <Link to="/account-type" className="px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-3xl transition-all shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transform hover:-translate-y-1">
            Anza Sasa Bila Malipo
          </Link>
        </div>
      </div>
    </section>

    <FAQ/>
  
    </div>
  );
}