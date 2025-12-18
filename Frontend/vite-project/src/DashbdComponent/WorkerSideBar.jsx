import { useContext, useState } from "react";
import { Link ,NavLink} from "react-router-dom";
import { 
  Menu, X, LayoutDashboard, User, FileCheck, Settings,Headset,
  BookmarkCheck, BriefcaseBusiness, LogOut, ArrowLeftFromLine,
  MessageCircle, Mail, Phone, User2
} from "lucide-react";

import { AuthContext } from "../AxiosApi/AuthPages";






export default function WorkerSideBar() {

    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    
    const [showHelpModal, setShowHelpModal] = useState(false);


    const {Email, userRole, Logout} = useContext(AuthContext);

   

    const toggleMobile = () => {
        setIsMobileOpen(prev => !prev);
    };

    const toggleCollapse = () => {
        setIsCollapsed(prev => !prev);
    };

     const handeClick = (label, link, event)=>{
        if (window.innerWidth < 768){
            setIsMobileOpen(false);
        }

         if (label === "Need Help") {
            event.preventDefault(); 
            setShowHelpModal(true);
            return;
            }
    }

    // Determine sidebar width based on screen size and states
    const sidebarWidthClasses = isCollapsed ? 'md:w-20' : 'md:w-64';
    const mobileClasses = isMobileOpen ? 'w-64' : 'w-0';

    const contentShiftClasses = isCollapsed ? 'md:ml-20' : 'md:ml-64';


 

  


    return (
       
        <div className={`bg-gray-50 min-h-screen ${isMobileOpen ? 'fixed z-40 inset-0 bg-black/50 md:static md:bg-gray-50' : ''}`}>
            
            {!isMobileOpen && (
                <button 
                    onClick={toggleMobile} 
                    className="fixed md:hidden left-4 top-4 z-30 p-2 bg-white rounded-lg shadow-md text-gray-900"
                    aria-label="Open sidebar"
                >
                    <Menu size={24} />
                </button>
            )}

            {/* Sidebar Container */}
            <div 
                className={`
                    bg-white shadow-lg border-r fixed top-0 left-0 h-full overflow-hidden transition-all duration-300 z-50 
                    ${mobileClasses} ${sidebarWidthClasses} 
                `}
            >
                
                
                <div className="flex flex-col h-full">
                    
                   
                    <div className={`flex ${isCollapsed ? 'justify-center' : 'justify-between'} items-center p-4`}>
                       
                        {!isCollapsed && (
                          

                         <div className="flex items-center gap-4 py-3 px-2">
                            <div className="relative flex-shrink-0">
                                <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 text-indigo-600 shadow-sm transition-transform duration-300 group-hover:scale-105">
                                <User2 size={22} strokeWidth={2.5} />
                                </div>
                                <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-green-500 border-2 border-white"></span>
                                </span>
                            </div>

                            {/* Info Section */}
                            <div className="flex flex-col min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                <h2 className="text-sm font-bold text-gray-900 truncate capitalize tracking-tight">
                                    {Email.split("@")[0]}
                                </h2>
                                </div>
                                <div className="flex items-center">
                                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700 uppercase tracking-wider">
                                    {userRole}
                                </span>
                                </div>
                            </div>
                            </div>


                        )}


                        <button 
                            onClick={toggleMobile} 
                            className="p-1 md:hidden text-gray-900"
                            aria-label="Close sidebar"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
                        
                        {[
                            { icon: LayoutDashboard, label: 'Dashboard', link: '/dashboard-user-job-seeker/', isActive: true, color: 'text-white bg-black/65' },
                            { icon: BriefcaseBusiness, label: 'Find a Job', link: '/all-jobs/', color: 'text-indigo-800 bg-indigo-500/15' },
                            { icon: User, label: 'Career Profile', link: '/dashboard-user-job-seeker/job-seeker-type/',color: 'text-green-700 bg-green-500/15' },
                            { icon: FileCheck, label: 'My Job Applications', link: '/dashboard-user-job-seeker/all-applied-jobs-job-seeker/', color: 'text-lime-700 bg-lime-500/15' },
                            { icon: BookmarkCheck, label: 'My Saved Jobs', link: '/dashboard-user-job-seeker/all-saved-jobs/', color: 'text-orange-800 bg-orange-500/15' },
                            { icon: Headset, label: 'Need Help', link: '/dashboard-user-job-seeker/123', color: 'text-fuchsia-800 bg-fuchsia-500/15' },
                            // { icon: Settings, label: 'Account Settings', link: '/dashboard-user-job-seeker/#', color: ' text-amber-700 bg-amber-500/25' },
                        ].map((item, index) => (

                            <NavLink key={index} to={item.link} className='block group transition-colors duration-200'
                                onClick={(e)=> handeClick(item.label, item.link, e)}
                                end={item.link ==='/dashboard-user-job-seeker/'}
                                >
                                {({isActive})=>(
                                     <div 
                                    className={`
                                        flex items-center space-x-4 p-2 rounded-lg transition-colors
                                        ${isActive ? 'border-l-4 border-emerald-800 bg-gray-200 text-indigo-700 font-semibold ' : 'hover:bg-gray-100 text-gray-800'}
                                        ${isCollapsed ? 'justify-center' : ''}
                                    `}
                                >  
                                <div className={` ${isActive? 'bg-gray-800 text-indigo-700':item.color}  p-1 rounded-full flex-shrink-0`}>
                                        <item.icon size={20} />
                                </div>
                                {!isCollapsed && (
                                     <p className={`whitespace-nowrap text-sm text-gray-900 `}>
                                        {item.label}
                                    </p>

                                )}
                                  </div>
                                )}        
                              
                            </NavLink>
                        ))}
                    </nav>

                    
                    <div className="p-4 border-t">
                       
                        <Link onClick={Logout} to="" className="block group ">
                            <div className={`flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-100 ${isCollapsed ? 'justify-center' : ''}`}>
                                <div className="text-red-800 bg-red-500/15 p-1 rounded-full flex-shrink-0">
                                    <LogOut size={20} />
                                </div>
                                <p className={`whitespace-nowrap ${isCollapsed ? 'hidden' : 'block'}`}>Logout</p>
                            </div>
                        </Link>

                        
                        <button 
                            onClick={toggleCollapse} 
                            className={`hidden md:flex mt-4 p-2 w-full justify-center items-center text-gray-700 hover:bg-gray-100 rounded-lg`}
                            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                        >
                            <ArrowLeftFromLine 
                                size={20} 
                                className={`transition-transform ${isCollapsed ? 'rotate-180' : 'rotate-0'}`} 
                            />
                            {!isCollapsed && <span className="ml-3 text-sm font-medium">Collapse</span>}
                        </button>
                    </div>

                </div>
            </div>




                {showHelpModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    {/* Modal Backdrop Click to Close (optional) */}
                    <div 
                    className="absolute inset-0" 
                    onClick={() => setShowHelpModal(false)} 
                    aria-hidden="true"
                    />

                    <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                    {/* Header */}
                    <div className="bg-green-500 px-6 py-5">
                        <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold">Need Help?</h2>
                        <button
                            onClick={() => setShowHelpModal(false)}
                            className="p-2 rounded-full hover:bg-white/20 transition-colors"
                            aria-label="Close modal"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        </div>
                        <p className="mt-2 text-white/90">Reach us quick</p>
                    </div>


                    {/* Body */}
                    <div className="p-6 space-y-4">
                        {/* WhatsApp */}
                        <a
                        href="https://wa.me/255755880249"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 w-full p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-all transform hover:scale-105 border border-green-200"
                        >
                        <div className="p-3 bg-green-600 text-white rounded-full">
                            <MessageCircle className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-gray-800">Chat on WhatsApp</p>
                            <p className="text-sm text-gray-600">Get instant replies</p>
                        </div>
                        </a>

                        {/* Email */}
                        <a
                        href="mailto:support@yourapp.com"
                        className="flex items-center gap-4 w-full p-4 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-all transform hover:scale-105 border border-indigo-200"
                        >
                        <div className="p-3 bg-indigo-600 text-white rounded-full">
                            <Mail className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-gray-800">Send us an Email</p>
                            <p className="text-sm text-gray-600">support@yourapp.com</p>
                        </div>
                        </a>

                        {/* Call */}
                        <a
                        href="tel:+255755880249"
                        className="flex items-center gap-4 w-full p-4 bg-amber-50 hover:bg-amber-100 rounded-xl transition-all transform hover:scale-105 border border-amber-200"
                        >
                        <div className="p-3 bg-amber-600 text-white rounded-full">
                            <Phone className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-gray-800">Call Support</p>
                            <p className="text-sm text-gray-600">+255 755 880 249</p>
                        </div>
                        </a>
                    </div>

                    {/* Footer */}
                    <div className="px-6 pb-6">
                        <button
                        onClick={() => setShowHelpModal(false)}
                        className="w-full py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors"
                        >
                        Close
                        </button>
                    </div>
                    </div>
                </div>
                )}




            {/* Main Content Area */}
            <div className={` transition-all duration-300 ${contentShiftClasses}`}>
               
            </div>

        </div>
    );
}


