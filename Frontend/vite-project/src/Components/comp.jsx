
import { useContext, useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, Loader2, User, LogOut, Briefcase, Search } from "lucide-react";
import { AuthContext } from "../AxiosApi/AuthPages";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, userRole, Email, loading, logout } = useContext(AuthContext);
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinkClasses = ({ isActive }) =>
    isActive
      ? "text-indigo-600 bg-indigo-50 font-semibold px-4 py-2 rounded-full transition-all"
      : "text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 font-medium px-4 py-2 rounded-full transition-all";

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-1">
            <span className="text-3xl lg:text-4xl font-bold tracking-tight">
              D<span className="text-indigo-500">e</span>i
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <NavLink to="/" className={navLinkClasses}>Home</NavLink>
            <NavLink to="/how-it-work" className={navLinkClasses}>How It Works</NavLink>
            <NavLink to="/all-jobs" className={navLinkClasses}>Jobs</NavLink>
            <NavLink to="/talents" className={navLinkClasses}>Talents</NavLink>
            <NavLink to="/account-type" className={navLinkClasses}>Post a Job</NavLink>
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden lg:flex items-center gap-4">
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin text-gray-600" />
            ) : isAuthenticated && Email ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-full">
                  <User className="w-5 h-5 text-indigo-600" />
                  <span className="font-medium text-gray-800">
                    {Email.split("@")[0]}
                  </span>
                </div>

                {userRole === "EMPLOYER" && (
                  <NavLink
                    to="/dashboard-user-employer"
                    className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-full hover:bg-indigo-700 transition font-medium"
                  >
                    <Briefcase className="w-4 h-4" />
                    Dashboard
                  </NavLink>
                )}
                {userRole === "WORKER" && (
                  <NavLink
                    to="/dashboard-user-job-seeker"
                    className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-full hover:bg-indigo-700 transition font-medium"
                  >
                    <Search className="w-4 h-4" />
                    Dashboard
                  </NavLink>
                )}

                <button
                  onClick={logout}
                  className="text-gray-500 hover:text-red-600 transition p-2 rounded-lg hover:bg-red-50 transition"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <NavLink
                  to="/account-type"
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition font-medium"
                >
                  Register
                </NavLink>
                <NavLink
                  to="/user-login"
                  className="px-6 py-2.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition font-medium shadow-md"
                >
                  Login
                </NavLink>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100">
          <div className="px-4 py-6 space-y-6">
            {/* Mobile Nav Links */}
            <div className="space-y-4">
              {[
                { to: "/", label: "Home" },
                { to: "/how-it-work", label: "How It Works" },
                { to: "/all-jobs", label: "Jobs" },
                { to: "/talents", label: "Talents" },
                { to: "/account-type", label: "Post a Job" },
              ].map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={navLinkClasses}
                  onClick={closeMenu}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>

            {/* Mobile Auth Section */}
            <div className="border-t border-gray-200 pt-6">
              {loading ? (
                <div className="flex justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                </div>
              ) : isAuthenticated && Email ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-2xl">
                    <div className="p-3 bg-indigo-600 text-white rounded-full">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {Email.split("@")[0]}
                      </p>
                      <p className="text-sm text-gray-600 capitalize">{userRole.toLowerCase()}</p>
                    </div>
                  </div>

                  {userRole === "EMPLOYER" && (
                    <Link
                      to="/dashboard-user-employer"
                      onClick={closeMenu}
                      className="block w-full text-center bg-indigo-600 text-white py-3 rounded-xl text-center font-semibold hover:bg-indigo-700 transition"
                    >
                      Employer Dashboard
                    </Link>
                  )}
                  {userRole === "WORKER" && (
                    <Link
                      to="/dashboard-user-job-seeker"
                      onClick={closeMenu}
                      className="block w-full text-center bg-indigo-600 text-white py-3 rounded-xl text-center font-semibold hover:bg-indigo-700 transition"
                    >
                      Job Seeker Dashboard
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      logout?.();
                      closeMenu();
                    }}
                    className="w-full py-3 border border-red-200 text-red-600 rounded-xl font-medium hover:bg-red-50 transition"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link
                    to="/account-type"
                    onClick={closeMenu}
                    className="block w-full text-center py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition"
                  >
                    Register
                  </Link>
                  <Link
                    to="/user-login"
                    onClick={closeMenu}
                    className="block w-full text-center py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition"
                  >
                    Login
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}




