import { Link } from "react-router-dom"
import {
       BriefcaseBusiness,Users2
       , Building2,FilePlus,Loader
     
    } from "lucide-react"

import { AuthContext } from "../AxiosApi/AuthPages"
import { useContext } from "react";
import { EmployerCounterContex } from "./Context/CounterContex";


export default function EmployerDashboard() {
    const {Email} = useContext(AuthContext);

    const {countJobs, countCompanies, countApplicants, loading } = useContext(EmployerCounterContex);


    return(
        <div className="bg-gray-50">
            {/* language  */}
            <div className="w-full py-3 md:px-5 pl-8 pr-5  border-b flex items-center justify-between">
                <div className="pl-10 md:pl-0">
                   <Link
                        to="/"
                        className="font-inter text-4xl md:text-5xl text-gray-900 drop-shadow-md font-bold tracking-tight"
                        >
                        Ajira<span className="text-blue-700 lowercase" >unity</span>
                  </Link>
                </div>
                <form action="">
                    <select name="" id="" className=" border border-gray-100 outline-none rounded-sm text-gray-700
                 py-2 px-6 bg-gray-100 text-center">
                        <option value="English">English</option>
                    </select>
                </form>
             </div>
        {/* language  */}
         
<div className="
    relative 
    bg-gradient-to-br from-gray-50 to-gray-100 
    text-gray-800 
    overflow-hidden  
    p-2 sm:p-10 
">
    <div className="absolute inset-0 z-0 overflow-hidden">
        
        <div className="
            absolute -top-24 -left-24 sm:-top-32 sm:-left-32 
            w-80 h-80 sm:w-96 sm:h-96 
            bg-blue-50 
            transform rotate-45 
            rounded-3xl
        "></div>
     
        <div className="
            absolute top-1/2 left-1/4 
            w-64 h-64 sm:w-80 sm:h-80 
            bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100 
            transform -rotate-45 
            rounded-full
        "></div>
        <div className="
            absolute -bottom-24 -right-24 sm:-bottom-32 sm:-right-32 
            w-80 h-80 sm:w-96 sm:h-96
            bg-emerald-800/20 
            transform -rotate-180 
            rounded-2xl
            opacity-70 
        "></div>
         <div className="
            absolute bottom-1/2 right-1/4 transform translate-x-1/2 translate-y-1/2 
            w-72 h-80
            bg-indigo-100/45
            transform rotate-90 shadow-black/15
            rounded-sm
            hidden sm:block
        "></div>

    </div>
    
    {/*  Content */}
    <div className="relative z-10 container mx-auto"> 
        <div className="w-full flex justify-center items-center">
           <h1 className="
                    text-2xl md:text-5xl text-center 
                    font-extrabold tracking-wider"> Welcome back, 
                      <span className="text-green-400">{Email.split("@")[0]}!</span>
            </h1>
        </div> 
        <div className="container mx-auto py-8 px-4">
            <div className="w-full py-4">
                <h1 className="md:text-2xl text-xl text-blue-300 font-black ">Short notice</h1>
            </div>
            <div className="w-full grid grid-cols-1 lg:grid-cols-3 lg:grid-rows-1
             items-center justify-items-center gap-4">

                <div className="py-6 px-4 w-11/12 shadow-xl rounded-lg bg-white/45">
                   <div className="flex items-center justify-between pb-2">
                      <h2 className="font-josefin text-5xl text-lime-600/60">
                          {loading ? (
                        <>
                           <Loader size={40} className="animate-spin text-lime-600/60" />
                        </>
                        ):(
                        <>
                        {countJobs}
                        </>
                      )}
                      </h2>
                      <div className="text-green-600 p-2 text-2xl bg-green-500/10">
                        <BriefcaseBusiness/>
                      </div>
                   </div>
                   <p className="text-green-400 text-sm font-light">My Jobs</p>
                </div>

                <div className="py-6 px-4  w-11/12 shadow-xl rounded-lg bg-white/45">
                   <div className="flex items-center justify-between pb-2">
                      <h2 className="font-josefin text-5xl text-zinc-800/60">
                        {loading ? (
                        <>
                           <Loader size={40} className="animate-spin text-zinc-800/60" />
                        </>
                      ):(
                        <>
                        {countApplicants}
                        </>
                      )}
                      </h2>
                      <div className="text-stone-600 p-2 text-2xl bg-stone-500/10">
                        <Users2/>
                      </div>
                   </div>
                   <p className="text-stone-500 text-sm font-light">Job Applicants</p>
                </div>

                <div className="py-6 px-4 w-11/12 shadow-xl rounded-lg bg-white/45">
                   <div className="flex items-center justify-between pb-2">
                      <h2 className="font-josefin text-5xl text-fuchsia-800/60">
                        {loading ? (
                        <>
                           <Loader size={40} className="animate-spin text-fuchsia-800/60" />
                        </>
                      ):(
                        <>
                        {countCompanies}
                        </>
                      )}
                      </h2>
                      <div className="text-indigo-800 p-2 text-2xl bg-indigo-500/10">
                        <Building2/>
                      </div>
                   </div>
                   <p className="text-indigo-400 text-sm font-light">My Companies</p>
                </div>

            </div>

            <div className="container justify-items-center grid grid-cols-1  gap-4 items-center py-10">
                    <div className="container lg:col-span-2 shadow-lg py-8 px-6 md:px-9">
                         <h1 className="text-teal-400 font-black text-xl md:text-2xl py-4">Quick Links</h1>
                        <div className="w-full space-y-4">
                            <div className="flex items-center space-x-4">
                                <div className="p-4 bg-orange-700/15 rounded-md text-orange-700 font-extrabold">
                                    <FilePlus className="w-8 h-8 md:h-10 md:w-10"/>
                                </div>

                                <div>
                                    <Link to="/dashboard-user-employer/choose-kind-post-jobs/" className="md:text-xl text-sm font-bold text-gray-600 ">Post Jobs</Link>
                                    <p className="text-gray-500 text-sm">Start posting any type of job from casual daily work to specialized career positions.</p>

                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <div className="p-4 bg-teal-700/15 rounded-md text-teal-700 font-extrabold">
                                    <Users2 className="w-8 h-8 md:h-10 md:w-10"/>
                                </div>

                                <div>
                                    <Link to="/dashboard-user-employer/all-appplications-employer/" className="md:text-xl text-sm font-bold text-gray-600 ">Job Applicants</Link>
                                    <p className="text-gray-500 text-sm">Review and manage applications from interested candidates.</p>

                                </div>

                            </div>

                            <div className="flex items-center space-x-4">
                                <div className="p-4 bg-rose-700/15 text-rose-700 rounded-md font-extrabold">
                                    <BriefcaseBusiness className="w-8 h-8 md:h-10 md:w-10"/>
                                </div>

                                <div>
                                    <Link to="/dashboard-user-employer/all-employers-jobs-posted/" className="md:text-xl text-sm font-bold text-gray-600 ">My Jobs</Link>
                                    <p className="text-gray-500 text-sm">Review, edit, or manage all the jobs you have posted.</p>

                                </div>

                            </div>

                           
                        </div>
                    </div>

                  



                </div>
        </div>
    
    </div>
          
    
 </div>
            
</div>
    )
    
}