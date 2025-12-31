
import { useContext, useState } from "react";
import { Link , NavLink} from "react-router-dom";
import { Menu, X, Loader, User2, LogOut } from "lucide-react";

import { AuthContext } from "../AxiosApi/AuthPages";

export default function Navigation() {
  const [open, setOpen] = useState(false);

  const {isAuthenticated, userRole, Email, loading, Logout} = useContext(AuthContext);

  const navClass = ({isActive})=>{ 
    return isActive ? "text-indigo-700 underline underline-offset-4 decoration-indigo-700 decoration-2 font-bold"
     : "text-neutral-800 font-bold hover:underline underline-offset-4"
    };

   

  return (

    <nav className="bg-blue-50/40 backdrop-blur-md shadow-md sticky top-0 z-50">

      <div className="container mx-auto px-6 lg:px-14 py-2 flex justify-between items-center">

       {/* Logo */}
          <Link to="/" className="group flex items-center no-underline">
            {/* Optional Modern Icon (Unity/Connection Symbol) */}
           

            {/* The Text */}
            <span className="font-sans text-3xl md:text-4xl font-black tracking-tight text-slate-900">
              Ajira
              <span className="bg-gradient-to-r from-indigo-600 via-indigo-900-600 to-cyan-500 bg-clip-text text-transparent">
                unity
              </span>
            </span>
          </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-10">
          <NavLink to="/" className={navClass}>
            Home
          </NavLink>
          <NavLink to="/all-jobs" className={navClass}>
           All Jobs
          </NavLink>
          {/* <NavLink to="/talents" className={navClass}>
            
          </NavLink> */}
          <a href="#site-footer" className="font-bold hover:underline decoration-indigo-600 ">
            Help?
          </a>
        </div>



  <div>
        {loading ? (
         
            <div className="flex items-center space-x-4 animate-pulse">
              {/* Profile icon skeleton */}
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-200 to-slate-300 shadow-inner" />

              {/* Text skeleton */}
              <div className="flex flex-col space-y-2">
                <div className="w-24 h-4 rounded-full bg-gradient-to-r from-slate-200 to-slate-300" />
                <div className="w-16 h-3 rounded-full bg-gradient-to-r from-slate-200 to-slate-300" />
              </div>
            </div>
                
          
        ):(
      <div>
         {isAuthenticated === true && Email !== null && userRole !== null? (
      <div className=" hidden md:flex space-x-4 items-center">
        
       <div>  
          {userRole === "EMPLOYER" && (
            <NavLink 
              to="/dashboard-user-employer" 
              className="flex items-center gap-3 p-1.5 pr-4 rounded-2xl hover:border-indigo-200 transition-all duration-300 group"
            >
              <div className="relative">
                <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                  <User2 size={20} />
                </div>
                <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white"></span>
              </div>
                
              <div className="flex truncate">
                <h2 className="font-bold text-gray-800 truncate capitalize">
                  {Email.split("@")[0]}
                </h2>
              </div>
            </NavLink>
          )}
             

          {userRole === "WORKER" && (
            <NavLink 
              to="/dashboard-user-job-seeker" 
              className="flex items-center gap-3 p-1.5 pr-4 rounded-2xl hover:border-indigo-200 transition-all duration-300 group"
            >
              <div className="relative">
                <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                  <User2 size={20} />
                </div>
                <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white"></span>
              </div>
                
              <div className="flex truncate">
                <h2 className="font-bold text-gray-800 truncate capitalize">
                  {Email.split("@")[0]}
                </h2>
              </div>
            </NavLink>
          )}
        </div>
            
          <button onClick={Logout}
           className="flex items-center justify-between w-full px-4 py-2.5 text-sm font-medium text-gray-500 transition-all duration-200 rounded-xl group hover:bg-red-50 hover:text-red-600">
                <span className="flex items-center gap-3">
                  <LogOut size={18} className="text-red-400 transition-colors" />
                  <span>Logout</span>
                </span>
          </button>
    </div>
         ): (

      <div className="hidden md:flex items-center space-x-4">
          <NavLink
            to="/account-type"
            className="px-6 py-2.5 text-base font-medium text-indigo-700 border-2 border-indigo-600 rounded-full hover:bg-gradient-to-r hover:from-indigo-600 hover:to-indigo-500 hover:text-white hover:border-transparent transition-all duration-300 shadow-sm hover:shadow-md"
          >
            Create account
          </NavLink>

          <NavLink
            to="/user-login"
            className="px-6 py-2.5 text-base font-medium text-white bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-full hover:from-indigo-700 hover:to-cyan-600 shadow-md hover:shadow-lg transition-all duration-300"
          >
            Login
          </NavLink>
     </div>

            )}
       </div>
        )}

  </div>


       

        {/* Mobile Toggle Button */}
        <button onClick={() => setOpen(prev=>!prev)} className="md:hidden">
            {open ? (
              <div className="bg-indigo-50 p-2 rounded-lg">
                <X size={28} className="text-gray-800" />
              </div>
            ) : (
                <Menu size={28} className="text-gray-800" />
            )}
        </button>
      </div>

      {/* Mobile Dropdown */}
     
      {open && (
      <div className="p-8 md:hidden"> 
      <div className="flex items-start space-y-4 flex-col" >

            <NavLink
              to="/"
              className={navClass}
              onClick={()=> setOpen(false)}
             
            >
              Home
            </NavLink>
            {/* <NavLink
              to="/how-it-work"
              className={navClass}
              onClick={()=> setOpen(false)}
              
            >
              How It Works
            </NavLink> */}
            <NavLink
              to="/all-jobs"
              className={navClass}
              onClick={()=> setOpen(false)}
              
            >
              All Jobs
            </NavLink>

             {/* <NavLink
              to="/talents"
              className={navClass}
              onClick={()=> setOpen(false)}
              
            >
              Talents
            </NavLink> */}

           
            <a  onClick={()=> setOpen(false)}
                 href="#site-footer" 
                 className="font-bold hover:underline decoration-indigo-600 ">
                Help?
              </a>

             
     </div>




  <div className="mt-10">
      {loading ? (
         <div className="flex items-center space-x-4 animate-pulse">
              {/* Profile icon skeleton */}
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-200 to-slate-300 shadow-inner" />

              {/* Text skeleton */}
              <div className="flex flex-col space-y-2">
                <div className="w-24 h-4 rounded-full bg-gradient-to-r from-slate-200 to-slate-300" />
                <div className="w-16 h-3 rounded-full bg-gradient-to-r from-slate-200 to-slate-300" />
              </div>
         </div>
          
        ):(
      <div>
         {isAuthenticated === true && Email !== null && userRole !== null? (
      <div className="flex items-start space-y-4 flex-col">
        
         <div>  
               {userRole === "EMPLOYER" && (
            <NavLink 
              to="/dashboard-user-employer" 
              onClick={()=> setOpen(false)}
              className="flex items-center gap-3 p-1.5 pr-4 rounded-2xl hover:border-indigo-200 transition-all duration-300 group"
            >
              <div className="relative">
                <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                  <User2 size={20} />
                </div>
                <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white"></span>
              </div>
                
              <div className="flex truncate">
                <h2 className="font-bold text-gray-800 truncate capitalize">
                  {Email.split("@")[0]}
                </h2>
              </div>
            </NavLink>
          )}
             

          {userRole === "WORKER" && (
            <NavLink 
              to="/dashboard-user-job-seeker" 
              onClick={()=> setOpen(false)}
              className="flex items-center gap-3 p-1.5 pr-8 hover:border-indigo-200 transition-all duration-300 group"
            >
              <div className="relative">
                <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                  <User2 size={20} />
                </div>
                <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white"></span>
              </div>
                
              <div className="flex truncate">
                <h2 className="font-bold text-gray-800 truncate capitalize">
                  {Email.split("@")[0]}
                </h2>
              </div>
            </NavLink>
          )}
        </div>
            
          <button onClick={Logout} className="flex items-start  px-4 py-2.5 text-sm font-medium text-gray-700 transition-all duration-200 rounded-xl group hover:text-red-600">
                <span className="flex items-center gap-3">
                  <LogOut size={18} className="text-red-600 transition-colors" />
                  <span>Logout</span>
                </span>
          </button>
    </div>
         ): (
   
              <div className="flex items-start space-y-4 flex-col">
                  <NavLink
                   onClick={()=> setOpen(false)}
                    to="/account-type"
                     className="px-6 py-2.5 text-base font-medium
                      text-indigo-700 border-2 border-indigo-600 rounded-full hover:bg-gradient-to-r
                       hover:from-indigo-600 hover:to-indigo-500 hover:text-white hover:border-transparent
                        transition-all duration-300 shadow-sm hover:shadow-md"
                      >
                      Create account
                  </NavLink>

                  <NavLink
                    onClick={()=> setOpen(false)}
                    to="/user-login"
                     className="px-6 py-2.5 text-base font-medium text-white bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-full hover:from-indigo-700
                      hover:to-cyan-600 shadow-md hover:shadow-lg transition-all duration-300"
                   
                  >
                    Login
                  </NavLink>
              </div>

            )}
       </div>
        )}

  </div>




     </div>
        
        )}
      
    </nav>
  );
}


