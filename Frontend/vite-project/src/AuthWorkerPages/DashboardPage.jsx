import { Link } from "react-router-dom"
import {
     BriefcaseBusiness,ListChecks,BadgeCheck,NotebookPen,BellRing,FileCheck,
     Headset,ClockAlert,UserRoundPen,BookmarkCheck, Loader
    } from "lucide-react"

import { AuthContext } from "../AxiosApi/AuthPages"
import { useContext } from "react";
import { JobsCounterContext } from "./Context/JobsCounter";


export default function WorkerDashboardPage() {

    const {Email} = useContext(AuthContext);
    const {countAppliedJobs, countSavedJobs,loading} = useContext(JobsCounterContext)

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


        {/* background colors */ } 
<div className="
    relative 
    bg-gradient-to-br from-gray-50 to-gray-100 
    text-gray-800 
    overflow-hidden  
    p-6 sm:p-10 
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
                           <Loader size={40} className="animate-spin text-lime-600" />
                        </>
                      ):(
                        <>
                        {countSavedJobs}
                        </>
                      )}
                      </h2>
                      <div className="text-green-600 p-2 text-2xl bg-green-500/10">
                        <BookmarkCheck/>
                      </div>
                   </div>  
                   <p className="text-green-400 text-sm font-light">My Saved Jobs</p>
                </div>

                <div className="py-6 px-4 w-11/12 shadow-xl rounded-lg bg-white/45">
                   <div className="flex items-center justify-between pb-2">

                     <h2 className="font-josefin text-5xl text-zinc-800/60"> 
                      {loading ? (
                        <>
                           <Loader size={40} className="animate-spin text-lime-600" />
                        </>
                      ):(
                        <>
                        {countAppliedJobs}
                        </>
                      )}
                      </h2>
                      
                      <div className="text-stone-600 p-2 text-2xl bg-stone-500/10">
                        <FileCheck/>
                      </div>
                   </div>
                   <p className="text-stone-500 text-sm font-light">My Job Applications</p>
                </div>

                <div className="py-6 px-4 w-11/12 shadow-xl rounded-lg bg-white/45">
                   <div className="flex items-center justify-between pb-2">
                      <h2 className="font-josefin text-5xl text-fuchsia-800/60">-</h2>
                      <div className="text-indigo-800 p-2 text-2xl bg-indigo-500/10">
                        <BellRing/>
                      </div>
                   </div>
                   <p className="text-indigo-400 text-sm font-light">Notifications</p>
                </div>

            </div>

            <div className="container justify-items-center grid grid-cols-1  gap-4 items-center py-10">
                    <div className="container shadow-lg py-8 px-6">
                         <h1 className="text-teal-400 font-black text-xl md:text-2xl py-4">Quick Links</h1>
                        <div className="w-full space-y-4">

                            <div className="flex items-center space-x-4">
                                <div className="p-4 bg-lime-700/20 text-lime-700 rounded-md font-extrabold">
                                    <UserRoundPen className="w-8 h-8 md:h-10 md:w-10"/>
                                </div>

                                <div>
                                    <Link to="/dashboard-user-job-seeker/job-seeker-type/" className="md:text-xl text-base font-bold text-gray-700 ">Career Profile</Link>
                                    <p className="text-gray-600 text-sm">Build your profile to stand out and apply for the right jobs, here.</p>

                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <div className="p-4 bg-teal-700/15 rounded-md text-teal-700 font-extrabold">
                                    <BriefcaseBusiness className="w-8 h-8 md:h-10 md:w-10"/>
                                </div>

                                <div>
                                    <Link to="/all-jobs/" className="md:text-xl text-base font-bold text-gray-700 ">Find a Job</Link>
                                    <p className="text-gray-600 text-sm">Discover jobs you’ll love near you and apply in just a few clicks.</p>

                                </div>

                            </div>

                            


                        </div>
                    </div>

                     {/* <div className="container lg:col-span-2">
                        <div className="py-4">
                            <h1 className="md:text-2xl md:text-center text-xl text-blue-300 font-black pb-6">Maendeleo ya profaili yako</h1>
                         <ProfileProgress/>
                        </div>
                    </div> */}



                </div>
        </div>
    
    </div>
          
    
 </div>
            
</div>
    )
    
}