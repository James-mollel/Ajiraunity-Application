import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Menu, X, LayoutDashboard, MessageSquareDot, MailCheck, ClockAlert,ListChecks,
  BookmarkCheck, MessageSquareMore, LogOut, ArrowLeftFromLine 
} from "lucide-react";
import EmployerDashboard from "../Container/EmployerDashb";


export default function CompleteEmployerDashboard() {
    
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleMobile = () => {
        setIsMobileOpen(prev => !prev);
    };

    const toggleCollapse = () => {
        setIsCollapsed(prev => !prev);
    };

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
                            <div className="flex items-center space-x-3">
                                <img src="/face2.jpeg" alt="User" className="w-10 h-10 object-cover rounded-full" />
                                <div>
                                    <h1 className="text-lg text-indigo-700 font-semibold">James Mollel</h1>
                                    <div className="flex justify-between items-center">
                                        <p className="text-gray-500 text-sm">employer</p>
                                        <p className="px-1 text-xs bg-green-500/15 text-green-800 rounded-xl">Active</p>   
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
                            { icon: LayoutDashboard, label: 'Dashboard', link: '', isActive: true, color: 'text-white bg-black/65' },
                            { icon: MessageSquareMore, label: 'Kazi zisizo na waombaji', link: 'in-active', color: 'text-indigo-800 bg-indigo-500/15' },
                            { icon: MessageSquareDot, label: 'Zinazosubiri kuthibitishwa', link: '',color: 'text-green-700 bg-green-500/15' },
                            { icon: MailCheck, label: 'Zilizothibitishwa', link: '', color: 'text-lime-700 bg-lime-500/15' },
                            { icon: ClockAlert, label: 'Zilizo Kwishamuda', link: '/dashboard-user-employer/expire', color: 'text-orange-800 bg-orange-500/15' },
                            { icon: ListChecks, label: 'Kazi zote', link: '', color: 'text-fuchsia-800 bg-fuchsia-500/15' },
                            { icon: BookmarkCheck, label: 'Waombaji uliowahifadhi', link: '', color: ' text-amber-700 bg-amber-500/25' },
                        ].map((item, index) => (
                            <Link key={index} to={item.link} className="block group">
                                <div 
                                    className={`
                                        flex items-center space-x-4 p-2 rounded-lg transition-colors
                                        ${item.isActive ? 'border-l-4 border-emerald-800 bg-gray-100' : 'hover:bg-gray-100'}
                                        ${isCollapsed ? 'justify-center' : ''}
                                    `}
                                >
                                    <div className={`${item.color} p-1 rounded-full flex-shrink-0`}>
                                        <item.icon size={20} />
                                    </div>
                                    <p className={`whitespace-nowrap text-sm text-gray-900 ${isCollapsed ? 'hidden' : 'block'}`}>{item.label}</p>
                                </div>
                            </Link>
                        ))}
                    </nav>

                    
                    <div className="p-4 border-t">
                       
                        <Link to="" className="block group ">
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

            {/* Main Content Area */}
            <div className={` transition-all duration-300 ${contentShiftClasses}`}>
                <EmployerDashboard/>
            </div>

        </div>
    );
}