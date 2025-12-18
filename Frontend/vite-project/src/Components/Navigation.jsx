
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

    <nav className="bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-50">

      <div className="container mx-auto px-6 lg:px-14 py-2 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="font-inter text-4xl md:text-5xl text-gray-900 drop-shadow-md font-bold tracking-tight"
        >
          Ajira<span className="text-blue-700 lowercase" >unity</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-10">
          <NavLink to="/" className={navClass}>
            Home
          </NavLink>
          <NavLink to="/all-jobs" className={navClass}>
            Jobs
          </NavLink>
          {/* <NavLink to="/talents" className={navClass}>
            
          </NavLink> */}
          <a href="#site-footer" className="font-bold hover:underline decoration-indigo-600 ">
            Help?
          </a>
        </div>



  <div>
        {loading ? (
         
         <Loader className="animate-spin text-gray-700"/>
          
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
                    className="py-2 px-5 rounded-md border bg-gradient-to-br from-white via-white to-gray-300 text-gray-800 hover:from-gray-500 hover:to-white hover:text-gray-800 transition"
                  >
                    Register
                  </NavLink>
                  <NavLink
                    to="/user-login"
                    className="py-2 px-5 bg-black rounded-md text-white hover:bg-gray-800 transition"
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
              Jobs
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
         <Loader className="animate-spin text-gray-700"/>
          
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
                    className="py-2 px-5 rounded-md border bg-gradient-to-br from-white via-white to-gray-300 text-gray-800 hover:from-gray-500 hover:to-white hover:text-gray-800 transition"
                  >
                    Register
                  </NavLink>
                  <NavLink
                    onClick={()=> setOpen(false)}
                    to="/user-login"
                    className="py-2 px-5 rounded-md bg-black text-white hover:bg-gray-800 transition"
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


